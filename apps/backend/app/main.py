from fastapi import FastAPI, Depends, HTTPException, status, Request
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

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
SECRET_KEY = "your-secret-key"
ALGORITHM = "HS256"

app = FastAPI()

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

def get_password_hash(password):
    return pwd_context.hash(password)

def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

def create_access_token(data: dict):
    return jwt.encode(data, SECRET_KEY, algorithm=ALGORITHM)

async def get_db():
    async with SessionLocal() as session:
        yield session

# User Endpoints
@app.post("/register", response_model=UserOut)
async def register(user: UserCreate, db: AsyncSession = Depends(get_db)):
    db_user = await db.execute(
        User.__table__.select().where(User.username == user.username)
    )
    if db_user.scalar():
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
    new_product = Product(**product.dict())
    db.add(new_product)
    await db.commit()
    await db.refresh(new_product)
    return new_product

@app.get("/products", response_model=List[ProductOut])
async def list_products(db: AsyncSession = Depends(get_db)):
    result = await db.execute(Product.__table__.select())
    products = result.scalars().all()
    return products

@app.get("/products/{product_id}", response_model=ProductOut)
async def get_product(product_id: int, db: AsyncSession = Depends(get_db)):
    result = await db.execute(Product.__table__.select().where(Product.id == product_id))
    product = result.scalar()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    return product

@app.put("/products/{product_id}", response_model=ProductOut)
async def update_product(product_id: int, product: ProductCreate, db: AsyncSession = Depends(get_db)):
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

@app.delete("/products/{product_id}")
async def delete_product(product_id: int, db: AsyncSession = Depends(get_db)):
    result = await db.execute(Product.__table__.select().where(Product.id == product_id))
    db_product = result.scalar()
    if not db_product:
        raise HTTPException(status_code=404, detail="Product not found")
    await db.delete(db_product)
    await db.commit()
    return {"detail": "Product deleted"}

# Project CRUD Endpoints
@app.post("/projects", response_model=ProjectOut)
async def create_project(project: ProjectCreate, db: AsyncSession = Depends(get_db)):
    new_project = Project(**project.dict())
    db.add(new_project)
    await db.commit()
    await db.refresh(new_project)
    return new_project

@app.get("/projects", response_model=List[ProjectOut])
async def list_projects(db: AsyncSession = Depends(get_db)):
    result = await db.execute(Project.__table__.select())
    projects = result.scalars().all()
    return projects

@app.get("/projects/{project_id}", response_model=ProjectOut)
async def get_project(project_id: int, db: AsyncSession = Depends(get_db)):
    result = await db.execute(Project.__table__.select().where(Project.id == project_id))
    project = result.scalar()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    return project

@app.put("/projects/{project_id}", response_model=ProjectOut)
async def update_project(project_id: int, project: ProjectCreate, db: AsyncSession = Depends(get_db)):
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

@app.delete("/projects/{project_id}")
async def delete_project(project_id: int, db: AsyncSession = Depends(get_db)):
    result = await db.execute(Project.__table__.select().where(Project.id == project_id))
    db_project = result.scalar()
    if not db_project:
        raise HTTPException(status_code=404, detail="Project not found")
    await db.delete(db_project)
    await db.commit()
    return {"detail": "Project deleted"}

# Marketplace APIs
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

# Square Payment Endpoint
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

# Payment status tracking
class PaymentStatus(BaseModel):
    payment_id: str
    status: str
    method: str
    amount: float
    currency: str
    created_at: datetime

payment_status_db = []  # Replace with real DB in production

# Stripe payment endpoint
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

# PayPal payment endpoint
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

# Refund endpoint (Stripe)
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

# Subscription endpoint (Stripe)
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

# Webhook endpoint (Stripe)
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

# Multi-currency support (Stripe)
@app.get("/payments/currencies")
async def get_supported_currencies():
    try:
        currencies = stripe.CountrySpec.list()
        return {"ok": True, "currencies": currencies}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

# Invoice generation (Stripe)
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

# Admin dashboard endpoints
@app.get("/admin/payments")
async def get_all_payments():
    return {"ok": True, "payments": [p.dict() for p in payment_status_db]}

@app.get("/admin/payments/analytics")
async def get_payment_analytics():
    total = sum(p.amount for p in payment_status_db)
    count = len(payment_status_db)
    by_method = {}
    for p in payment_status_db:
        by_method.setdefault(p.method, 0)
        by_method[p.method] += p.amount
    return {"ok": True, "total": total, "count": count, "by_method": by_method}

@app.get("/")
def root():
    return {"ok": True}
