from fastapi import FastAPI, HTTPException, Depends, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session
from typing import List, Optional
import os
from dotenv import load_dotenv

# Import local modules
from .database import get_db, init_db
from .models import *
from .schemas import *
from .crud import *
from .auth import verify_token, create_access_token, verify_password, get_password_hash

# Load environment variables
load_dotenv()

# Initialize database tables on startup
init_db()

app = FastAPI(
    title="ASATEC API",
    description="Backend API for ASATEC Website - Serverless Edition",
    version="1.0.0",
    docs_url="/api/docs",
    redoc_url="/api/redoc",
    openapi_url="/api/openapi.json"
)

# CORS middleware - Configure for your domains
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://localhost:3001", 
        "https://your-domain.vercel.app",
        "https://your-domain.com",
        "*"  # Remove in production
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

security = HTTPBearer()

# Dependency to get current user
async def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security), 
    db: Session = Depends(get_db)
):
    token = credentials.credentials
    payload = verify_token(token)
    if payload is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authentication credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )
    user = get_user_by_email(db, payload.get("sub"))
    if user is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not found"
        )
    return user

# Health check endpoint
@app.get("/api/health")
async def health_check():
    return {"status": "healthy", "service": "ASATEC API"}

# Auth endpoints
@app.post("/api/auth/login", response_model=TokenResponse)
async def login(user_credentials: UserLogin, db: Session = Depends(get_db)):
    user = get_user_by_email(db, user_credentials.email)
    if not user or not verify_password(user_credentials.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password"
        )
    access_token = create_access_token(data={"sub": user.email})
    return {"access_token": access_token, "token_type": "bearer"}

@app.get("/api/auth/me", response_model=UserResponse)
async def get_current_user_info(current_user: User = Depends(get_current_user)):
    return current_user

# Public endpoints
@app.get("/api/content/{page_name}", response_model=PageContentResponse)
async def get_page_content(page_name: str, db: Session = Depends(get_db)):
    content = get_page_content_by_name(db, page_name)
    if not content:
        raise HTTPException(status_code=404, detail="Page content not found")
    return content

@app.get("/api/products", response_model=List[ProductResponse])
async def get_products(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return get_all_products(db, skip=skip, limit=limit)

@app.get("/api/products/{product_id}", response_model=ProductResponse)
async def get_product(product_id: int, db: Session = Depends(get_db)):
    product = get_product_by_id(db, product_id)
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    return product

@app.get("/api/cases", response_model=List[ApplicationCaseResponse])
async def get_application_cases(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return get_all_application_cases(db, skip=skip, limit=limit)

@app.post("/api/contact", response_model=ContactSubmissionResponse)
async def submit_contact(contact_data: ContactSubmissionCreate, db: Session = Depends(get_db)):
    return create_contact_submission(db, contact_data)

# Admin endpoints (require authentication)
@app.get("/api/admin/content", response_model=List[PageContentResponse])
async def get_all_content(
    current_user: User = Depends(get_current_user), 
    db: Session = Depends(get_db)
):
    return get_all_page_content(db)

@app.post("/api/admin/content", response_model=PageContentResponse)
async def create_content(
    content_data: PageContentCreate, 
    current_user: User = Depends(get_current_user), 
    db: Session = Depends(get_db)
):
    return create_page_content(db, content_data)

@app.put("/api/admin/content/{content_id}", response_model=PageContentResponse)
async def update_content(
    content_id: int, 
    content_data: PageContentUpdate, 
    current_user: User = Depends(get_current_user), 
    db: Session = Depends(get_db)
):
    content = update_page_content(db, content_id, content_data)
    if not content:
        raise HTTPException(status_code=404, detail="Content not found")
    return content

@app.delete("/api/admin/content/{content_id}")
async def delete_content(
    content_id: int, 
    current_user: User = Depends(get_current_user), 
    db: Session = Depends(get_db)
):
    success = delete_page_content(db, content_id)
    if not success:
        raise HTTPException(status_code=404, detail="Content not found")
    return {"message": "Content deleted successfully"}

@app.get("/api/admin/contacts", response_model=List[ContactSubmissionResponse])
async def get_all_contacts(
    current_user: User = Depends(get_current_user), 
    db: Session = Depends(get_db)
):
    return get_all_contact_submissions(db)

@app.get("/api/admin/products", response_model=List[ProductResponse])
async def admin_get_products(
    current_user: User = Depends(get_current_user), 
    db: Session = Depends(get_db)
):
    return get_all_products(db)

@app.post("/api/admin/products", response_model=ProductResponse)
async def create_product(
    product_data: ProductCreate, 
    current_user: User = Depends(get_current_user), 
    db: Session = Depends(get_db)
):
    return create_product(db, product_data)

@app.put("/api/admin/products/{product_id}", response_model=ProductResponse)
async def update_product(
    product_id: int, 
    product_data: ProductUpdate, 
    current_user: User = Depends(get_current_user), 
    db: Session = Depends(get_db)
):
    product = update_product(db, product_id, product_data)
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    return product

@app.delete("/api/admin/products/{product_id}")
async def delete_product(
    product_id: int, 
    current_user: User = Depends(get_current_user), 
    db: Session = Depends(get_db)
):
    success = delete_product(db, product_id)
    if not success:
        raise HTTPException(status_code=404, detail="Product not found")
    return {"message": "Product deleted successfully"}

@app.get("/api/admin/cases", response_model=List[ApplicationCaseResponse])
async def admin_get_cases(
    current_user: User = Depends(get_current_user), 
    db: Session = Depends(get_db)
):
    return get_all_application_cases(db)

@app.post("/api/admin/cases", response_model=ApplicationCaseResponse)
async def create_case(
    case_data: ApplicationCaseCreate, 
    current_user: User = Depends(get_current_user), 
    db: Session = Depends(get_db)
):
    return create_application_case(db, case_data)

@app.put("/api/admin/cases/{case_id}", response_model=ApplicationCaseResponse)
async def update_case(
    case_id: int, 
    case_data: ApplicationCaseUpdate, 
    current_user: User = Depends(get_current_user), 
    db: Session = Depends(get_db)
):
    case = update_application_case(db, case_id, case_data)
    if not case:
        raise HTTPException(status_code=404, detail="Application case not found")
    return case

@app.delete("/api/admin/cases/{case_id}")
async def delete_case(
    case_id: int, 
    current_user: User = Depends(get_current_user), 
    db: Session = Depends(get_db)
):
    success = delete_application_case(db, case_id)
    if not success:
        raise HTTPException(status_code=404, detail="Application case not found")
    return {"message": "Application case deleted successfully"}

# For Vercel deployment
handler = app
