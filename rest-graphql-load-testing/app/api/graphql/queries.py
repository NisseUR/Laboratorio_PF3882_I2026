import strawberry

from app.api.graphql.types import CustomerType, OrderType, ProductType
from app.database.database import SessionLocal
from app.services.customer_service import CustomerService
from app.services.order_service import OrderService
from app.services.product_service import ProductService


@strawberry.type
class Query:
    @strawberry.field
    def product(self, id: int) -> ProductType | None:
        with SessionLocal() as db:
            product = ProductService.get_product(db, id)
            return ProductType.from_model(product) if product else None

    @strawberry.field
    def products(self, limit: int = 100, offset: int = 0) -> list[ProductType]:
        with SessionLocal() as db:
            products = ProductService.get_products(db, limit=limit, offset=offset)
            return [ProductType.from_model(product) for product in products]

    @strawberry.field
    def customer(self, id: int) -> CustomerType | None:
        with SessionLocal() as db:
            customer = CustomerService.get_customer(db, id)
            return CustomerType.from_model(customer) if customer else None

    @strawberry.field
    def order(self, id: int) -> OrderType | None:
        with SessionLocal() as db:
            order = OrderService.get_order(db, id)
            return OrderType.from_model(order) if order else None

    @strawberry.field
    def customer_orders(self, customer_id: int) -> list[OrderType]:
        with SessionLocal() as db:
            orders = CustomerService.get_customer_orders(db, customer_id)
            return [OrderType.from_model(order) for order in orders]
