from fastapi import FastAPI, Depends, HTTPException, status, Request, WebSocket, WebSocketDisconnect, UploadFile, File, APIRouter
from fastapi.responses import JSONResponse
app = FastAPI()
import random
 # --- Diamond Price API ---
@app.get("/market/diamond-prices")
async def get_diamond_prices():
    # TODO: Integrate with RapNet, IDEX, or other real diamond price API
    # For now, return stubbed prices for popular shapes
    prices = {
        "Round": f"{random.randint(3500, 6500)} USD",
        "Princess": f"{random.randint(3200, 6000)} USD",
        "Emerald": f"{random.randint(3000, 5800)} USD",
        "Oval": f"{random.randint(3400, 6200)} USD",
        "Cushion": f"{random.randint(3300, 6100)} USD",
        "Radiant": f"{random.randint(3100, 5900)} USD",
        "Pear": f"{random.randint(3200, 6000)} USD",
        "Asscher": f"{random.randint(3000, 5700)} USD",
        "Marquise": f"{random.randint(3100, 5800)} USD",
        "Heart": f"{random.randint(3500, 6500)} USD"
    }
    return JSONResponse(content={"prices": prices})
 # ...existing code...
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import sessionmaker, declarative_base
from sqlalchemy import Column, Integer, String, Float, Text
from passlib.context import CryptContext
from jose import JWTError, jwt
from pydantic import BaseModel, EmailStr
import os
import stripe
import paypalrestsdk
from dotenv import load_dotenv
import requests
from datetime import datetime
from typing import Optional, List
import uuid
from square.client import Client

load_dotenv()
stripe.api_key = os.getenv("STRIPE_SECRET_KEY", "sk_test_...")
paypalrestsdk.configure({
    "mode": "sandbox",  # or "live"
    "client_id": os.getenv("PAYPAL_CLIENT_ID", ""),
    "client_secret": os.getenv("PAYPAL_CLIENT_SECRET", "")
})
SQUARE_ACCESS_TOKEN = os.getenv("SQUARE_ACCESS_TOKEN", "your-square-access-token")
SQUARE_LOCATION_ID = os.getenv("SQUARE_LOCATION_ID", "your-location-id")
square_client = Client(access_token=SQUARE_ACCESS_TOKEN, environment="sandbox")

DATABASE_URL = os.getenv("DATABASE_URL", "postgresql+asyncpg://postgres:password@localhost/postgres")
engine = create_async_engine(DATABASE_URL, echo=True)
SessionLocal = sessionmaker(engine, class_=AsyncSession, expire_on_commit=False)
Base = declarative_base()


class PaymentStatus(BaseModel):
    payment_id: str
    status: str
    method: str
    amount: float
    currency: str
    created_at: datetime

payment_status_db = []  # Replace with real DB in production

# --- Stripe Payment Endpoint ---
class StripePaymentRequest(BaseModel):
    amount: int
    currency: str = "usd"
    source: str
    description: Optional[str] = None

@app.post("/payments/stripe")
async def create_stripe_payment(data: StripePaymentRequest):
    try:
        charge = stripe.Charge.create(
            amount=data.amount,
            currency=data.currency,
            source=data.source,
            description=data.description
        )
        payment_status_db.append(PaymentStatus(
            payment_id=charge.id,
            status=charge.status,
            method="stripe",
            amount=data.amount / 100,
            currency=data.currency,
            created_at=datetime.utcfromtimestamp(charge.created)
        ))
        return {"ok": True, "charge": charge}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

# --- PayPal Payment Endpoint ---
class PayPalPaymentRequest(BaseModel):
    amount: str
    currency: str = "USD"
    description: Optional[str] = None

@app.post("/payments/paypal")
async def create_paypal_payment(data: PayPalPaymentRequest):
    payment = paypalrestsdk.Payment({
        "intent": "sale",
        "payer": {"payment_method": "paypal"},
        "transactions": [{
            "amount": {"total": data.amount, "currency": data.currency},
            "description": data.description or ""
        }],
        "redirect_urls": {
            "return_url": "https://example.com/payment/execute",
            "cancel_url": "https://example.com/payment/cancel"
        }
    })
    if payment.create():
        payment_status_db.append(PaymentStatus(
            payment_id=payment.id,
            status=payment.state,
            method="paypal",
            amount=float(data.amount),
            currency=data.currency,
            created_at=datetime.utcnow()
        ))
        return {"ok": True, "payment": payment.to_dict()}
    else:
        raise HTTPException(status_code=400, detail=payment.error)

# --- Refund Endpoints ---
class RefundRequest(BaseModel):
    payment_id: str
    amount: Optional[int] = None

@app.post("/payments/refund/stripe")
async def refund_stripe_payment(data: RefundRequest):
    try:
        refund = stripe.Refund.create(
            charge=data.payment_id,
            amount=data.amount
        )
        return {"ok": True, "refund": refund}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

# Refund endpoint (PayPal)
@app.post("/payments/refund/paypal")
async def refund_paypal_payment(data: RefundRequest):
    sale = paypalrestsdk.Sale.find(data.payment_id)
    refund = sale.refund({"amount": {"total": str(data.amount), "currency": "USD"}})
    if refund.success():
        return {"ok": True, "refund": refund.to_dict()}
    else:
        raise HTTPException(status_code=400, detail=refund.error)

# --- Subscription Endpoint (Stripe) ---
class SubscriptionRequest(BaseModel):
    customer_id: str
    price_id: str

@app.post("/payments/subscribe/stripe")
async def create_stripe_subscription(data: SubscriptionRequest):
    try:
        subscription = stripe.Subscription.create(
            customer=data.customer_id,
            items=[{"price": data.price_id}]
        )
        return {"ok": True, "subscription": subscription}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

# --- Stripe Webhook Endpoint ---
@app.post("/payments/webhook/stripe")
async def stripe_webhook(request: Request):
    payload = await request.body()
    sig_header = request.headers.get("Stripe-Signature")
    endpoint_secret = os.getenv("STRIPE_WEBHOOK_SECRET", "whsec_...")
    try:
        event = stripe.Webhook.construct_event(
            payload, sig_header, endpoint_secret
        )
        # Handle event types here
        return {"ok": True, "event": event}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

# --- Multi-currency Support (Stripe) ---
@app.get("/payments/currencies")
async def get_supported_currencies():
    try:
        currencies = stripe.CountrySpec.list()
        return {"ok": True, "currencies": currencies}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

# --- Invoice Generation (Stripe) ---
class InvoiceRequest(BaseModel):
    customer_id: str
    amount: int
    currency: str = "usd"
    email: EmailStr

@app.post("/payments/invoice/stripe")
async def create_stripe_invoice(data: InvoiceRequest):
    try:
        invoice_item = stripe.InvoiceItem.create(
            customer=data.customer_id,
            amount=data.amount,
            currency=data.currency,
            description="Custom invoice"
        )
        invoice = stripe.Invoice.create(
            customer=data.customer_id,
            auto_advance=True
        )
        stripe.Invoice.send_invoice(invoice.id)
        # Email sending logic here (use SendGrid, SMTP, etc.)
        return {"ok": True, "invoice": invoice}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

        preview_url = f"https://youraccount.blob.core.windows.net/renders/{model_id}_preview.png"
        status = "queued"
    else:
        # Local stub
        job_id = f"local-{uuid.uuid4()}"
        preview_url = f"/static/renders/{model_id}_preview.png"
        status = "queued"
    return job_id, status, preview_url

def upload_project_file_to_provider(provider: CloudProvider, project_id: int, file_url: str, version: str, metadata: dict):
    # Stub: Add real integration for each provider
    if provider == CloudProvider.aws:
        upload_id = f"aws-{uuid.uuid4()}"
        status = "uploaded"
        file_url = f"https://s3.amazonaws.com/yourbucket/projects/{project_id}/{version or 'latest'}.zip"
    elif provider == CloudProvider.gcp:
        upload_id = f"gcp-{uuid.uuid4()}"
        status = "uploaded"
        file_url = f"https://storage.googleapis.com/yourbucket/projects/{project_id}/{version or 'latest'}.zip"
    elif provider == CloudProvider.azure:
        upload_id = f"azure-{uuid.uuid4()}"
        status = "uploaded"
        file_url = f"https://youraccount.blob.core.windows.net/projects/{project_id}/{version or 'latest'}.zip"
    else:
        upload_id = f"local-{uuid.uuid4()}"
        status = "uploaded"
    return upload_id, status, file_url

# --- Cloud Rendering API ---
class CloudRenderJobRequest(BaseModel):
    model_id: int
    quality: str = "high"
    options: Optional[dict] = None

class CloudRenderJobOut(BaseModel):
    job_id: str
    status: str
    preview_url: Optional[str] = None

@app.post("/cloud/render", response_model=CloudRenderJobOut)
async def start_cloud_render_job(data: CloudRenderJobRequest):
    provider = CloudProvider(CLOUD_PROVIDER)
    job_id, status, preview_url = submit_render_job_to_provider(provider, data.model_id, data.quality, data.options or {})
    return CloudRenderJobOut(job_id=job_id, status=status, preview_url=preview_url)

