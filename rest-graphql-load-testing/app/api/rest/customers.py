from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.api.rest.orders import serialize_order
from app.database.database import get_db
from app.database.models import Customer
from app.services.customer_service import CustomerService

router = APIRouter(prefix="/customers", tags=["customers"])


def serialize_customer(customer: Customer) -> dict:
    return {
        "id": customer.id,
        "name": customer.name,
        "email": customer.email,
    }


@router.get("/{customer_id}")
def get_customer(customer_id: int, db: Session = Depends(get_db)) -> dict:
    customer = CustomerService.get_customer(db, customer_id)
    if customer is None:
        raise HTTPException(status_code=404, detail="Customer not found")
    return serialize_customer(customer)


@router.get("/{customer_id}/orders")
def get_customer_orders(customer_id: int, db: Session = Depends(get_db)) -> list[dict]:
    customer = CustomerService.get_customer(db, customer_id)
    if customer is None:
        raise HTTPException(status_code=404, detail="Customer not found")

    orders = CustomerService.get_customer_orders(db, customer_id)
    return [serialize_order(order) for order in orders]
