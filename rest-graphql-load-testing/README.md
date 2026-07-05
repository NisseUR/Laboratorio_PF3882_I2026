## Descripción

Este proyecto tiene como objetivo analizar el impacto del **over-fetching** y el **under-fetching** en el rendimiento de APIs REST y GraphQL mediante pruebas de carga.

Se desarrollará una aplicación sencilla del dominio de una tienda en línea utilizando **FastAPI**, exponiendo una API REST y una API GraphQL (Strawberry) que compartirán la misma lógica de negocio y la misma base de datos. Posteriormente, ambas interfaces serán sometidas a pruebas de carga utilizando **k6** para comparar su desempeño.

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
* Docker Desktop
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

docker/

tests/

README.md
```

---

# Roadmap del proyecto

## Fase 1 - Diseño del dominio

### Objetivo

Definir un dominio sencillo que permita evaluar over-fetching y under-fetching.

### Actividades

* Diseñar el modelo entidad-relación.
* Definir las entidades:

  * Customer
  * Product
  * Order
  * OrderItem
* Definir las relaciones.
* Definir los cuatro casos de uso del experimento.

### Resultado esperado

* Modelo de datos definido.
* Casos de uso documentados.

---

## Fase 2 - Construcción del entorno experimental

### Objetivo

Implementar la infraestructura que utilizarán REST y GraphQL.

### Actividades

* Configurar PostgreSQL mediante Docker.
* Configurar SQLAlchemy.
* Crear los modelos.
* Crear migraciones con Alembic.
* Poblar la base de datos utilizando Faker.
* Implementar los servicios.
* Implementar la API REST.
* Implementar la API GraphQL con Strawberry.
* Verificar que ambas interfaces producen resultados equivalentes.

### Resultado esperado

Una única aplicación FastAPI funcionando con:

* PostgreSQL
* REST
* GraphQL
* Servicios compartidos

---

## Fase 3 - Ejecución de pruebas de carga

### Objetivo

Evaluar el comportamiento de ambas APIs bajo condiciones equivalentes de carga.

### Actividades

* Configurar k6.
* Crear los scripts de prueba.
* Ejecutar los escenarios definidos.
* Evaluar distintos niveles de concurrencia:

  * 10 usuarios
  * 50 usuarios
  * 100 usuarios
  * 250 usuarios
* Registrar las métricas obtenidas.

### Métricas

* Tiempo promedio
* Tiempo mínimo
* Tiempo máximo
* Percentil 95
* Throughput
* Bytes transferidos
* Cantidad de solicitudes
* Errores HTTP

### Resultado esperado

Resultados experimentales obtenidos para REST y GraphQL.

---

## Fase 4 - Análisis y documentación

### Objetivo

Comparar el comportamiento de ambas tecnologías e interpretar los resultados obtenidos.

### Actividades

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

* Organizar los datos obtenidos.
* Elaborar tablas comparativas.
* Generar gráficos.
* Comparar REST y GraphQL.
* Analizar el impacto del over-fetching.
* Analizar el impacto del under-fetching.
* Elaborar conclusiones.
* Documentar limitaciones y trabajo futuro.

### Resultado esperado

* Resultados analizados.
* Conclusiones de la investigación.
* Informe final.

---

# Escenarios experimentales

## Escenario 1

Consulta de un producto.

Evaluar over-fetching.

---

## Escenario 2

Consulta de un pedido completo.

Evaluar under-fetching.

---

## Escenario 3

Listado de productos.

Comparar volumen de datos transferidos.

---

## Escenario 4

Pedidos de un cliente.

Evaluar consultas con múltiples relaciones.

---

# Métricas evaluadas

* Tiempo de respuesta.
* Volumen de datos transferidos.
* Cantidad de solicitudes.
* Throughput.
* Errores HTTP.
