from sqlalchemy import Column, Integer, Date, Numeric, Enum, TIMESTAMP, ForeignKey, func
from sqlalchemy.orm import relationship
from app.database import Base
import enum

class BookingStatusEnum(str, enum.Enum):
    pending = "pending"
    confirmed = "confirmed"
    active = "active"
    completed = "completed"
    cancelled = "cancelled"

class Booking(Base):
    __tablename__ = "bookings"

    id = Column(Integer, primary_key=True, index=True)
    customer_id = Column(Integer, ForeignKey("users.id"), nullable=False, index=True)
    vehicle_id = Column(Integer, ForeignKey("vehicles.id"), nullable=False, index=True)
    start_date = Column(Date, nullable=False)
    end_date = Column(Date, nullable=False)
    rental_days = Column(Integer, nullable=False)
    price_per_day = Column(Numeric(10, 2), nullable=False)
    total_amount = Column(Numeric(10, 2), nullable=False)
    booking_status = Column(Enum(BookingStatusEnum), default=BookingStatusEnum.pending)
    created_at = Column(TIMESTAMP, server_default=func.now())
    updated_at = Column(TIMESTAMP, server_default=func.now(), onupdate=func.now())

    customer = relationship("User")
    vehicle = relationship("Vehicle", back_populates="bookings")