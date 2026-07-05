from decimal import Decimal

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session

from app.database.database import get_db
from app.database.models import Product
from app.services.product_service import ProductService

router = APIRouter(prefix="/products", tags=["products"])


def serialize_product(product: Product) -> dict:
    return {
        "id": product.id,
        "name": product.name,
        "description": product.description,
        "price": float(product.price) if isinstance(product.price, Decimal) else product.price,
        "category": product.category,
    }


@router.get("")
def get_products(
    limit: int = Query(default=100, ge=1, le=500),
    offset: int = Query(default=0, ge=0),
    db: Session = Depends(get_db),
) -> list[dict]:
    products = ProductService.get_products(db, limit=limit, offset=offset)
    return [serialize_product(product) for product in products]


@router.get("/{product_id}")
def get_product(product_id: int, db: Session = Depends(get_db)) -> dict:
    product = ProductService.get_product(db, product_id)
    if product is None:
        raise HTTPException(status_code=404, detail="Product not found")
    return serialize_product(product)