# --- Cloud Project Storage API ---
class CloudProjectUploadRequest(BaseModel):
    project_id: int
    file_url: str
    version: Optional[str] = None
    metadata: Optional[dict] = None

class CloudProjectUploadOut(BaseModel):
    upload_id: str
    status: str
    file_url: str
    version: Optional[str] = None

@app.post("/cloud/project/upload", response_model=CloudProjectUploadOut)
async def upload_project_file(data: CloudProjectUploadRequest):
    provider = CloudProvider(CLOUD_PROVIDER)
    try:
        upload_id, status, file_url = upload_project_file_to_provider(provider, data.project_id, data.file_url, data.version, data.metadata or {})
        # Simulate version history update (stub)
        # In production, update DB or cloud metadata
        return CloudProjectUploadOut(upload_id=upload_id, status=status, file_url=file_url, version=data.version)
    except Exception as e:
        return CloudProjectUploadOut(upload_id="", status="error", file_url=data.file_url, version=data.version)

class CloudProjectListOut(BaseModel):
    projects: list

@app.get("/cloud/project/list", response_model=CloudProjectListOut)
async def list_cloud_projects():
    # Stub: In production, list projects and version history from cloud storage
    # Example metadata: project_id, name, versions, last_modified, owner
    projects = [
        {
            "project_id": 1,
            "name": "Demo Project",
            "versions": ["v1.0", "v1.1"],
            "last_modified": "2025-09-16T12:00:00Z",
            "owner": "user@example.com"
        }
    ]
    return CloudProjectListOut(projects=projects)
from fastapi import FastAPI, WebSocket, WebSocketDisconnect, Depends, HTTPException, status, Request, UploadFile, File, APIRouter
from fastapi.middleware.cors import CORSMiddleware
from starlette.middleware import Middleware
from starlette.middleware.trustedhost import TrustedHostMiddleware
from fastapi.responses import JSONResponse
from fastapi.exception_handlers import RequestValidationError
from fastapi.exceptions import RequestValidationError as FastAPIRequestValidationError
from starlette.exceptions import HTTPException as StarletteHTTPException
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import sessionmaker, declarative_base
from sqlalchemy import Column, Integer, String, Float, Text, select
from passlib.context import CryptContext
from jose import JWTError, jwt
from pydantic import BaseModel, EmailStr, Field
from typing import Optional, List
import stripe
import paypalrestsdk
from dotenv import load_dotenv
from square.client import Square, SquareEnvironment
import sentry_sdk
from loguru import logger
import os
import uuid
from datetime import datetime
import numpy as np
from enum import Enum

# --- Environment Setup ---
load_dotenv()
DATABASE_URL = os.getenv("DATABASE_URL", "sqlite+aiosqlite:///./test.db")
STRIPE_SECRET_KEY = os.getenv("STRIPE_SECRET_KEY", "sk_test_...")
PAYPAL_CLIENT_ID = os.getenv("PAYPAL_CLIENT_ID", "")
PAYPAL_CLIENT_SECRET = os.getenv("PAYPAL_CLIENT_SECRET", "")
SQUARE_ACCESS_TOKEN = os.getenv("SQUARE_ACCESS_TOKEN", "your-square-access-token")
SQUARE_LOCATION_ID = os.getenv("SQUARE_LOCATION_ID", "your-location-id")
stripe.api_key = STRIPE_SECRET_KEY
paypalrestsdk.configure({
    "mode": "sandbox",  # or "live"
    "client_id": PAYPAL_CLIENT_ID,
    "client_secret": PAYPAL_CLIENT_SECRET
})
square_client = Square(
    environment=SquareEnvironment.SANDBOX,
    token=SQUARE_ACCESS_TOKEN
)

# --- App & DB Setup ---

# --- Real-Time Collaboration WebSocket Endpoint ---
class ConnectionManager:
    def __init__(self):
        self.active_connections: List[WebSocket] = []

    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.active_connections.append(websocket)

    def disconnect(self, websocket: WebSocket):
        self.active_connections.remove(websocket)

    async def broadcast(self, message: str):
        for connection in self.active_connections:
            await connection.send_text(message)

manager = ConnectionManager()

@app.websocket("/collab/ws")
async def collab_ws(websocket: WebSocket):
    await manager.connect(websocket)
    try:
        while True:
            data = await websocket.receive_text()
            await manager.broadcast(data)
    except WebSocketDisconnect:
        manager.disconnect(websocket)
profile_results = [
    {"area": "Frontend Rendering", "time": "42ms", "suggestion": "Optimize SVG redraws"},
    {"area": "3D Viewport", "time": "68ms", "suggestion": "Reduce mesh complexity"},
    {"area": "Backend Geometry", "time": "110ms", "suggestion": "Cache repeated calculations"}
]
script_list = [
    {"name": "Batch Export Stones", "language": "Python", "code": "for stone in stones: export(stone)"},
    {"name": "Auto Layout", "language": "JS", "code": "layoutStones(mesh, params)"}
]
ai_suggestions = [
    {"type": "Auto Layout", "description": "Suggest optimal stone arrangement for current mesh."},
    {"type": "Error Correction", "description": "Detect and fix overlapping stones."},
    {"type": "Generative Design", "description": "Generate new ring design based on user preferences."}
]

@app.get("/profile/results")
async def get_profile_results():
    return {"profile": profile_results}

@app.post("/profile/optimize")
async def optimize_profile():
    optimized = [
        {"area": "Frontend Rendering", "time": "30ms", "suggestion": "SVG redraws optimized"},
        {"area": "3D Viewport", "time": "50ms", "suggestion": "Mesh complexity reduced"},
        {"area": "Backend Geometry", "time": "80ms", "suggestion": "Calculations cached"}
    ]
    return {"profile": optimized}

@app.get("/scripts/list")
async def get_scripts():
    return {"scripts": script_list}

@app.post("/scripts/run")
async def run_script(req: Request):
    data = await req.json()
    output = f"Script '{data.get('name')}' executed. Output: OK."
    return {"output": output}

@app.get("/ai/suggest")
async def get_ai_suggestions():
    return {"suggestions": ai_suggestions}

@app.post("/ai/correct")
async def apply_ai_correction(req: Request):
    data = await req.json()
    output = f"AI suggestion '{data.get('type')}' applied. Result: Success."
    return {"output": output}
# --- AI-Assisted Design Endpoints (demo, in-memory) ---
ai_suggestions = [
    {"type": "Auto Layout", "description": "Suggest optimal stone arrangement for current mesh."},
    {"type": "Error Correction", "description": "Detect and fix overlapping stones."},
    {"type": "Generative Design", "description": "Generate new ring design based on user preferences."}
]

@app.get("/ai/suggest")
async def get_ai_suggestions():
    return {"suggestions": ai_suggestions}

@app.post("/ai/correct")
async def apply_ai_correction(req: Request):
    data = await req.json()
    # Simulate AI suggestion application
    output = f"AI suggestion '{data.get('type')}' applied. Result: Success."
    return {"output": output}
# --- Scripting & Automation Endpoints (demo, in-memory) ---
script_list = [
    {"name": "Batch Export Stones", "language": "Python", "code": "for stone in stones: export(stone)"},
    {"name": "Auto Layout", "language": "JS", "code": "layoutStones(mesh, params)"}
]

@app.get("/scripts/list")
async def get_scripts():
    return {"scripts": script_list}

@app.post("/scripts/run")
async def run_script(req: Request):
    data = await req.json()
    # Simulate script execution
    output = f"Script '{data.get('name')}' executed. Output: OK."
    return {"output": output}

# ...existing code...


plugin_list = [
    {"name": "Parametric Modeling", "installed": True, "description": "Advanced parametric CAD tools."},
    {"name": "Stone Pattern Generator", "installed": False, "description": "Automate stone layouts and patterns."},
    {"name": "Technical Drawing Export", "installed": True, "description": "Export PDF/DXF drawings."},
    {"name": "Cloud Rendering", "installed": False, "description": "Render designs in the cloud."}
]

@app.get("/plugins/list")
async def get_plugins():
    return {"plugins": plugin_list}

@app.post("/plugins/install")
async def install_plugin(req: Request):
    data = await req.json()
    for p in plugin_list:
        if p["name"] == data.get("name"):
            p["installed"] = True
    return {"plugins": plugin_list}

@app.post("/plugins/uninstall")
async def uninstall_plugin(req: Request):
    data = await req.json()
    for p in plugin_list:
        if p["name"] == data.get("name"):
            p["installed"] = False
    return {"plugins": plugin_list}

# --- Collaboration Endpoints (demo, in-memory) ---
collab_users = [
    {"name": "You", "color": "#6366f1"},
    {"name": "Alice", "color": "#f59e42"},
    {"name": "Bob", "color": "#8fd3f4"}
]
collab_annotations = [
    {"user": "Alice", "text": "Check prong thickness here.", "time": "2m ago"},
    {"user": "Bob", "text": "Suggest larger stone size.", "time": "1m ago"}
]

