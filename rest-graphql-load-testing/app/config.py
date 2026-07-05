import os

from dotenv import load_dotenv

if load_dotenv:
    load_dotenv()


class Settings:
    app_name: str = os.getenv("APP_NAME", "REST vs GraphQL Load Testing")
    debug: bool = os.getenv("DEBUG", "false").lower() == "true"
    host: str = os.getenv("HOST", "0.0.0.0")
    port: int = int(os.getenv("PORT", "8000"))
    database_url: str = os.getenv(
        "DATABASE_URL",
        "postgresql+psycopg2://postgres:postgres@localhost:5432/ecommerce",
    )


settings = Settings()
