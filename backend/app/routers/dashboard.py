from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func
from app.database import get_db
from app.models.user import User, RoleEnum
from app.models.vehicle import Vehicle, AvailabilityStatusEnum
from app.models.booking import Booking, BookingStatusEnum
from app.schemas.dashboard import DashboardStats
from app.core.deps import require_admin

router = APIRouter(prefix="/admin", tags=["Admin Dashboard"])

@router.get("/stats", response_model=DashboardStats)
def get_dashboard_stats(db: Session = Depends(get_db), admin: User = Depends(require_admin)):
    total_customers = db.query(User).filter(User.role == RoleEnum.customer).count()
    total_vehicles = db.query(Vehicle).count()
    available_vehicles = db.query(Vehicle).filter(Vehicle.availability_status == AvailabilityStatusEnum.available).count()
    rented_vehicles = db.query(Vehicle).filter(Vehicle.availability_status == AvailabilityStatusEnum.rented).count()
    maintenance_vehicles = db.query(Vehicle).filter(Vehicle.availability_status == AvailabilityStatusEnum.maintenance).count()

    total_bookings = db.query(Booking).count()
    pending_bookings = db.query(Booking).filter(Booking.booking_status == BookingStatusEnum.pending).count()
    active_bookings = db.query(Booking).filter(Booking.booking_status == BookingStatusEnum.active).count()
    completed_bookings = db.query(Booking).filter(Booking.booking_status == BookingStatusEnum.completed).count()

    total_revenue = db.query(func.sum(Booking.total_amount)).filter(
        Booking.booking_status.in_([BookingStatusEnum.completed, BookingStatusEnum.active, BookingStatusEnum.confirmed])
    ).scalar() or 0

    return DashboardStats(
        total_customers=total_customers,
        total_vehicles=total_vehicles,
        available_vehicles=available_vehicles,
        rented_vehicles=rented_vehicles,
        maintenance_vehicles=maintenance_vehicles,
        total_bookings=total_bookings,
        pending_bookings=pending_bookings,
        active_bookings=active_bookings,
        completed_bookings=completed_bookings,
        total_revenue=total_revenue,
    )