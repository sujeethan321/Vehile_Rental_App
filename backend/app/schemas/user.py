from pydantic import BaseModel, EmailStr, ConfigDict
from datetime import datetime
from typing import Optional
from app.models.user import RoleEnum, AccountStatusEnum

# ---- Registration ----
class UserCreate(BaseModel):
    full_name: str
    email: EmailStr
    phone: Optional[str] = None
    password: str

# ---- Login ----
class UserLogin(BaseModel):
    email: EmailStr
    password: str

# ---- Update profile ----
class UserUpdate(BaseModel):
    full_name: Optional[str] = None
    phone: Optional[str] = None

# ---- Response (never expose password_hash) ----
class UserResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    full_name: str
    email: EmailStr
    phone: Optional[str] = None
    role: RoleEnum
    account_status: AccountStatusEnum
    created_at: datetime

# ---- Token response ----
class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"
    
    
# ---- Admin: update account status ----
class UserStatusUpdate(BaseModel):
    account_status: AccountStatusEnum