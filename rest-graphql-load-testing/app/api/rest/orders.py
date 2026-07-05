from decimal import Decimal

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.api.rest.products import serialize_product
from app.database.database import get_db
from app.database.models import Order, OrderItem
from app.services.order_service import OrderService

router = APIRouter(prefix="/orders", tags=["orders"])


def _money(value: Decimal) -> float:
    return float(value) if isinstance(value, Decimal) else value


def serialize_order_item(item: OrderItem) -> dict:
    return {
        "id": item.id,
        "product_id": item.product_id,
        "quantity": item.quantity,
        "unit_price": _money(item.unit_price),
        "product": serialize_product(item.product),
    }


def serialize_order(order: Order) -> dict:
    return {
        "id": order.id,
        "customer_id": order.customer_id,
        "order_date": order.order_date.isoformat(),
        "total": _money(order.total),
        "customer": {
            "id": order.customer.id,
            "name": order.customer.name,
            "email": order.customer.email,
        },
        "items": [serialize_order_item(item) for item in order.items],
    }


@router.get("/{order_id}")
def get_order(order_id: int, db: Session = Depends(get_db)) -> dict:
    order = OrderService.get_order(db, order_id)
    if order is None:
        raise HTTPException(status_code=404, detail="Order not found")
    return serialize_order(order)