@app.get("/collab/users")
async def get_collab_users():
    return {"users": collab_users}

@app.get("/collab/annotations")
async def get_collab_annotations():
    return {"annotations": collab_annotations}

@app.post("/collab/annotations")
async def add_collab_annotation(req: Request):
    data = await req.json()
    collab_annotations.append({"user": data.get("user", "You"), "text": data.get("text", ""), "time": "now"})
    return {"annotations": collab_annotations}

@app.post("/collab/share")
async def share_project():
    return {"status": "Project shared!"}
from fastapi import APIRouter, UploadFile, File, Form
from pydantic import BaseModel
from typing import Optional, List
import numpy as np

router = APIRouter()

class DiamondFillRequest(BaseModel):
    region_mesh: List[List[float]]  # Example: [[x, y, z], ...]
    stone_size: float
    grid_type: str
    spacing: float
    padding: float
    stone_shape: str

class DiamondFillResponse(BaseModel):
    modified_mesh: Optional[List[List[float]]]
    diamond_report: dict


@router.post("/cad/auto-diamond-fill", response_model=DiamondFillResponse)
async def auto_diamond_fill(req: DiamondFillRequest):
    region = np.array(req.region_mesh)
    min_xyz = region.min(axis=0)
    max_xyz = region.max(axis=0)
    grid = []
    count = 0
    shapes_used = []
    x = min_xyz[0] + req.padding
    while x < max_xyz[0] - req.padding:
        y = min_xyz[1] + req.padding
        while y < max_xyz[1] - req.padding:
            grid.append([x, y, min_xyz[2]])
            count += 1
            if req.stone_shape == "mixed":
                shapes_used.append([x, y, min_xyz[2], ["round", "princess", "oval", "emerald"][count % 4]])
            else:
                shapes_used.append([x, y, min_xyz[2], req.stone_shape])
            y += req.stone_size + req.spacing
        x += req.stone_size + req.spacing
    report = {
        "total_diamonds": count,
        "stone_size": req.stone_size,
        "grid_type": req.grid_type,
        "spacing": req.spacing,
        "padding": req.padding,
        "stone_shape": req.stone_shape,
        "shapes_used": shapes_used[:10]
    }
    return DiamondFillResponse(modified_mesh=req.region_mesh, diamond_report=report)

# Register router with main app
app.include_router(router)
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import sessionmaker, declarative_base
from sqlalchemy import Column, Integer, String, Float, Text, select
from passlib.context import CryptContext
from jose import JWTError, jwt
from pydantic import BaseModel, EmailStr
import stripe
import paypalrestsdk
from dotenv import load_dotenv
from square.client import Square, SquareEnvironment
import sentry_sdk
from loguru import logger

load_dotenv()
DATABASE_URL = os.getenv("DATABASE_URL", "sqlite+aiosqlite:///./test.db")
STRIPE_SECRET_KEY = os.getenv("STRIPE_SECRET_KEY", "sk_test_...")
PAYPAL_CLIENT_ID = os.getenv("PAYPAL_CLIENT_ID", "")
PAYPAL_CLIENT_SECRET = os.getenv("PAYPAL_CLIENT_SECRET", "")
SQUARE_ACCESS_TOKEN = os.getenv("SQUARE_ACCESS_TOKEN", "your-square-access-token")
SQUARE_LOCATION_ID = os.getenv("SQUARE_LOCATION_ID", "your-location-id")
stripe.api_key = STRIPE_SECRET_KEY
paypalrestsdk.configure({
    "mode": "sandbox",  # or "live"
    "client_id": PAYPAL_CLIENT_ID,
    "client_secret": PAYPAL_CLIENT_SECRET
})
square_client = Square(
    environment=SquareEnvironment.SANDBOX,
    token=SQUARE_ACCESS_TOKEN
)


# --- Production Report & Manufacturability Check Endpoint ---
class ProductionReportRequest(BaseModel):
    model_id: int
    options: Optional[dict] = None

class ProductionReportOut(BaseModel):
    model_id: int
    manufacturable: bool
    issues: list = Field(default_factory=list)
    report_url: Optional[str] = None
    status: str

@app.post("/cad/production-report", response_model=ProductionReportOut)
async def production_report(data: ProductionReportRequest):
    # Realistic manufacturability check (demo logic)
    # In production, load mesh and stones from DB or file
    mesh = {
        "wall_thickness": 1.1,  # mm
        "prong_strength": 0.7   # arbitrary units
    }
    stones = data.options.get("stones", []) if data.options else []
    issues = []
    if mesh["wall_thickness"] < 1.0:
        issues.append("Minimum wall thickness not met")
    if mesh["prong_strength"] < 0.5:
        issues.append("Prong strength below recommended")
    if len(stones) > 0 and any(s.get("overlap", False) for s in stones):
        issues.append("Stone seat overlap detected")
    manufacturable = len(issues) == 0
    report_url = f"/static/reports/{data.model_id}_production.pdf"
    return ProductionReportOut(
        model_id=data.model_id,
        manufacturable=manufacturable,
        issues=issues,
        report_url=report_url,
        status="report generated"
    )
from pydantic import Field

# --- Production Report & Manufacturability Check Endpoint ---
class ProductionReportRequest(BaseModel):
    model_id: int
    options: Optional[dict] = None

class ProductionReportOut(BaseModel):
    model_id: int
    manufacturable: bool
    issues: list = Field(default_factory=list)
    report_url: Optional[str] = None
    status: str

@app.post("/cad/production-report", response_model=ProductionReportOut)
async def production_report(data: ProductionReportRequest):
    # Stub: Analyze manufacturability and generate report
    # Example: geometry_kernel.check_manufacturability(model_id)
    issues = ["Minimum wall thickness not met", "Stone seat overlap detected"]
    manufacturable = False if issues else True
    report_url = f"/static/reports/{data.model_id}_production.pdf"
    return ProductionReportOut(
        model_id=data.model_id,
        manufacturable=manufacturable,
        issues=issues,
        report_url=report_url,
        status="report generated (stub)"
    )
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import sessionmaker, declarative_base
from sqlalchemy import Column, Integer, String, Float, Text, select
from passlib.context import CryptContext
from jose import JWTError, jwt
from pydantic import BaseModel, EmailStr
import stripe
import paypalrestsdk
from dotenv import load_dotenv
from square.client import Square, SquareEnvironment
import sentry_sdk
from loguru import logger

load_dotenv()
DATABASE_URL = os.getenv("DATABASE_URL", "sqlite+aiosqlite:///./test.db")
STRIPE_SECRET_KEY = os.getenv("STRIPE_SECRET_KEY", "sk_test_...")
PAYPAL_CLIENT_ID = os.getenv("PAYPAL_CLIENT_ID", "")
PAYPAL_CLIENT_SECRET = os.getenv("PAYPAL_CLIENT_SECRET", "")
SQUARE_ACCESS_TOKEN = os.getenv("SQUARE_ACCESS_TOKEN", "your-square-access-token")
SQUARE_LOCATION_ID = os.getenv("SQUARE_LOCATION_ID", "your-location-id")
stripe.api_key = STRIPE_SECRET_KEY
paypalrestsdk.configure({
    "mode": "sandbox",  # or "live"
    "client_id": PAYPAL_CLIENT_ID,
    "client_secret": PAYPAL_CLIENT_SECRET
})
square_client = Square(
    environment=SquareEnvironment.SANDBOX,
    token=SQUARE_ACCESS_TOKEN
)


# --- Sweep Along Path to STL API ---
class SweepRequest(BaseModel):
    path: list  # List of path points or curve data
    profile: dict  # Profile shape data
    params: Optional[dict] = None

class SweepOut(BaseModel):
    stl_url: str
    status: str

@app.post("/geometry/sweep", response_model=SweepOut)
async def sweep_along_path(data: SweepRequest):
    # Stub: Integrate with geometry kernel to sweep profile along path and export STL
    # Example: geometry_kernel.sweep(path, profile) → STL
    stl_url = "/static/exports/sweep_result.stl"
    return SweepOut(stl_url=stl_url, status="sweep generated (stub)")
import os
import uuid
from datetime import datetime
from typing import Optional, List
from . import StonePattern
from enum import Enum
from fastapi import FastAPI, Depends, HTTPException, status, Request
from fastapi.middleware.cors import CORSMiddleware
from starlette.middleware import Middleware
from starlette.middleware.trustedhost import TrustedHostMiddleware
from fastapi.responses import JSONResponse
from fastapi.exception_handlers import RequestValidationError
from fastapi.exceptions import RequestValidationError as FastAPIRequestValidationError
from starlette.exceptions import HTTPException as StarletteHTTPException
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import sessionmaker, declarative_base
from sqlalchemy import Column, Integer, String, Float, Text, select
from passlib.context import CryptContext
from jose import JWTError, jwt
from pydantic import BaseModel, EmailStr
import stripe
import paypalrestsdk
from dotenv import load_dotenv
from square.client import Square, SquareEnvironment
import sentry_sdk
from loguru import logger

