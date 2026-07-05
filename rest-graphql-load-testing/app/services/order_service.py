from sqlalchemy import select
from sqlalchemy.orm import Session, selectinload

from app.database.models import Order, OrderItem


class OrderService:
    @staticmethod
    def get_order(db: Session, order_id: int) -> Order | None:
        statement = (
            select(Order)
            .where(Order.id == order_id)
            .options(
                selectinload(Order.customer),
                selectinload(Order.items).selectinload(OrderItem.product),
            )
        )
        return db.scalars(statement).first()
