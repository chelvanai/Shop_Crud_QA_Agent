from datetime import datetime

from pydantic import BaseModel


class OrderCreate(BaseModel):
    customer_id: int
    product_id: int
    quantity: float
    total_amount: float
    created_at: datetime


class OrderOut(OrderCreate):
    id: int

    class config:
        orm_mode = True
