from pydantic import BaseModel, field_validator


class CustomerCreate(BaseModel):
    mobile_no: str
    name: str
    address: str

    @field_validator('mobile_no')
    def mobile_only_digits(cls, v):
        v_str = str(v)
        if not v_str.isdigit():
            raise ValueError('mobile_no must contain only digits 0-9')
        return v_str



class CustomerOut(CustomerCreate):
    id: int
    mobile_no: int

    class Config:
        orm_mode = True