load_dotenv()
DATABASE_URL = os.getenv("DATABASE_URL", "sqlite+aiosqlite:///./test.db")
STRIPE_SECRET_KEY = os.getenv("STRIPE_SECRET_KEY", "sk_test_...")
PAYPAL_CLIENT_ID = os.getenv("PAYPAL_CLIENT_ID", "")
PAYPAL_CLIENT_SECRET = os.getenv("PAYPAL_CLIENT_SECRET", "")
SQUARE_ACCESS_TOKEN = os.getenv("SQUARE_ACCESS_TOKEN", "your-square-access-token")
SQUARE_LOCATION_ID = os.getenv("SQUARE_LOCATION_ID", "your-location-id")
stripe.api_key = STRIPE_SECRET_KEY
paypalrestsdk.configure({
    "mode": "sandbox",  # or "live"
    "client_id": PAYPAL_CLIENT_ID,
    "client_secret": PAYPAL_CLIENT_SECRET
})
square_client = Square(
    environment=SquareEnvironment.SANDBOX,
    token=SQUARE_ACCESS_TOKEN
)


# --- Diamond Seat Generation API ---
class DiamondSeatRequest(BaseModel):
    jewelry_type: str
    cad_model_id: int
    pattern: StonePattern
    stones: list  # List of stone positions and sizes
    params: Optional[dict] = None

class DiamondSeatOut(BaseModel):
    seat_geometries: list  # List of seat geometry data (stub)
    status: str

@app.post("/cad/diamond-seats", response_model=DiamondSeatOut)
async def generate_diamond_seats(data: DiamondSeatRequest):
    # Integrate with geometry engine to cut seats/holes for each stone
    seat_geometries = []
    for stone in data.stones:
        # Placeholder for geometry kernel logic
        seat_geometry = {
            "position": stone.get("position"),
            "size": stone.get("size"),
            "type": data.pattern,
            "seat": f"Seat geometry for {data.pattern} at {stone.get('position')} (geometry kernel stub)"
        }
        # Example: seat_geometry["mesh"] = geometry_kernel.cut_seat(...)
        seat_geometries.append(seat_geometry)
    # TODO: Integrate with OpenCASCADE/CGAL or other kernel for real seat cutting
    return DiamondSeatOut(seat_geometries=seat_geometries, status="generated (geometry stub)")
import os
import uuid
from datetime import datetime
from typing import Optional, List
from enum import Enum
from fastapi import FastAPI, Depends, HTTPException, status, Request
from fastapi.middleware.cors import CORSMiddleware
from starlette.middleware import Middleware
from starlette.middleware.trustedhost import TrustedHostMiddleware
from fastapi.responses import JSONResponse
from fastapi.exception_handlers import RequestValidationError
from fastapi.exceptions import RequestValidationError as FastAPIRequestValidationError
from starlette.exceptions import HTTPException as StarletteHTTPException
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import sessionmaker, declarative_base
from sqlalchemy import Column, Integer, String, Float, Text, select
from passlib.context import CryptContext
from jose import JWTError, jwt
from pydantic import BaseModel, EmailStr
import stripe
import paypalrestsdk
from dotenv import load_dotenv
from square.client import Square, SquareEnvironment
import sentry_sdk
from loguru import logger

load_dotenv()
DATABASE_URL = os.getenv("DATABASE_URL", "sqlite+aiosqlite:///./test.db")
STRIPE_SECRET_KEY = os.getenv("STRIPE_SECRET_KEY", "sk_test_...")
PAYPAL_CLIENT_ID = os.getenv("PAYPAL_CLIENT_ID", "")
PAYPAL_CLIENT_SECRET = os.getenv("PAYPAL_CLIENT_SECRET", "")
SQUARE_ACCESS_TOKEN = os.getenv("SQUARE_ACCESS_TOKEN", "your-square-access-token")
SQUARE_LOCATION_ID = os.getenv("SQUARE_LOCATION_ID", "your-location-id")
stripe.api_key = STRIPE_SECRET_KEY
paypalrestsdk.configure({
    "mode": "sandbox",  # or "live"
    "client_id": PAYPAL_CLIENT_ID,
    "client_secret": PAYPAL_CLIENT_SECRET
})
square_client = Square(
    environment=SquareEnvironment.SANDBOX,
    token=SQUARE_ACCESS_TOKEN
)

app = FastAPI()
engine = create_async_engine(DATABASE_URL, echo=True)
SessionLocal = sessionmaker(engine, class_=AsyncSession, expire_on_commit=False)
Base = declarative_base()
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
SECRET_KEY = os.getenv("SECRET_KEY", "change-this-in-production")
ALGORITHM = "HS256"

# --- Earring Components API ---
class EarringPostType(str, Enum):
    regular = "regular"
    screw_on = "screw_on"

class EarringBackingType(str, Enum):
    regular = "regular"
    screw_on = "screw_on"

class EarringComponentCreate(BaseModel):
    name: str
    post_type: EarringPostType
    backing_type: EarringBackingType
    params: Optional[dict] = None

class EarringComponentOut(BaseModel):
    id: int
    name: str
    post_type: EarringPostType
    backing_type: EarringBackingType
    params: Optional[dict]
    class Config:
        orm_mode = True

class EarringComponentModel(Base):
    __tablename__ = "earring_components"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    post_type = Column(String)
    backing_type = Column(String)
    params = Column(Text, nullable=True)

async def get_db():
    async with SessionLocal() as session:
        yield session

@app.post("/earrings/components", response_model=EarringComponentOut)
async def create_earring_component(data: EarringComponentCreate, db: AsyncSession = Depends(get_db)):
    new_component = EarringComponentModel(
        name=data.name,
        post_type=data.post_type,
        backing_type=data.backing_type,
        params=str(data.params) if data.params else None
    )
    db.add(new_component)
    await db.commit()
    await db.refresh(new_component)
    return new_component

@app.get("/earrings/components", response_model=List[EarringComponentOut])
async def list_earring_components(db: AsyncSession = Depends(get_db)):
    result = await db.execute(EarringComponentModel.__table__.select())
    components = result.scalars().all()
    return components

# --- Glasses Frames API ---
class GlassesBrand(str, Enum):
    cartier = "cartier"
    rayban = "rayban"
    custom = "custom"

class GlassesFrameCreate(BaseModel):
    brand: GlassesBrand
    name: str
    diamonds: Optional[dict] = None
    nose_bridge: Optional[str] = None
    hinges: Optional[str] = None
    params: Optional[dict] = None

class GlassesFrameOut(BaseModel):
    id: int
    brand: GlassesBrand
    name: str
    diamonds: Optional[dict]
    nose_bridge: Optional[str]
    hinges: Optional[str]
    params: Optional[dict]
    class Config:
        orm_mode = True

class GlassesFrameModel(Base):
    __tablename__ = "glasses_frames"
    id = Column(Integer, primary_key=True, index=True)
    brand = Column(String)
    name = Column(String, index=True)
    diamonds = Column(Text, nullable=True)
    nose_bridge = Column(String, nullable=True)
    hinges = Column(String, nullable=True)
    params = Column(Text, nullable=True)

@app.post("/glasses/frames", response_model=GlassesFrameOut)
async def create_glasses_frame(data: GlassesFrameCreate, db: AsyncSession = Depends(get_db)):
    new_frame = GlassesFrameModel(
        brand=data.brand,
        name=data.name,
        diamonds=str(data.diamonds) if data.diamonds else None,
        nose_bridge=data.nose_bridge,
        hinges=data.hinges,
        params=str(data.params) if data.params else None
    )
    db.add(new_frame)
    await db.commit()
    await db.refresh(new_frame)
    return new_frame

@app.get("/glasses/frames", response_model=List[GlassesFrameOut])
async def list_glasses_frames(db: AsyncSession = Depends(get_db)):
    result = await db.execute(GlassesFrameModel.__table__.select())
    frames = result.scalars().all()
    return frames
import os
import uuid
from datetime import datetime
from typing import Optional, List
from enum import Enum
from fastapi import FastAPI, Depends, HTTPException, status, Request
from fastapi.middleware.cors import CORSMiddleware
from starlette.middleware import Middleware
from starlette.middleware.trustedhost import TrustedHostMiddleware
from fastapi.responses import JSONResponse
from fastapi.exception_handlers import RequestValidationError
from fastapi.exceptions import RequestValidationError as FastAPIRequestValidationError
from starlette.exceptions import HTTPException as StarletteHTTPException
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import sessionmaker, declarative_base
from sqlalchemy import Column, Integer, String, Float, Text, select
from passlib.context import CryptContext
from jose import JWTError, jwt
from pydantic import BaseModel, EmailStr
import stripe
import paypalrestsdk
from dotenv import load_dotenv
from square.client import Square, SquareEnvironment
import sentry_sdk
from loguru import logger

