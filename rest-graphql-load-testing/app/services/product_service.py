from sqlalchemy import select
from sqlalchemy.orm import Session

from app.database.models import Product


class ProductService:
    @staticmethod
    def get_products(db: Session, limit: int = 100, offset: int = 0) -> list[Product]:
        statement = select(Product).offset(offset).limit(limit)
        return list(db.scalars(statement).all())

    @staticmethod
    def get_product(db: Session, product_id: int) -> Product | None:
        return db.get(Product, product_id)
