from fastapi import FastAPI
from fastapi.responses import HTMLResponse
from fastapi.middleware.cors import CORSMiddleware
from starlette.staticfiles import StaticFiles
from app.api.main import api_router

app = FastAPI()


origins = [
    "http://localhost",
    "http://127.0.0.1",
    "http://localhost:8030",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.mount("/static", StaticFiles(directory="static"), name="static")


@app.get("/", response_class=HTMLResponse)
async def get_index():
    with open("templates/home.html", "r") as f:
        html_content = f.read()
    return HTMLResponse(content=html_content)


@app.get("/customer", response_class=HTMLResponse)
async def get_index():
    with open("templates/customer.html", "r") as f:
        html_content = f.read()
    return HTMLResponse(content=html_content)


@app.get("/product", response_class=HTMLResponse)
async def get_index():
    with open("templates/product.html", "r") as f:
        html_content = f.read()
    return HTMLResponse(content=html_content)


@app.get("/invoice", response_class=HTMLResponse)
async def get_index():
    with open("templates/invoice.html", "r") as f:
        html_content = f.read()
    return HTMLResponse(content=html_content)


@app.get("/analytics", response_class=HTMLResponse)
async def get_index():
    with open("templates/analytics.html", "r") as f:
        html_content = f.read()
    return HTMLResponse(content=html_content)


app.include_router(api_router)

if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="0.0.0.0", port=8030)