load_dotenv()
DATABASE_URL = os.getenv("DATABASE_URL", "sqlite+aiosqlite:///./test.db")
STRIPE_SECRET_KEY = os.getenv("STRIPE_SECRET_KEY", "sk_test_...")
PAYPAL_CLIENT_ID = os.getenv("PAYPAL_CLIENT_ID", "")
PAYPAL_CLIENT_SECRET = os.getenv("PAYPAL_CLIENT_SECRET", "")
SQUARE_ACCESS_TOKEN = os.getenv("SQUARE_ACCESS_TOKEN", "your-square-access-token")
SQUARE_LOCATION_ID = os.getenv("SQUARE_LOCATION_ID", "your-location-id")
stripe.api_key = STRIPE_SECRET_KEY
paypalrestsdk.configure({
    "mode": "sandbox",  # or "live"
    "client_id": PAYPAL_CLIENT_ID,
    "client_secret": PAYPAL_CLIENT_SECRET
})
square_client = Square(
    environment=SquareEnvironment.SANDBOX,
    token=SQUARE_ACCESS_TOKEN
)

app = FastAPI()
engine = create_async_engine(DATABASE_URL, echo=True)
SessionLocal = sessionmaker(engine, class_=AsyncSession, expire_on_commit=False)
Base = declarative_base()
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
SECRET_KEY = os.getenv("SECRET_KEY", "change-this-in-production")
ALGORITHM = "HS256"

# --- Technical Drawing/Export Pipeline API ---
class DrawingFormat(str, Enum):
    stl = "stl"
    obj = "obj"
    step = "step"
    pdf = "pdf"
    dxf = "dxf"

class DrawingRequest(BaseModel):
    model_id: int
    format: DrawingFormat
    options: Optional[dict] = None

class DrawingOut(BaseModel):
    model_id: int
    format: DrawingFormat
    url: str
    created_at: datetime


@app.post("/drawing/export", response_model=DrawingOut)
async def export_drawing(data: DrawingRequest):
    # Stub: Integrate with geometry kernel/exporter
    url = f"/static/exports/{data.model_id}.{data.format}"
    return DrawingOut(
        model_id=data.model_id,
        format=data.format,
        url=url,
        created_at=datetime.utcnow()
    )

# --- 3MF Export Endpoint ---
@app.post("/drawing/export-3mf/{model_id}")
async def export_3mf(model_id: int):
    # Stub: Integrate with geometry kernel for 3MF export
    url = f"/static/exports/{model_id}.3mf"
    return {"ok": True, "download_url": url, "status": "3MF export generated (stub)"}

# --- SVG Import Endpoint ---
@app.post("/drawing/import-svg")
async def import_svg(svg_data: dict):
    # Stub: Parse SVG and convert to geometry primitives
    # Example: geometry_kernel.import_svg(svg_data)
    return {"ok": True, "imported": True, "details": "SVG import processed (stub)", "svg_data": svg_data}

@app.get("/drawing/blueprint/{model_id}", response_model=DrawingOut)
async def get_blueprint(model_id: int, format: DrawingFormat = DrawingFormat.pdf):
    # Stub: Return blueprint file URL
    url = f"/static/blueprints/{model_id}.{format}"
    return DrawingOut(
        model_id=model_id,
        format=format,
        url=url,
        created_at=datetime.utcnow()
    )
import paypalrestsdk
from dotenv import load_dotenv
from square.client import Square, SquareEnvironment
import sentry_sdk
from loguru import logger

load_dotenv()
DATABASE_URL = os.getenv("DATABASE_URL", "sqlite+aiosqlite:///./test.db")
STRIPE_SECRET_KEY = os.getenv("STRIPE_SECRET_KEY", "sk_test_...")
PAYPAL_CLIENT_ID = os.getenv("PAYPAL_CLIENT_ID", "")
PAYPAL_CLIENT_SECRET = os.getenv("PAYPAL_CLIENT_SECRET", "")
SQUARE_ACCESS_TOKEN = os.getenv("SQUARE_ACCESS_TOKEN", "your-square-access-token")
SQUARE_LOCATION_ID = os.getenv("SQUARE_LOCATION_ID", "your-location-id")
stripe.api_key = STRIPE_SECRET_KEY
paypalrestsdk.configure({
    "mode": "sandbox",  # or "live"
    "client_id": PAYPAL_CLIENT_ID,
    "client_secret": PAYPAL_CLIENT_SECRET
})
square_client = Square(
    environment=SquareEnvironment.SANDBOX,
    token=SQUARE_ACCESS_TOKEN
)

app = FastAPI()
engine = create_async_engine(DATABASE_URL, echo=True)
SessionLocal = sessionmaker(engine, class_=AsyncSession, expire_on_commit=False)
Base = declarative_base()
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
SECRET_KEY = os.getenv("SECRET_KEY", "change-this-in-production")
ALGORITHM = "HS256"

# --- Scripting/Automation Engine API ---
class ScriptType(str, Enum):
    python = "python"
    cadquery = "cadquery"
    custom = "custom"

class ScriptCreate(BaseModel):
    name: str
    code: str
    type: ScriptType = ScriptType.python
    params: Optional[dict] = None

class ScriptOut(BaseModel):
    id: int
    name: str
    code: str
    type: ScriptType
    params: Optional[dict]
    created_at: datetime
    class Config:
        orm_mode = True

class ScriptModel(Base):
    __tablename__ = "scripts"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    code = Column(Text)
    type = Column(String)
    params = Column(Text, nullable=True)
    created_at = Column(String, default=lambda: datetime.utcnow().isoformat())

async def get_db():
    async with SessionLocal() as session:
        yield session

@app.post("/scripting/scripts", response_model=ScriptOut)
async def create_script(data: ScriptCreate, db: AsyncSession = Depends(get_db)):
    new_script = ScriptModel(
        name=data.name,
        code=data.code,
        type=data.type,
        params=str(data.params) if data.params else None,
        created_at=datetime.utcnow().isoformat()
    )
    db.add(new_script)
    await db.commit()
    await db.refresh(new_script)
    return new_script

@app.get("/scripting/scripts", response_model=List[ScriptOut])
async def list_scripts(db: AsyncSession = Depends(get_db)):
    result = await db.execute(ScriptModel.__table__.select())
    scripts = result.scalars().all()
    return scripts

@app.post("/scripting/run")
async def run_script(script_id: int, params: Optional[dict] = None, db: AsyncSession = Depends(get_db)):
    # Stub: Execute script logic (Python, CadQuery, custom)
    # In production, use sandboxed execution and proper security
    result = {"ok": True, "script_id": script_id, "output": "Script executed (stub)", "params": params}
    return result
from typing import Optional, List
from enum import Enum
from fastapi import FastAPI, Depends, HTTPException, status, Request
from fastapi.middleware.cors import CORSMiddleware
from starlette.middleware import Middleware
from starlette.middleware.trustedhost import TrustedHostMiddleware
from fastapi.responses import JSONResponse
from fastapi.exception_handlers import RequestValidationError
from fastapi.exceptions import RequestValidationError as FastAPIRequestValidationError
from starlette.exceptions import HTTPException as StarletteHTTPException
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import sessionmaker, declarative_base
from sqlalchemy import Column, Integer, String, Float, Text, select
from passlib.context import CryptContext
from jose import JWTError, jwt
from pydantic import BaseModel, EmailStr
import stripe
import paypalrestsdk
from dotenv import load_dotenv
from square.client import Square, SquareEnvironment
import sentry_sdk
from loguru import logger

load_dotenv()
DATABASE_URL = os.getenv("DATABASE_URL", "sqlite+aiosqlite:///./test.db")
STRIPE_SECRET_KEY = os.getenv("STRIPE_SECRET_KEY", "sk_test_...")
PAYPAL_CLIENT_ID = os.getenv("PAYPAL_CLIENT_ID", "")
PAYPAL_CLIENT_SECRET = os.getenv("PAYPAL_CLIENT_SECRET", "")
SQUARE_ACCESS_TOKEN = os.getenv("SQUARE_ACCESS_TOKEN", "your-square-access-token")
SQUARE_LOCATION_ID = os.getenv("SQUARE_LOCATION_ID", "your-location-id")
stripe.api_key = STRIPE_SECRET_KEY
paypalrestsdk.configure({
    "mode": "sandbox",  # or "live"
    "client_id": PAYPAL_CLIENT_ID,
    "client_secret": PAYPAL_CLIENT_SECRET
})
square_client = Square(
    environment=SquareEnvironment.SANDBOX,
    token=SQUARE_ACCESS_TOKEN
)

app = FastAPI()
engine = create_async_engine(DATABASE_URL, echo=True)
SessionLocal = sessionmaker(engine, class_=AsyncSession, expire_on_commit=False)
Base = declarative_base()
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
SECRET_KEY = os.getenv("SECRET_KEY", "change-this-in-production")
ALGORITHM = "HS256"

