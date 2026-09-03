from datetime import datetime

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.core.dependencies import get_db, require_role
from app.models.event import Event
from app.models.team import Team
from app.models.ticket import Ticket
from app.models.team_member import TeamMember
from app.models.team_invitation import TeamInvitation
from app.models.user import User
from app.schemas.team import (
    TeamCreateRequest,
    TeamMemberAddRequest,
    TeamMemberResponse,
    TeamResponse,
    TeamInvitationResponse,
)


router = APIRouter(
    prefix="/teams",
    tags=["Teams"],
)


@router.get("/students")
def get_students(
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role("student")),
):
    students = (
        db.query(User)
        .filter(
            User.role == "student",
            User.status == "active",
            User.id != current_user.id,
        )
        .order_by(User.name)
        .all()
    )

    return [
        {
            "id": student.id,
            "name": student.name,
            "email": student.email,
        }
        for student in students
    ]


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
        .join(
            TeamMember,
            Team.id == TeamMember.team_id,
        )
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


@router.get("/my", response_model=list[TeamResponse])
def get_my_teams(
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role("student")),
):
    teams = (
        db.query(Team)
        .join(TeamMember, Team.id == TeamMember.team_id)
        .filter(TeamMember.user_id == current_user.id)
        .order_by(Team.id.desc())
        .all()
    )

    return teams


@router.get("/my/{team_id}", response_model=TeamResponse)
def get_my_team(
    team_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role("student")),
):
    team = db.query(Team).filter(Team.id == team_id).first()

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

    is_pending_invitation = (
        db.query(TeamInvitation)
        .filter(
            TeamInvitation.team_id == team_id,
            TeamInvitation.invited_user_id == current_user.id,
            TeamInvitation.status == "pending",
        )
        .first()
    )

    if team.leader_id != current_user.id and not is_member and not is_pending_invitation:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You do not have access to this team",
        )

    return team



@router.get(
    "/{team_id}/members",
    response_model=list[TeamMemberResponse],
)
def get_team_members(
    team_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role("student")),
):
    team = db.query(Team).filter(Team.id == team_id).first()

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

    if team.leader_id != current_user.id and not is_member:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You do not have access to this team",
        )

    return (
        db.query(TeamMember)
        .filter(TeamMember.team_id == team_id)
        .order_by(TeamMember.id)
        .all()
    )


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

    member_count = (
        db.query(TeamMember)
        .filter(TeamMember.team_id == team.id)
        .count()
    )

    if member_count >= 3:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Team cannot have more than 3 members",
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

    if user.role != "student":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Only students can be added to a team",
        )

    if user.status != "active":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="User account is not active",
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


@router.post(
    "/{team_id}/invitations",
    response_model=TeamInvitationResponse,
    status_code=status.HTTP_201_CREATED,
)
def send_team_invitation(
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

    member_count = (
        db.query(TeamMember)
        .filter(TeamMember.team_id == team.id)
        .count()
    )

    pending_count = (
        db.query(TeamInvitation)
        .filter(
            TeamInvitation.team_id == team.id,
            TeamInvitation.status == "pending",
        )
        .count()
    )

    if member_count + pending_count >= 3:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Team cannot have more than 3 members or pending invitations",
        )

    if member_data.user_id == current_user.id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="You cannot invite yourself",
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

    if user.role != "student":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Only students can be invited to a team",
        )

    if user.status != "active":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="User account is not active",
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

    existing_invitation = (
        db.query(TeamInvitation)
        .filter(
            TeamInvitation.team_id == team.id,
            TeamInvitation.invited_user_id == user.id,
            TeamInvitation.status == "pending",
        )
        .first()
    )

    if existing_invitation:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invitation already sent to this user",
        )

    invitation = TeamInvitation(
        team_id=team.id,
        invited_user_id=user.id,
        status="pending",
    )

    db.add(invitation)
    db.commit()
    db.refresh(invitation)

    return invitation


