from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from decimal import Decimal

from app.database import get_db
from app.models.booking import Booking, BookingStatusEnum
from app.models.vehicle import Vehicle, AvailabilityStatusEnum
from app.models.user import User
from app.schemas.booking import BookingCreate, BookingUpdate, BookingResponse
from app.core.deps import get_current_user, require_admin
from app.core.availability import is_vehicle_available

router = APIRouter(prefix="/bookings", tags=["Bookings"])


# =========================================================
# CUSTOMER ENDPOINTS
# =========================================================

@router.post("/", response_model=BookingResponse, status_code=status.HTTP_201_CREATED)
def create_booking(
    booking_in: BookingCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    vehicle = db.query(Vehicle).filter(Vehicle.id == booking_in.vehicle_id).first()
    if not vehicle:
        raise HTTPException(status_code=404, detail="Vehicle not found")

    if vehicle.vehicle_status.value != "active":
        raise HTTPException(status_code=400, detail="Vehicle is not available for booking")

    if vehicle.availability_status == AvailabilityStatusEnum.maintenance or \
       vehicle.availability_status == AvailabilityStatusEnum.inactive:
        raise HTTPException(status_code=400, detail="Vehicle is currently unavailable")

    # Core overlap check (requirement 16)
    available = is_vehicle_available(db, booking_in.vehicle_id, booking_in.start_date, booking_in.end_date)
    if not available:
        raise HTTPException(
            status_code=400,
            detail="Vehicle is already booked for the selected dates"
        )

    # Server-side price calculation (requirement 17) — never trust frontend math
    rental_days = (booking_in.end_date - booking_in.start_date).days + 1
    if rental_days <= 0:
        raise HTTPException(status_code=400, detail="Invalid booking dates")

    price_per_day = vehicle.price_per_day
    total_amount = price_per_day * rental_days

    new_booking = Booking(
        customer_id=current_user.id,
        vehicle_id=booking_in.vehicle_id,
        start_date=booking_in.start_date,
        end_date=booking_in.end_date,
        rental_days=rental_days,
        price_per_day=price_per_day,
        total_amount=total_amount,
        booking_status=BookingStatusEnum.pending,
    )
    db.add(new_booking)
    db.commit()
    db.refresh(new_booking)
    return new_booking


@router.get("/my-bookings", response_model=List[BookingResponse])
def list_my_bookings(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return db.query(Booking).filter(Booking.customer_id == current_user.id).all()


@router.get("/{booking_id}", response_model=BookingResponse)
def get_booking(
    booking_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    booking = db.query(Booking).filter(Booking.id == booking_id).first()
    if not booking:
        raise HTTPException(status_code=404, detail="Booking not found")

    # Ownership check — customers can only see their own bookings, admins see all
    if current_user.role.value != "admin" and booking.customer_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized to view this booking")

    return booking


@router.post("/{booking_id}/cancel", response_model=BookingResponse)
def cancel_booking(
    booking_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    booking = db.query(Booking).filter(Booking.id == booking_id).first()
    if not booking:
        raise HTTPException(status_code=404, detail="Booking not found")

    if current_user.role.value != "admin" and booking.customer_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized to cancel this booking")

    # Eligibility rule: can't cancel if already active, completed, or cancelled
    if booking.booking_status in [BookingStatusEnum.active, BookingStatusEnum.completed, BookingStatusEnum.cancelled]:
        raise HTTPException(
            status_code=400,
            detail=f"Cannot cancel a booking with status '{booking.booking_status.value}'"
        )

    booking.booking_status = BookingStatusEnum.cancelled
    db.commit()
    db.refresh(booking)
    return booking


# =========================================================
# ADMIN ENDPOINTS
# =========================================================

@router.get("/", response_model=List[BookingResponse])
def list_all_bookings(
    db: Session = Depends(get_db),
    admin: User = Depends(require_admin),
):
    return db.query(Booking).all()


@router.put("/{booking_id}/status", response_model=BookingResponse)
def update_booking_status(
    booking_id: int,
    update: BookingUpdate,
    db: Session = Depends(get_db),
    admin: User = Depends(require_admin),
):
    booking = db.query(Booking).filter(Booking.id == booking_id).first()
    if not booking:
        raise HTTPException(status_code=404, detail="Booking not found")

    if update.booking_status is None:
        raise HTTPException(status_code=400, detail="booking_status is required")

    # If admin is confirming, re-check availability (in case of race conditions
    # between multiple pending requests for overlapping dates)
    if update.booking_status == BookingStatusEnum.confirmed:
        available = is_vehicle_available(
            db, booking.vehicle_id, booking.start_date, booking.end_date,
            exclude_booking_id=booking.id
        )
        if not available:
            raise HTTPException(
                status_code=400,
                detail="Cannot confirm — vehicle has a conflicting confirmed/active booking"
            )
        booking.vehicle.availability_status = AvailabilityStatusEnum.rented

    if update.booking_status == BookingStatusEnum.completed:
        booking.vehicle.availability_status = AvailabilityStatusEnum.available

    if update.booking_status == BookingStatusEnum.cancelled:
        booking.vehicle.availability_status = AvailabilityStatusEnum.available

    booking.booking_status = update.booking_status
    db.commit()
    db.refresh(booking)
    return booking