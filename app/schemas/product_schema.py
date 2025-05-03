from pydantic import BaseModel


class ProductCreate(BaseModel):
    name: str
    price: float
    unit: str


class ProductOut(ProductCreate):
    id: int

    class Config:
        orm_mode = True


