from datetime import datetime
from decimal import Decimal

import strawberry

from app.database import models


def _money(value: Decimal) -> float:
    return float(value) if isinstance(value, Decimal) else value


@strawberry.type
class ProductType:
    id: int
    name: str
    description: str
    price: float
    category: str

    @classmethod
    def from_model(cls, product: models.Product) -> "ProductType":
        return cls(
            id=product.id,
            name=product.name,
            description=product.description,
            price=_money(product.price),
            category=product.category,
        )


@strawberry.type
class CustomerType:
    id: int
    name: str
    email: str

    @classmethod
    def from_model(cls, customer: models.Customer) -> "CustomerType":
        return cls(id=customer.id, name=customer.name, email=customer.email)


@strawberry.type
class OrderItemType:
    id: int
    product_id: int
    quantity: int
    unit_price: float
    product: ProductType

    @classmethod
    def from_model(cls, item: models.OrderItem) -> "OrderItemType":
        return cls(
            id=item.id,
            product_id=item.product_id,
            quantity=item.quantity,
            unit_price=_money(item.unit_price),
            product=ProductType.from_model(item.product),
        )


@strawberry.type
class OrderType:
    id: int
    customer_id: int
    order_date: datetime
    total: float
    customer: CustomerType
    items: list[OrderItemType]

    @classmethod
    def from_model(cls, order: models.Order) -> "OrderType":
        return cls(
            id=order.id,
            customer_id=order.customer_id,
            order_date=order.order_date,
            total=_money(order.total),
            customer=CustomerType.from_model(order.customer),
            items=[OrderItemType.from_model(item) for item in order.items],
        )
