from fastapi import APIRouter, HTTPException, Depends
from typing import List
from sqlalchemy.orm import Session
from app.db import get_db
from app.models import Product
from app.schemas.product_schema import ProductCreate, ProductOut

router = APIRouter(prefix="/api", tags=["products"])


@router.post('/products/', response_model=ProductOut)
def product_create(product: ProductCreate, db: Session = Depends(get_db)):
    db_product = Product(name=product.name, price=product.price, unit=product.unit)
    db.add(db_product)
    db.commit()
    db.refresh(db_product)
    return db_product


@router.get('/products/', response_model=List[ProductOut])
def product_list(db: Session = Depends(get_db)):
    product_data = db.query(Product).all()
    return product_data


@router.put('/products/{product_id}/', response_model=ProductOut)
def product_edit(product: ProductCreate, product_id: int, db: Session = Depends(get_db)):
    product_detail = db.query(Product).filter(Product.id == product_id).first()
    if product_detail is None:
        raise HTTPException(status_code=404, detail='Product Not Found')
    for key, value in product.model_dump().items():
        setattr(product_detail, key, value)
    db.commit()
    db.refresh(product_detail)
    return product_detail


@router.delete('/products/{product_id}/', response_model=ProductOut)
def product_delete(product_id: int, db: Session = Depends(get_db)):
    product_detail = db.query(Product).filter(Product.id == product_id).first()
    if product_detail is None:
        raise HTTPException(status_code=404, detail='Product Not Found')
    db.delete(product_detail)
    db.commit()
    return product_detail
