import uvicorn
from fastapi import FastAPI

from app.api.graphql.schema import graphql_router
from app.api.rest import customers, orders, products
from app.config import settings

app = FastAPI(
    title=settings.app_name,
    debug=settings.debug,
    description="REST and GraphQL load-testing",
)

app.include_router(products.router)
app.include_router(customers.router)
app.include_router(orders.router)
app.include_router(graphql_router, prefix="/graphql")


@app.get("/health", tags=["health"])
def health() -> dict:
    return {"status": "ok"}


if __name__ == "__main__":
    uvicorn.run("app.main:app", host=settings.host, port=settings.port, reload=settings.debug)
