from sqlalchemy import create_engine
import pandas as pd
from pydantic import BaseModel
from openai import OpenAI
from dotenv import load_dotenv
import os
import json
import traceback
from app.config import DATABASE_URL
import datetime
from datetime import time

engine = create_engine(DATABASE_URL)  # 'sqlite:///./app/crud.db'

cus_query = """select * from customer"""

prod_query = """select * from product"""

ord_query = """select "order".id order_id,
       customer.id as customer_id,
       customer.name as customer_name,
       customer.mobile_no,
       customer.address,
       product.id as product_id,
       product.name product_name,
       product.price,
       product.unit,
       quantity,
       total_amount,
       created_at
    from "order",customer,product
where "order".customer_id = customer.id and
      "order".product_id = product.id
"""

cus_df = pd.read_sql_query(cus_query, con=engine)

prod_df = pd.read_sql_query(prod_query, con=engine)

ord_df = pd.read_sql_query(ord_query, con=engine)


class CustomerTableCodeGenerator(BaseModel):
    """
    These are the columns and datatype of a pandas dataframe.
    id            int64
    mobile_no    object
    name         object
    address      object

    Here you generate pandas code for the user asked question based on these columns and data types.

    your code return as this function format.
    input parameter:- pandas dataframe as df
    output :- pandas codes and return output as one of this return type [text, list, series, Dataframe]

    def process(df):
        return output
    """
    code: str


class ProductTableCodeGenerator(BaseModel):
    """
    These are the columns and datatype of a pandas dataframe.
    id         int64
    name      object
    price    float64
    unit      object

    Here you generate pandas code for the user asked question based on these columns and data types.

    your code return as this function format.
    input parameter:- pandas dataframe as df
    output :- pandas codes and return output as one of this return type [text, list, series, Dataframe]

    def process(df):
        return output
    """
    code: str


class OrderTableCodeGenerator(BaseModel):
    """
    These are the columns and datatype of a pandas dataframe.
    order_id           int64
    customer_id        int64
    customer_name     object
    mobile_no         object
    address           object
    product_id         int64
    product_name      object
    price            float64
    unit              object
    quantity         float64
    total_amount     float64
    created_at        object

    Here you generate pandas code for the user asked question based on these columns and data types.

    your code return as this function format.
    input parameter:- pandas dataframe as df
    output :- pandas codes and return output as one of this return type [text, list, series, Dataframe]

    def process(df):
        return output
    """
    code: str


load_dotenv()

client = OpenAI(api_key=os.getenv('OPENAI_API'))

generator_class = {
    'order': OrderTableCodeGenerator,
    'product': ProductTableCodeGenerator,
    'customer': CustomerTableCodeGenerator,
}

generator_class_df = {
    'order': ord_df,
    'product': prod_df,
    'customer': cus_df,
}


def generate_code(question, table_name):
    completion = client.beta.chat.completions.parse(
        model="gpt-4o-2024-08-06",
        messages=[
            {"role": "system",
             "content": "You are a helpful assistant. Write pandas code for given question."},
            {"role": "user",
             "content": question},
        ],
        response_format=generator_class[table_name]
    )

    message = completion.choices[0].message

    if message.parsed:
        return message.parsed.code


def run_code(python_code, table_name):
    try:
        python_code = "global process\n" + python_code
        exec(python_code)
        results = process(generator_class_df[table_name])

        return python_code, results

    except Exception as e:
        full_traceback = traceback.format_exc()

        error_message = f"An error occurred: {e}\n{full_traceback}"

        final_msg = f"{python_code}\n======Error======\n{error_message}"
        return final_msg, "Error"
