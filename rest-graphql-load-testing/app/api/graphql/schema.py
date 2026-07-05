import strawberry
from strawberry.fastapi import GraphQLRouter

from app.api.graphql.queries import Query

schema = strawberry.Schema(query=Query)
graphql_router = GraphQLRouter(schema)