# --- Stone Placement Pattern API ---
class StonePattern(str, Enum):
    pave = "pave"  # Standard grid pavé
    honeycomb_pave = "honeycomb_pave"  # Hex-packed pavé
    channel = "channel"  # Channel rows
    invisible = "invisible"  # Invisible set
    micro_prong_pave = "micro_prong_pave"  # Dense pavé, small seats/prongs
    gypsy_flush = "gypsy_flush"  # Flush stone seats, no prongs
    eternity_full = "eternity_full"  # Full eternity loop
    eternity_half = "eternity_half"  # Half eternity loop
    prong = "prong"  # Standard prong
    bead = "bead"
    bar = "bar"
    custom = "custom"

class StonePatternCreate(BaseModel):
    jewelry_type: str  # e.g., ring, earring, pendant, bracelet, watch, glasses, grillz
    cad_model_id: int
    pattern: StonePattern
    params: dict

class StonePatternOut(BaseModel):
    id: int
    jewelry_type: str
    cad_model_id: int
    pattern: StonePattern
    params: dict
    class Config:
        orm_mode = True

class StonePatternModel(Base):
    __tablename__ = "stone_patterns"
    id = Column(Integer, primary_key=True, index=True)
    jewelry_type = Column(String, index=True)
    cad_model_id = Column(Integer)
    pattern = Column(String)
    params = Column(Text)

async def get_db():
    async with SessionLocal() as session:
        yield session

@app.post("/cad/stone-patterns", response_model=StonePatternOut)
async def create_stone_pattern(data: StonePatternCreate, db: AsyncSession = Depends(get_db)):
    new_pattern = StonePatternModel(
        jewelry_type=data.jewelry_type,
        cad_model_id=data.cad_model_id,
        pattern=data.pattern,
        params=str(data.params)
    )
    db.add(new_pattern)
    await db.commit()
    await db.refresh(new_pattern)
    return new_pattern

@app.get("/cad/stone-patterns/{jewelry_type}/{cad_model_id}", response_model=List[StonePatternOut])
async def list_stone_patterns(jewelry_type: str, cad_model_id: int, db: AsyncSession = Depends(get_db)):
    result = await db.execute(
        StonePatternModel.__table__.select().where(
            (StonePatternModel.jewelry_type == jewelry_type) &
            (StonePatternModel.cad_model_id == cad_model_id)
        )
    )
    patterns = result.scalars().all()
    return patterns

# --- Geometry Engine Integration Stubs ---
@app.post("/geometry/curve")
async def create_curve(data: dict):
    # Stub: Integrate with geometry kernel (e.g., OpenCASCADE)
    return {"ok": True, "curve_id": "curve123", "data": data}

@app.post("/geometry/surface")
async def create_surface(data: dict):
    return {"ok": True, "surface_id": "surface123", "data": data}

@app.post("/geometry/solid")
async def create_solid(data: dict):
    return {"ok": True, "solid_id": "solid123", "data": data}

@app.post("/geometry/boolean")
async def boolean_operation(data: dict):
    # data: {op: "union"|"subtract"|"intersect", solids: [...]}
    return {"ok": True, "result_id": "result123", "data": data}

@app.get("/geometry/viewport/{model_id}")
async def get_3d_viewport(model_id: int):
    # Stub: Return data for 3D rendering
    return {"ok": True, "model_id": model_id, "viewport_url": f"/static/viewport/{model_id}.glb"}
import sentry_sdk
# Sentry monitoring setup
sentry_dsn = os.getenv("SENTRY_DSN", None)
if sentry_dsn:
    sentry_sdk.init(
        dsn=sentry_dsn,
        traces_sample_rate=1.0,
        environment=os.getenv("SENTRY_ENV", "development")
    )
    logger.info("Sentry monitoring enabled.")
from loguru import logger

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from starlette.middleware import Middleware
from starlette.middleware.trustedhost import TrustedHostMiddleware
import os

app = FastAPI()

# CORS setup
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Change to specific domains in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Trusted hosts (optional, for production)
app.add_middleware(
    TrustedHostMiddleware,
    allowed_hosts=["localhost", "127.0.0.1", "yourdomain.com"]
)
from fastapi.responses import JSONResponse
from fastapi.exception_handlers import RequestValidationError
from fastapi.exceptions import RequestValidationError as FastAPIRequestValidationError
from starlette.exceptions import HTTPException as StarletteHTTPException

# Custom error handler for validation errors
@app.exception_handler(FastAPIRequestValidationError)
async def validation_exception_handler(request, exc):
    return JSONResponse(
        status_code=422,
        content={
            "detail": "Validation error",
            "errors": exc.errors(),
            "body": exc.body if hasattr(exc, 'body') else None
        },
    )

# Custom error handler for HTTP exceptions
@app.exception_handler(StarletteHTTPException)
async def http_exception_handler(request, exc):
    return JSONResponse(
        status_code=exc.status_code,
        content={
            "detail": exc.detail,
            "status_code": exc.status_code
        },
    )
from fastapi import FastAPI
app = FastAPI()
# --- Imports ---
import os
import uuid
from datetime import datetime
from typing import Optional, List
from fastapi import FastAPI, Depends, HTTPException, status, Request
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import sessionmaker, declarative_base
from sqlalchemy import Column, Integer, String, Float, Text, select
from passlib.context import CryptContext
from jose import JWTError, jwt
from pydantic import BaseModel, EmailStr
import stripe
import paypalrestsdk
from dotenv import load_dotenv
from square.client import Square, SquareEnvironment

# --- Environment Setup ---
load_dotenv()
DATABASE_URL = os.getenv("DATABASE_URL", "sqlite+aiosqlite:///./test.db")
STRIPE_SECRET_KEY = os.getenv("STRIPE_SECRET_KEY", "sk_test_...")
PAYPAL_CLIENT_ID = os.getenv("PAYPAL_CLIENT_ID", "")
PAYPAL_CLIENT_SECRET = os.getenv("PAYPAL_CLIENT_SECRET", "")
SQUARE_ACCESS_TOKEN = os.getenv("SQUARE_ACCESS_TOKEN", "your-square-access-token")
SQUARE_LOCATION_ID = os.getenv("SQUARE_LOCATION_ID", "your-location-id")
stripe.api_key = STRIPE_SECRET_KEY
paypalrestsdk.configure({
    "mode": "sandbox",  # or "live"
    "client_id": PAYPAL_CLIENT_ID,
    "client_secret": PAYPAL_CLIENT_SECRET
})
square_client = Square(
    environment=SquareEnvironment.SANDBOX,
    token=SQUARE_ACCESS_TOKEN
)

# --- App & DB Setup ---
app = FastAPI()
engine = create_async_engine(DATABASE_URL, echo=True)
SessionLocal = sessionmaker(engine, class_=AsyncSession, expire_on_commit=False)
Base = declarative_base()
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
SECRET_KEY = os.getenv("SECRET_KEY", "change-this-in-production")
ALGORITHM = "HS256"

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True)
    email = Column(String, unique=True, index=True)
    hashed_password = Column(String)

class Product(Base):
    __tablename__ = "products"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    description = Column(Text)
    price = Column(Float)

class Project(Base):
    __tablename__ = "projects"
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, index=True)
    details = Column(Text)

 
# Advanced CAD Models
class CADModel(Base):
    __tablename__ = "cad_models"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    type = Column(String, index=True)  # e.g., ring, bracelet, necklace, earring
    params = Column(Text)  # JSON string for parametric data
    preview_url = Column(String)
    created_at = Column(String)

class Gemstone(Base):
    __tablename__ = "gemstones"
    id = Column(Integer, primary_key=True, index=True)
    shape = Column(String)
    cut = Column(String)
    carat = Column(Float)
    color = Column(String)
    material = Column(String)

class AssemblyComponent(Base):
    __tablename__ = "assembly_components"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)
    type = Column(String)
    params = Column(Text)

class TechnicalDrawing(Base):
    __tablename__ = "technical_drawings"
    id = Column(Integer, primary_key=True, index=True)
    cad_model_id = Column(Integer)
    drawing_url = Column(String)

class BOMEntry(Base):
    __tablename__ = "bom_entries"
    id = Column(Integer, primary_key=True, index=True)
    cad_model_id = Column(Integer)
    material = Column(String)
    quantity = Column(Float)
    price = Column(Float)

# --- Schemas ---
class CADModelCreate(BaseModel):
    name: str
    type: str
    params: dict

class CADModelOut(BaseModel):
    id: int
    name: str
    type: str
    params: dict
    preview_url: str
    created_at: str
    class Config:
        orm_mode = True

class GemstoneCreate(BaseModel):
    shape: str
    cut: str
    carat: float
    color: str
    material: str

class GemstoneOut(BaseModel):
    id: int
    shape: str
    cut: str
    carat: float
    color: str
    material: str
    class Config:
        orm_mode = True

class AssemblyComponentCreate(BaseModel):
    name: str
    type: str
    params: dict

class AssemblyComponentOut(BaseModel):
    id: int
    name: str
    type: str
    params: dict
    class Config:
        orm_mode = True

