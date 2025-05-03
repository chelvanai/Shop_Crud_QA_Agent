from typing import List, Union, Any
from pydantic import BaseModel, field_validator, validator
import pandas as pd
import numpy as np


class QuestionIn(BaseModel):
    question: str


class ResponseOut(BaseModel):
    code: str
    result: Union[str, List[Any], dict, float, int, None]

    @validator('result', pre=True)
    def serialize_result(cls, v):
        # Handle numpy.ndarray
        if isinstance(v, np.ndarray):
            return v.tolist()

        # Handle pandas DataFrame
        elif isinstance(v, pd.DataFrame):
            df = v.copy()

            if isinstance(df.index.dtype, pd.PeriodDtype):
                df.index = df.index.astype(str)

            for col in df.columns:
                if isinstance(df[col].dtype, pd.PeriodDtype):
                    df[col] = df[col].astype(str)
            return df.to_dict(orient='list')

        # Handle pandas Series
        elif isinstance(v, pd.Series):
            s = v.copy()
            if isinstance(s.index.dtype, pd.PeriodDtype):
                s.index = s.index.astype(str)

            if isinstance(s.dtype, pd.PeriodDtype):
                s = s.astype(str)

            result = s.to_frame()
            result_dict = {result.index.name: result.index.to_list()}
            result_dict.update(result.to_dict(orient='list'))
            return result_dict

        # Optionally, handle pd.NA, np.nan, etc.
        elif isinstance(v, (float, int, type(None), str, list, dict)):
            return v
        # Optionally, raise error for unsupported types
        raise TypeError(f"Unsupported type in result field: {type(v)}")

    class Config:
        arbitrary_types_allowed = True
