from decimal import Decimal
from random import randint, sample

from faker import Faker

from app.database.database import SessionLocal, init_db
from app.database.models import Customer, Order, OrderItem, Product

fake = Faker()


def seed_database(
    customer_count: int = 100,
    product_count: int = 1000,
    order_count: int = 500,
) -> None:
    init_db()

    with SessionLocal() as db:
        if db.query(Customer).first():
            print("Database already contains data. Seed skipped.")
            return

        customers = [
            Customer(name=fake.name(), email=fake.unique.email())
            for _ in range(customer_count)
        ]
        db.add_all(customers)

        products = [
            Product(
                name=fake.catch_phrase(),
                description=fake.paragraph(nb_sentences=8),
                price=Decimal(randint(500, 100000)) / Decimal("100"),
                category=fake.word().title(),
            )
            for _ in range(product_count)
        ]
        db.add_all(products)
        db.flush()

        for _ in range(order_count):
            customer = customers[randint(0, len(customers) - 1)]
            selected_products = sample(products, randint(1, 6))
            order = Order(
                customer=customer,
                order_date=fake.date_time_this_year(),
                total=Decimal("0"),
            )

            total = Decimal("0")
            for product in selected_products:
                quantity = randint(1, 5)
                unit_price = product.price
                total += unit_price * quantity
                order.items.append(
                    OrderItem(
                        product=product,
                        quantity=quantity,
                        unit_price=unit_price,
                    )
                )

            order.total = total
            db.add(order)

        db.commit()
        print("Database seeded successfully.")


if __name__ == "__main__":
    seed_database()
