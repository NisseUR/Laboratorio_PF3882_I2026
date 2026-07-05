## Descripción

Se desarrolló una aplicación sencilla del dominio de una tienda en línea utilizando **FastAPI**, exponiendo una API REST y una API GraphQL (Strawberry) que compartirán la misma lógica de negocio y la misma base de datos. Posteriormente, ambas interfaces serán sometidas a pruebas de carga utilizando **k6** para comparar su desempeño.

---

# Tecnologías

* Python 3.12+
* FastAPI
* Strawberry GraphQL
* SQLAlchemy
* PostgreSQL
* Alembic
* Faker
* Docker
* Docker Compose
* k6

---

# Arquitectura

```text
                    Cliente

          REST              GraphQL
         (FastAPI)       (Strawberry)

                 │
                 ▼

              Services

                 │
                 ▼

           SQLAlchemy ORM

                 │
                 ▼

             PostgreSQL
```

---

# Instalación

## Requisitos

* Python 3.12+
* Docker Compose
* k6

---

## Crear ambiente virtual

```bash
python -m venv .venv
```

```bash
source .venv/bin/activate
```

## Instalar dependencias

```bash
pip install -r requirements.txt
```

## Levantar PostgreSQL

El proyecto usa PostgreSQL en Docker. Por defecto se publica en el puerto
`5433` del host para evitar conflictos con PostgreSQL local u otros
contenedores que usen `5432`.

```bash
docker compose up -d
```

La aplicación se conecta con el `DATABASE_URL` definido en `.env`:

```bash
postgresql+psycopg2://postgres:postgres@localhost:5433/ecommerce
```

Si desea usar el puerto `5432`, primero verifique qué proceso lo está usando:

```bash
sudo lsof -iTCP:5432 -sTCP:LISTEN
```

Luego puede cambiar `POSTGRES_HOST_PORT` y `DATABASE_URL` en `.env`.

## Instalar k6 

```bash
snap install k6
```
## Levantar la API
```bash
uvicorn app.main:app --host 0.0.0.0 --port 8000
```
---

# Estructura del proyecto

```text
project/

app/

    api/

        rest/

        graphql/

    services/

    models/

    database/

    config/

    main.py

k6/

alembic/

docker-compose.yaml

tests/

README.md
```

---

# Ejecución de pruebas k6

Ejecutar todos los escenarios y niveles de carga:

```bash
./k6/run_all.sh
```

Ejecutar solo una prueba rápida:

```bash
LOAD_LEVELS=low SCENARIOS=product ./k6/run_all.sh
```

Ejecutar un escenario específico comparando REST y GraphQL:

```bash
LOAD_LEVELS=low SCENARIOS=customer_orders ./k6/run_all.sh
```

Los reportes se guardan en:

```text
k6/reports/
```
* Volumen de datos transferidos.
* Cantidad de solicitudes.
* Throughput.
* Errores HTTP.
