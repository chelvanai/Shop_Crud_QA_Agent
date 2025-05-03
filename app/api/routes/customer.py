from fastapi import APIRouter, HTTPException, Depends
from typing import List
from sqlalchemy.orm import Session
from app.db import get_db
from app.models import Customer
from app.schemas.customer_schema import CustomerCreate, CustomerOut

router = APIRouter(prefix="/api", tags=["customers"])


@router.post('/customers/', response_model=CustomerOut)
def customer_create(customer: CustomerCreate, db: Session = Depends(get_db)):
    customer_data = db.query(Customer).filter_by(mobile_no=customer.mobile_no).first()
    if customer_data:
        raise HTTPException(status_code=404, detail='Customer Already Exists')
    db_customer = Customer(mobile_no=customer.mobile_no, name=customer.name, address=customer.address)
    db.add(db_customer)
    db.commit()
    db.refresh(db_customer)
    return db_customer


@router.get('/customers/', response_model=List[CustomerOut])
def customers_list(db: Session = Depends(get_db)):
    customer_data = db.query(Customer).all()
    return customer_data


@router.put('/customers/{customer_id}/', response_model=CustomerOut)
def customer_edit(customer: CustomerCreate, customer_id: int, db: Session = Depends(get_db)):
    customer_detail = db.query(Customer).filter(Customer.id == customer_id).first()
    if customer_detail is None:
        raise HTTPException(status_code=404, detail='Customer Not Found')
    for key, value in customer.model_dump().items():
        setattr(customer_detail, key, value)
    db.commit()
    db.refresh(customer_detail)
    return customer_detail


@router.delete('/customers/{customer_id}/', response_model=CustomerOut)
def customer_delete(customer_id: int, db: Session = Depends(get_db)):
    customer_detail = db.query(Customer).filter(Customer.id == customer_id).first()
    if customer_detail is None:
        raise HTTPException(status_code=404, detail='Customer Not Found')
    db.delete(customer_detail)
    db.commit()
    return customer_detail
