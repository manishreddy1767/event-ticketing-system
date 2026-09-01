from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.core.dependencies import get_db, require_role
from app.models.event import Event
from app.models.team import Team
from app.models.team_member import TeamMember
from app.models.user import User
from app.schemas.team import (
    TeamCreateRequest,
    TeamMemberAddRequest,
    TeamMemberResponse,
    TeamResponse,
)


router = APIRouter(
    prefix="/teams",
    tags=["Teams"],
)


@router.post(
    "",
    response_model=TeamResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_team(
    team_data: TeamCreateRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role("student")),
):
    event = (
        db.query(Event)
        .filter(
            Event.id == team_data.event_id,
            Event.status == "approved",
        )
        .first()
    )

    if not event:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Event not found",
        )

    existing_team = (
        db.query(Team)
        .join(TeamMember, Team.id == TeamMember.team_id)
        .filter(
            Team.event_id == event.id,
            TeamMember.user_id == current_user.id,
        )
        .first()
    )

    if existing_team:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="You already have a team for this event",
        )

    team = Team(
        event_id=event.id,
        name=team_data.name,
        leader_id=current_user.id,
    )

    db.add(team)
    db.flush()

    leader_member = TeamMember(
        team_id=team.id,
        user_id=current_user.id,
    )

    db.add(leader_member)
    db.commit()
    db.refresh(team)

    return team


@router.post(
    "/{team_id}/members",
    response_model=TeamMemberResponse,
    status_code=status.HTTP_201_CREATED,
)
def add_team_member(
    team_id: int,
    member_data: TeamMemberAddRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role("student")),
):
    team = (
        db.query(Team)
        .filter(
            Team.id == team_id,
            Team.leader_id == current_user.id,
        )
        .first()
    )

    if not team:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Team not found",
        )

    user = (
        db.query(User)
        .filter(User.id == member_data.user_id)
        .first()
    )

    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found",
        )

    existing_member = (
        db.query(TeamMember)
        .filter(
            TeamMember.team_id == team.id,
            TeamMember.user_id == user.id,
        )
        .first()
    )

    if existing_member:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="User is already a team member",
        )

    existing_event_team = (
        db.query(TeamMember)
        .join(Team, TeamMember.team_id == Team.id)
        .filter(
            Team.event_id == team.event_id,
            TeamMember.user_id == user.id,
        )
        .first()
    )

    if existing_event_team:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="User already belongs to a team for this event",
        )

    member = TeamMember(
        team_id=team.id,
        user_id=user.id,
    )

    db.add(member)
    db.commit()
    db.refresh(member)

    return member


@router.get(
    "/{team_id}/members",
    response_model=list[TeamMemberResponse],
)
def get_team_members(
    team_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role("student")),
):
    team = (
        db.query(Team)
        .filter(Team.id == team_id)
        .first()
    )

    if not team:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Team not found",
        )

    is_member = (
        db.query(TeamMember)
        .filter(
            TeamMember.team_id == team_id,
            TeamMember.user_id == current_user.id,
        )
        .first()
    )

    if not is_member:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You are not a member of this team",
        )

    return (
        db.query(TeamMember)
        .filter(TeamMember.team_id == team_id)
        .all()
    )