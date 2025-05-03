from fastapi import APIRouter
from app.api.routes import customer, product, order, analytics

api_router = APIRouter()
api_router.include_router(customer.router)
api_router.include_router(product.router)
api_router.include_router(order.router)
api_router.include_router(analytics.router)