class TechnicalDrawingCreate(BaseModel):
    cad_model_id: int
    drawing_url: str

class TechnicalDrawingOut(BaseModel):
    id: int
    cad_model_id: int
    drawing_url: str
    class Config:
        orm_mode = True

class BOMEntryCreate(BaseModel):
    cad_model_id: int
    material: str
    quantity: float
    price: float

class BOMEntryOut(BaseModel):
    id: int
    cad_model_id: int
    material: str
    quantity: float
    price: float
    class Config:
        orm_mode = True

# --- Advanced CAD Endpoints ---
@app.post("/cad/models", response_model=CADModelOut)
async def create_cad_model(model: CADModelCreate, db: AsyncSession = Depends(get_db)):
    new_model = CADModel(name=model.name, type=model.type, params=str(model.params), preview_url="", created_at=str(datetime.utcnow()))
    db.add(new_model)
    await db.commit()
    await db.refresh(new_model)
    return new_model

@app.get("/cad/models", response_model=List[CADModelOut])
async def list_cad_models(db: AsyncSession = Depends(get_db)):
    result = await db.execute(CADModel.__table__.select())
    models = result.scalars().all()
    return models

@app.post("/cad/gemstones", response_model=GemstoneOut)
async def create_gemstone(gem: GemstoneCreate, db: AsyncSession = Depends(get_db)):
    new_gem = Gemstone(**gem.dict())
    db.add(new_gem)
    await db.commit()
    await db.refresh(new_gem)
    return new_gem

@app.get("/cad/gemstones", response_model=List[GemstoneOut])
async def list_gemstones(db: AsyncSession = Depends(get_db)):
    result = await db.execute(Gemstone.__table__.select())
    gems = result.scalars().all()
    return gems

@app.post("/cad/assembly", response_model=AssemblyComponentOut)
async def create_assembly_component(comp: AssemblyComponentCreate, db: AsyncSession = Depends(get_db)):
    new_comp = AssemblyComponent(name=comp.name, type=comp.type, params=str(comp.params))
    db.add(new_comp)
    await db.commit()
    await db.refresh(new_comp)
    return new_comp

@app.get("/cad/assembly", response_model=List[AssemblyComponentOut])
async def list_assembly_components(db: AsyncSession = Depends(get_db)):
    result = await db.execute(AssemblyComponent.__table__.select())
    comps = result.scalars().all()
    return comps

@app.post("/cad/drawings", response_model=TechnicalDrawingOut)
async def create_technical_drawing(draw: TechnicalDrawingCreate, db: AsyncSession = Depends(get_db)):
    new_draw = TechnicalDrawing(**draw.dict())
    db.add(new_draw)
    await db.commit()
    await db.refresh(new_draw)
    return new_draw

@app.get("/cad/drawings", response_model=List[TechnicalDrawingOut])
async def list_technical_drawings(db: AsyncSession = Depends(get_db)):
    result = await db.execute(TechnicalDrawing.__table__.select())
    draws = result.scalars().all()
    return draws

@app.post("/cad/bom", response_model=BOMEntryOut)
async def create_bom_entry(entry: BOMEntryCreate, db: AsyncSession = Depends(get_db)):
    new_entry = BOMEntry(**entry.dict())
    db.add(new_entry)
    await db.commit()
    await db.refresh(new_entry)
    return new_entry

@app.get("/cad/bom", response_model=List[BOMEntryOut])
async def list_bom_entries(db: AsyncSession = Depends(get_db)):
    result = await db.execute(BOMEntry.__table__.select())
    entries = result.scalars().all()
    return entries

# Stubs for 3D preview, export, cloud rendering, collaboration
@app.get("/cad/preview/{model_id}")
async def get_3d_preview(model_id: int):
    return {"ok": True, "preview_url": f"/static/previews/{model_id}.png"}

@app.post("/cad/export/{model_id}")
async def export_cad_model(model_id: int, format: str = "STL"):
    return {"ok": True, "download_url": f"/static/exports/{model_id}.{format.lower()}"}

@app.post("/cad/cloud-render/{model_id}")
async def cloud_render(model_id: int):
    return {"ok": True, "status": "queued", "render_url": f"/static/renders/{model_id}.png"}

@app.post("/cad/collaborate/{model_id}")
async def collaborate(model_id: int, user: str):
    return {"ok": True, "status": "invited", "user": user}

 # --- Schemas ---
class UserCreate(BaseModel):
    username: str
    email: str
    password: str

class UserOut(BaseModel):
    id: int
    username: str
    email: str
    class Config:
        orm_mode = True

 
 
class Token(BaseModel):
    access_token: str
    token_type: str


class ProductCreate(BaseModel):
    name: str
    description: str
    price: float

class ProductOut(BaseModel):
    id: int
    name: str
    description: str
    price: float
    class Config:
        orm_mode = True

class ProjectCreate(BaseModel):
    title: str
    details: str

class ProjectOut(BaseModel):
    id: int
    title: str
    details: str
    class Config:
        orm_mode = True

 
class Token(BaseModel):
    access_token: str
    token_type: str

@app.on_event("startup")
async def startup():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)


# --- Utility Functions ---
def get_password_hash(password: str) -> str:
    if not password or len(password) < 8:
        raise ValueError("Password must be at least 8 characters long.")
    return pwd_context.hash(password)

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)

def create_access_token(data: dict) -> str:
    return jwt.encode(data, SECRET_KEY, algorithm=ALGORITHM)

async def get_db():
    async with SessionLocal() as session:
        yield session

 
# User Endpoints
@app.post("/register", response_model=UserOut)
 
# --- Startup Event ---
@app.on_event("startup")
async def startup():
    logger.info("Starting up and initializing database tables...")
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    logger.info("Database tables initialized.")

# --- User Endpoints ---
@app.post("/register", response_model=UserOut, summary="Register a new user", response_description="The created user")
async def register(user: UserCreate, db: AsyncSession = Depends(get_db)):
    """
    Register a new user with username, email, and password.
    Returns the created user object.
    """
    logger.info(f"Registering user: {user.username}")
    result = await db.execute(select(User).where(User.username == user.username))
    db_user = result.scalars().first()
    if db_user:
        logger.warning(f"Username already registered: {user.username}")
        raise HTTPException(status_code=400, detail="Username already registered")
    hashed_password = get_password_hash(user.password)
    new_user = User(username=user.username, email=user.email, hashed_password=hashed_password)
    db.add(new_user)
    await db.commit()
    await db.refresh(new_user)
 
    return new_user

@app.post("/login", response_model=Token)
async def login(form_data: UserCreate, db: AsyncSession = Depends(get_db)):
    db_user = await db.execute(
        User.__table__.select().where(User.username == form_data.username)
    )
    user = db_user.scalar()
    if not user or not verify_password(form_data.password, user.hashed_password):
        raise HTTPException(status_code=400, detail="Incorrect username or password")
    access_token = create_access_token({"sub": user.username})
    return {"access_token": access_token, "token_type": "bearer"}

# Product CRUD Endpoints
@app.post("/products", response_model=ProductOut)
async def create_product(product: ProductCreate, db: AsyncSession = Depends(get_db)):
 
    logger.info(f"User registered: {new_user.username}")
    return new_user

@app.post("/login", response_model=Token, summary="User login", response_description="JWT access token")
async def login(form_data: UserCreate, db: AsyncSession = Depends(get_db)):
    """
    Authenticate user and return JWT access token.
    """
    logger.info(f"Login attempt for user: {form_data.username}")
    result = await db.execute(select(User).where(User.username == form_data.username))
    user = result.scalars().first()
    if not user or not verify_password(form_data.password, user.hashed_password):
        logger.warning(f"Failed login for user: {form_data.username}")
        raise HTTPException(status_code=400, detail="Incorrect username or password")
    access_token = create_access_token({"sub": user.username})
    logger.info(f"User logged in: {user.username}")
    return {"access_token": access_token, "token_type": "bearer"}

# --- Product CRUD Endpoints ---
@app.post("/products", response_model=ProductOut, summary="Create a product", response_description="The created product")
async def create_product(product: ProductCreate, db: AsyncSession = Depends(get_db)):
    """
    Create a new product in the database.
    """
    new_product = Product(**product.dict())
    db.add(new_product)
    await db.commit()
    await db.refresh(new_product)
    return new_product

@app.get("/products", response_model=List[ProductOut], summary="List products", response_description="List of products")
async def list_products(db: AsyncSession = Depends(get_db)):
    """
    Retrieve all products from the database.
    """
    result = await db.execute(Product.__table__.select())
    products = result.scalars().all()
    return products

@app.get("/products/{product_id}", response_model=ProductOut, summary="Get product by ID", response_description="Product details")
async def get_product(product_id: int, db: AsyncSession = Depends(get_db)):
    """
    Retrieve a product by its ID.
    """
    result = await db.execute(Product.__table__.select().where(Product.id == product_id))
    product = result.scalar()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    return product

