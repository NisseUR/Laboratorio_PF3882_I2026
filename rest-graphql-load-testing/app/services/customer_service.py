from sqlalchemy import select
from sqlalchemy.orm import Session, selectinload

from app.database.models import Customer, Order, OrderItem


class CustomerService:
    @staticmethod
    def get_customer(db: Session, customer_id: int) -> Customer | None:
        return db.get(Customer, customer_id)

    @staticmethod
    def get_customer_orders(db: Session, customer_id: int) -> list[Order]:
        statement = (
            select(Order)
            .where(Order.customer_id == customer_id)
            .options(
                selectinload(Order.customer),
                selectinload(Order.items).selectinload(OrderItem.product),
            )
            .order_by(Order.order_date.desc())
        )
        return list(db.scalars(statement).all())
