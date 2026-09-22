from pydantic import BaseModel
from decimal import Decimal
from typing import Optional

class DashboardStats(BaseModel):
    total_customers: int
    total_vehicles: int
    available_vehicles: int
    rented_vehicles: int
    maintenance_vehicles: int
    total_bookings: int
    pending_bookings: int
    active_bookings: int
    completed_bookings: int
    total_revenue: Optional[Decimal] = None