@app.put("/products/{product_id}", response_model=ProductOut, summary="Update product", response_description="Updated product")
async def update_product(product_id: int, product: ProductCreate, db: AsyncSession = Depends(get_db)):
    """
    Update an existing product by ID.
    """
    result = await db.execute(Product.__table__.select().where(Product.id == product_id))
    db_product = result.scalar()
    if not db_product:
        raise HTTPException(status_code=404, detail="Product not found")
    for key, value in product.dict().items():
        setattr(db_product, key, value)
    db.add(db_product)
    await db.commit()
    await db.refresh(db_product)
    return db_product

@app.delete("/products/{product_id}", summary="Delete product", response_description="Delete confirmation")
async def delete_product(product_id: int, db: AsyncSession = Depends(get_db)):
    """
    Delete a product by its ID.
    """
    result = await db.execute(Product.__table__.select().where(Product.id == product_id))
    db_product = result.scalar()
    if not db_product:
        raise HTTPException(status_code=404, detail="Product not found")
    await db.delete(db_product)
    await db.commit()
    return {"detail": "Product deleted"}

# --- Project CRUD Endpoints ---
@app.post("/projects", response_model=ProjectOut, summary="Create a project", response_description="The created project")
async def create_project(project: ProjectCreate, db: AsyncSession = Depends(get_db)):
    """
    Create a new project in the database.
    """
    new_project = Project(**project.dict())
    db.add(new_project)
    await db.commit()
    await db.refresh(new_project)
    return new_project

@app.get("/projects", response_model=List[ProjectOut], summary="List projects", response_description="List of projects")
async def list_projects(db: AsyncSession = Depends(get_db)):
    """
    Retrieve all projects from the database.
    """
    result = await db.execute(Project.__table__.select())
    projects = result.scalars().all()
    return projects

@app.get("/projects/{project_id}", response_model=ProjectOut, summary="Get project by ID", response_description="Project details")
async def get_project(project_id: int, db: AsyncSession = Depends(get_db)):
    """
    Retrieve a project by its ID.
    """
    result = await db.execute(Project.__table__.select().where(Project.id == project_id))
    project = result.scalar()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    return project

@app.put("/projects/{project_id}", response_model=ProjectOut, summary="Update project", response_description="Updated project")
async def update_project(project_id: int, project: ProjectCreate, db: AsyncSession = Depends(get_db)):
    """
    Update an existing project by ID.
    """
    result = await db.execute(Project.__table__.select().where(Project.id == project_id))
    db_project = result.scalar()
    if not db_project:
        raise HTTPException(status_code=404, detail="Project not found")
    for key, value in project.dict().items():
        setattr(db_project, key, value)
    db.add(db_project)
    await db.commit()
    await db.refresh(db_project)
    return db_project

@app.delete("/projects/{project_id}", summary="Delete project", response_description="Delete confirmation")
async def delete_project(project_id: int, db: AsyncSession = Depends(get_db)):
    """
    Delete a project by its ID.
    """
    result = await db.execute(Project.__table__.select().where(Project.id == project_id))
    db_project = result.scalar()
    if not db_project:
        raise HTTPException(status_code=404, detail="Project not found")
    await db.delete(db_project)
    await db.commit()
    return {"detail": "Project deleted"}

# --- Marketplace APIs ---
@app.get("/marketplace/products", response_model=List[ProductOut])
async def marketplace_products(db: AsyncSession = Depends(get_db)):
    result = await db.execute(Product.__table__.select())
    products = result.scalars().all()
    return products

@app.get("/marketplace/projects", response_model=List[ProjectOut])
async def marketplace_projects(db: AsyncSession = Depends(get_db)):
    result = await db.execute(Project.__table__.select())
    projects = result.scalars().all()
    return projects

# --- Payment Status Tracking ---
class PaymentStatus(BaseModel):
    payment_id: str
    status: str
    method: str
    amount: float
    currency: str
    created_at: datetime

payment_status_db = []  # Replace with real DB in production
@app.post("/payments/square")
async def create_square_payment(amount: float):
    idempotency_key = str(uuid.uuid4())
    body = {
        "source_id": "cnon:card-nonce-ok",  # Replace with real card nonce from frontend
        "idempotency_key": idempotency_key,
        "amount_money": {
            "amount": int(amount * 100),
            "currency": "USD"
        },
        "location_id": SQUARE_LOCATION_ID
    }
    result = square_client.payments.create_payment(body)
    if result.is_success():
        return result.body
    else:
        raise HTTPException(status_code=400, detail=str(result.errors))

payment_status_db = []  # Replace with real DB in production
payment_status_db = []  # Replace with real DB in production
# --- Stripe Payment Endpoint ---
class StripePaymentRequest(BaseModel):
    amount: int
    currency: str = "usd"
    source: str
    description: Optional[str] = None

@app.post("/payments/stripe")
async def create_stripe_payment(data: StripePaymentRequest):
    try:
        charge = stripe.Charge.create(
            amount=data.amount,
            currency=data.currency,
            source=data.source,
            description=data.description
        )
        payment_status_db.append(PaymentStatus(
            payment_id=charge.id,
            status=charge.status,
            method="stripe",
            amount=data.amount / 100,
            currency=data.currency,
            created_at=datetime.utcfromtimestamp(charge.created)
        ))
        return {"ok": True, "charge": charge}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

# --- PayPal Payment Endpoint ---
class PayPalPaymentRequest(BaseModel):
    amount: str
    currency: str = "USD"
    description: Optional[str] = None

@app.post("/payments/paypal")
async def create_paypal_payment(data: PayPalPaymentRequest):
    payment = paypalrestsdk.Payment({
        "intent": "sale",
        "payer": {"payment_method": "paypal"},
        "transactions": [{
            "amount": {"total": data.amount, "currency": data.currency},
            "description": data.description or ""
        }],
        "redirect_urls": {
            "return_url": "https://example.com/payment/execute",
            "cancel_url": "https://example.com/payment/cancel"
        }
    })
    if payment.create():
        payment_status_db.append(PaymentStatus(
            payment_id=payment.id,
            status=payment.state,
            method="paypal",
            amount=float(data.amount),
            currency=data.currency,
            created_at=datetime.utcnow()
        ))
        return {"ok": True, "payment": payment.to_dict()}
    else:
        raise HTTPException(status_code=400, detail=payment.error)

# --- Refund Endpoints ---
class RefundRequest(BaseModel):
    payment_id: str
    amount: Optional[int] = None

@app.post("/payments/refund/stripe")
async def refund_stripe_payment(data: RefundRequest):
    try:
        refund = stripe.Refund.create(
            charge=data.payment_id,
            amount=data.amount
        )
        return {"ok": True, "refund": refund}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

# Refund endpoint (PayPal)
@app.post("/payments/refund/paypal")
async def refund_paypal_payment(data: RefundRequest):
    sale = paypalrestsdk.Sale.find(data.payment_id)
    refund = sale.refund({"amount": {"total": str(data.amount), "currency": "USD"}})
    if refund.success():
        return {"ok": True, "refund": refund.to_dict()}
    else:
        raise HTTPException(status_code=400, detail=refund.error)

# --- Subscription Endpoint (Stripe) ---
class SubscriptionRequest(BaseModel):
    customer_id: str
    price_id: str

@app.post("/payments/subscribe/stripe")
async def create_stripe_subscription(data: SubscriptionRequest):
    try:
        subscription = stripe.Subscription.create(
            customer=data.customer_id,
            items=[{"price": data.price_id}]
        )
        return {"ok": True, "subscription": subscription}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

# --- Stripe Webhook Endpoint ---
@app.post("/payments/webhook/stripe")
async def stripe_webhook(request: Request):
    payload = await request.body()
    sig_header = request.headers.get("Stripe-Signature")
    endpoint_secret = os.getenv("STRIPE_WEBHOOK_SECRET", "whsec_...")
    try:
        event = stripe.Webhook.construct_event(
            payload, sig_header, endpoint_secret
        )
        # Handle event types here
        return {"ok": True, "event": event}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

# --- Multi-currency Support (Stripe) ---
@app.get("/payments/currencies")
async def get_supported_currencies():
    try:
        currencies = stripe.CountrySpec.list()
        return {"ok": True, "currencies": currencies}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

# --- Invoice Generation (Stripe) ---
class InvoiceRequest(BaseModel):
    customer_id: str
    amount: int
    currency: str = "usd"
    email: EmailStr

@app.post("/payments/invoice/stripe")
async def create_stripe_invoice(data: InvoiceRequest):
    try:
        invoice_item = stripe.InvoiceItem.create(
            customer=data.customer_id,
            amount=data.amount,
            currency=data.currency,
            description="Custom invoice"
        )
        invoice = stripe.Invoice.create(
            customer=data.customer_id,
            auto_advance=True
        )
        stripe.Invoice.send_invoice(invoice.id)
        # Email sending logic here (use SendGrid, SMTP, etc.)
        return {"ok": True, "invoice": invoice}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
