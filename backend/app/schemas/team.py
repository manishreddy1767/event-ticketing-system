from datetime import datetime

from pydantic import BaseModel, Field


class TeamCreateRequest(BaseModel):
    event_id: int = Field(gt=0)
    name: str = Field(min_length=2, max_length=100)


class TeamMemberAddRequest(BaseModel):
    user_id: int = Field(gt=0)


class TeamMemberResponse(BaseModel):
    id: int
    team_id: int
    user_id: int
    joined_at: datetime

    class Config:
        from_attributes = True


class TeamResponse(BaseModel):
    id: int
    event_id: int
    name: str
    leader_id: int
    created_at: datetime

    class Config:
        from_attributes = True