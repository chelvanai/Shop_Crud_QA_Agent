from fastapi import APIRouter, HTTPException, Depends
from typing import List
from sqlalchemy.orm import Session
from app.db import get_db
from app.models import Order, Customer, Product
from app.schemas.order_schema import OrderCreate, OrderOut

router = APIRouter(prefix="/api", tags=["orders"])


@router.post('/orders/', response_model=OrderOut)
def order_create(order: OrderCreate, db: Session = Depends(get_db)):
    if not db.query(Customer).filter(Customer.id == order.customer_id).first():
        raise HTTPException(status_code=400, detail="Customer does not exist.")

    if not db.query(Product).filter(Product.id == order.product_id).first():
        raise HTTPException(status_code=400, detail="Product does not exist.")

    db_order = Order(customer_id=order.customer_id,
                     product_id=order.product_id,
                     quantity=order.quantity,
                     total_amount=order.total_amount,
                     created_at=order.created_at
                     )
    db.add(db_order)
    db.commit()
    db.refresh(db_order)
    return db_order


@router.get('/orders/', response_model=List[OrderOut])
def orders_list(db: Session = Depends(get_db)):
    order_data = db.query(Order).all()
    return order_data
