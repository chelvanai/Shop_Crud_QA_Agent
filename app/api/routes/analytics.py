from fastapi import APIRouter
from app.agent.code_generate import generate_code, run_code
from app.schemas.analytics_schema import ResponseOut, QuestionIn

router = APIRouter(prefix="/api/analytics", tags=["analytics"])


@router.post('/orders_ai_answer/', response_model=ResponseOut)
def orders_ai_answer(ques: QuestionIn):
    python_code = generate_code(ques.question, 'order')
    code, result = run_code(python_code, 'order')
    print(code)
    print(result)
    print(type(result))
    return ResponseOut(code=code, result=result)


@router.post('/customers_ai_answer/', response_model=ResponseOut)
def customers_ai_answer(ques: QuestionIn):
    python_code = generate_code(ques.question, 'customer')
    code, result = run_code(python_code, 'customer')
    print(code)
    print(result)
    print(type(result))
    return ResponseOut(code=code, result=result)


@router.post('/products_ai_answer/', response_model=ResponseOut)
def products_ai_answer(ques: QuestionIn):
    python_code = generate_code(ques.question, 'product')
    code, result = run_code(python_code, 'product')
    print(code)
    print(result)
    print(type(result))
    return ResponseOut(code=code, result=result)
