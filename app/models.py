from sqlalchemy import Column, Integer, String, Float, ForeignKey, VARCHAR, DateTime
from sqlalchemy.orm import relationship

from app.db import Base, engine


class Customer(Base):
    __tablename__ = 'customer'
    id = Column(Integer, primary_key=True, index=True)
    mobile_no = Column(VARCHAR(20), nullable=False, unique=True)
    name = Column(String, nullable=False)
    address = Column(String, nullable=False)
    orders = relationship("Order", back_populates="customer")


class Product(Base):
    __tablename__ = 'product'
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    price = Column(Float, nullable=False)
    unit = Column(String)
    orders = relationship("Order", back_populates="product")


class Order(Base):
    __tablename__ = 'order'
    id = Column(Integer, primary_key=True, index=True)
    customer_id = Column(Integer, ForeignKey('customer.id'))
    product_id = Column(Integer, ForeignKey('product.id'))
    quantity = Column(Float, nullable=False)
    total_amount = Column(Float, nullable=False)
    created_at = Column(DateTime, nullable=False)
    customer = relationship("Customer", back_populates="orders")
    product = relationship("Product", back_populates="orders")

# Create database
Base.metadata.create_all(bind=engine)