@router.get(
    "/invitations",
    response_model=list[TeamInvitationResponse],
)
def get_my_team_invitations(
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role("student")),
):
    return (
        db.query(TeamInvitation)
        .filter(
            TeamInvitation.invited_user_id == current_user.id,
            TeamInvitation.status == "pending",
        )
        .order_by(TeamInvitation.id.desc())
        .all()
    )


@router.post(
    "/invitations/{invitation_id}/accept",
    response_model=TeamMemberResponse,
    status_code=status.HTTP_201_CREATED,
)
def accept_team_invitation(
    invitation_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role("student")),
):
    invitation = (
        db.query(TeamInvitation)
        .filter(
            TeamInvitation.id == invitation_id,
            TeamInvitation.invited_user_id == current_user.id,
            TeamInvitation.status == "pending",
        )
        .first()
    )

    if not invitation:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Invitation not found",
        )

    team = db.query(Team).filter(Team.id == invitation.team_id).first()

    if not team:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Team not found",
        )

    existing_event_team = (
        db.query(TeamMember)
        .join(Team, TeamMember.team_id == Team.id)
        .filter(
            Team.event_id == team.event_id,
            TeamMember.user_id == current_user.id,
        )
        .first()
    )

    if existing_event_team:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="You already belong to a team for this event",
        )

    member_count = (
        db.query(TeamMember)
        .filter(TeamMember.team_id == team.id)
        .count()
    )

    if member_count >= 3:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Team is already full",
        )

    member = TeamMember(
        team_id=team.id,
        user_id=current_user.id,
    )

    invitation.status = "accepted"
    invitation.responded_at = datetime.utcnow()

    db.add(member)
    db.commit()
    db.refresh(member)

    return member


@router.post(
    "/invitations/{invitation_id}/reject",
    response_model=TeamInvitationResponse,
)
def reject_team_invitation(
    invitation_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role("student")),
):
    invitation = (
        db.query(TeamInvitation)
        .filter(
            TeamInvitation.id == invitation_id,
            TeamInvitation.invited_user_id == current_user.id,
            TeamInvitation.status == "pending",
        )
        .first()
    )

    if not invitation:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Invitation not found",
        )

    invitation.status = "rejected"
    invitation.responded_at = datetime.utcnow()

    db.commit()
    db.refresh(invitation)

    return invitation

@router.delete("/{team_id}")
def delete_team(
    team_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role("student")),
):
    team = db.query(Team).filter(Team.id == team_id, Team.leader_id == current_user.id).first()
    if not team:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Team not found or you are not the leader")

    paid_ticket = db.query(Ticket).filter(Ticket.team_id == team_id, Ticket.status == "paid").first()
    if paid_ticket:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="This team cannot be deleted because it has a paid ticket")

    db.query(TeamInvitation).filter(TeamInvitation.team_id == team_id).delete(synchronize_session=False)
    db.query(TeamMember).filter(TeamMember.team_id == team_id).delete(synchronize_session=False)
    db.delete(team)
    db.commit()
    return {"message": "Team deleted successfully"}


@router.delete("/{team_id}/leave")
def leave_team(
    team_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role("student")),
):
    team = db.query(Team).filter(Team.id == team_id).first()
    if not team:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Team not found")

    if team.leader_id == current_user.id:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Team leader cannot leave the team. Delete the team instead.")

    member = db.query(TeamMember).filter(TeamMember.team_id == team_id, TeamMember.user_id == current_user.id).first()
    if not member:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="You are not a member of this team")

    db.delete(member)
    db.commit()
    return {"message": "You left the team successfully"}


@router.get("/{team_id}", response_model=TeamResponse)
def get_team(
    team_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role("student")),
):
    team = db.query(Team).filter(Team.id == team_id).first()

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

    is_pending_invitation = (
        db.query(TeamInvitation)
        .filter(
            TeamInvitation.team_id == team_id,
            TeamInvitation.invited_user_id == current_user.id,
            TeamInvitation.status == "pending",
        )
        .first()
    )

    if team.leader_id != current_user.id and not is_member and not is_pending_invitation:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You do not have access to this team",
        )

    return team
