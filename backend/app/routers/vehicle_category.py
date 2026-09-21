from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from app.models.vehicle import VehicleCategory
from app.schemas.vehicle_category import CategoryCreate, CategoryUpdate, CategoryResponse
from app.core.deps import require_admin
from app.models.user import User

router = APIRouter(prefix="/categories", tags=["Vehicle Categories"])

# ---- Public: anyone can view categories (needed for filter dropdowns) ----
@router.get("/", response_model=List[CategoryResponse])
def list_categories(db: Session = Depends(get_db)):
    return db.query(VehicleCategory).all()

@router.get("/{category_id}", response_model=CategoryResponse)
def get_category(category_id: int, db: Session = Depends(get_db)):
    category = db.query(VehicleCategory).filter(VehicleCategory.id == category_id).first()
    if not category:
        raise HTTPException(status_code=404, detail="Category not found")
    return category

# ---- Admin only: create/update/delete ----
@router.post("/", response_model=CategoryResponse, status_code=status.HTTP_201_CREATED)
def create_category(
    category_in: CategoryCreate,
    db: Session = Depends(get_db),
    admin: User = Depends(require_admin),
):
    existing = db.query(VehicleCategory).filter(VehicleCategory.name == category_in.name).first()
    if existing:
        raise HTTPException(status_code=400, detail="Category name already exists")

    new_category = VehicleCategory(
        name=category_in.name,
        description=category_in.description,
    )
    db.add(new_category)
    db.commit()
    db.refresh(new_category)
    return new_category

@router.put("/{category_id}", response_model=CategoryResponse)
def update_category(
    category_id: int,
    category_in: CategoryUpdate,
    db: Session = Depends(get_db),
    admin: User = Depends(require_admin),
):
    category = db.query(VehicleCategory).filter(VehicleCategory.id == category_id).first()
    if not category:
        raise HTTPException(status_code=404, detail="Category not found")

    if category_in.name is not None:
        category.name = category_in.name
    if category_in.description is not None:
        category.description = category_in.description

    db.commit()
    db.refresh(category)
    return category

@router.delete("/{category_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_category(
    category_id: int,
    db: Session = Depends(get_db),
    admin: User = Depends(require_admin),
):
    category = db.query(VehicleCategory).filter(VehicleCategory.id == category_id).first()
    if not category:
        raise HTTPException(status_code=404, detail="Category not found")

    # Prevent deleting a category that's still in use by vehicles
    if category.vehicles:
        raise HTTPException(
            status_code=400,
            detail="Cannot delete category that has vehicles assigned to it"
        )

    db.delete(category)
    db.commit()
    return None