from sqlalchemy import Column, Integer, String, Enum, TIMESTAMP, func
from app.database import Base
import enum

class RoleEnum(str, enum.Enum):
    customer = "customer"
    admin = "admin"

class AccountStatusEnum(str, enum.Enum):
    active = "active"
    inactive = "inactive"

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    full_name = Column(String(100), nullable=False)
    email = Column(String(150), unique=True, nullable=False, index=True)
    phone = Column(String(20))
    password_hash = Column(String(255), nullable=False)
    role = Column(Enum(RoleEnum), default=RoleEnum.customer)
    account_status = Column(Enum(AccountStatusEnum), default=AccountStatusEnum.active)
    created_at = Column(TIMESTAMP, server_default=func.now())
    updated_at = Column(TIMESTAMP, server_default=func.now(), onupdate=func.now())