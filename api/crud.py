from sqlalchemy.orm import Session
from .models import *
from .schemas import *
from .auth import get_password_hash
from typing import List, Optional

# User CRUD operations
def get_user_by_email(db: Session, email: str):
    return db.query(User).filter(User.email == email).first()

def get_user_by_id(db: Session, user_id: int):
    return db.query(User).filter(User.id == user_id).first()

def create_user(db: Session, user: UserCreate):
    hashed_password = get_password_hash(user.password)
    db_user = User(
        email=user.email,
        password_hash=hashed_password,
        first_name=user.first_name,
        last_name=user.last_name,
        role=user.role
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

# Page Content CRUD operations
def get_page_content_by_name(db: Session, page_name: str):
    return db.query(PageContent).filter(
        PageContent.page_name == page_name, 
        PageContent.is_published == True
    ).first()

def get_all_page_content(db: Session, skip: int = 0, limit: int = 100):
    return db.query(PageContent).offset(skip).limit(limit).all()

def create_page_content(db: Session, content: PageContentCreate):
    db_content = PageContent(**content.dict())
    db.add(db_content)
    db.commit()
    db.refresh(db_content)
    return db_content

def update_page_content(db: Session, content_id: int, content_update: PageContentUpdate):
    db_content = db.query(PageContent).filter(PageContent.id == content_id).first()
    if db_content:
        update_data = content_update.dict(exclude_unset=True)
        for field, value in update_data.items():
            setattr(db_content, field, value)
        db.commit()
        db.refresh(db_content)
    return db_content

def delete_page_content(db: Session, content_id: int):
    db_content = db.query(PageContent).filter(PageContent.id == content_id).first()
    if db_content:
        db.delete(db_content)
        db.commit()
        return True
    return False

# Product CRUD operations
def get_all_products(db: Session, skip: int = 0, limit: int = 100):
    return db.query(Product).filter(Product.is_active == True).order_by(Product.sort_order).offset(skip).limit(limit).all()

def get_product_by_id(db: Session, product_id: int):
    return db.query(Product).filter(Product.id == product_id, Product.is_active == True).first()

def create_product(db: Session, product: ProductCreate):
    db_product = Product(**product.dict())
    db.add(db_product)
    db.commit()
    db.refresh(db_product)
    return db_product

def update_product(db: Session, product_id: int, product_update: ProductUpdate):
    db_product = db.query(Product).filter(Product.id == product_id).first()
    if db_product:
        update_data = product_update.dict(exclude_unset=True)
        for field, value in update_data.items():
            setattr(db_product, field, value)
        db.commit()
        db.refresh(db_product)
    return db_product

def delete_product(db: Session, product_id: int):
    db_product = db.query(Product).filter(Product.id == product_id).first()
    if db_product:
        db.delete(db_product)
        db.commit()
        return True
    return False

# Contact Submission CRUD operations
def create_contact_submission(db: Session, contact: ContactSubmissionCreate):
    db_contact = ContactSubmission(**contact.dict())
    db.add(db_contact)
    db.commit()
    db.refresh(db_contact)
    return db_contact

def get_all_contact_submissions(db: Session, skip: int = 0, limit: int = 100):
    return db.query(ContactSubmission).order_by(ContactSubmission.created_at.desc()).offset(skip).limit(limit).all()

def mark_contact_as_read(db: Session, contact_id: int):
    db_contact = db.query(ContactSubmission).filter(ContactSubmission.id == contact_id).first()
    if db_contact:
        db_contact.is_read = True
        db.commit()
        db.refresh(db_contact)
    return db_contact

# Application Case CRUD operations
def get_all_application_cases(db: Session, skip: int = 0, limit: int = 100):
    return db.query(ApplicationCase).filter(ApplicationCase.is_active == True).order_by(ApplicationCase.sort_order).offset(skip).limit(limit).all()

def get_application_case_by_id(db: Session, case_id: int):
    return db.query(ApplicationCase).filter(ApplicationCase.id == case_id, ApplicationCase.is_active == True).first()

def create_application_case(db: Session, case: ApplicationCaseCreate):
    db_case = ApplicationCase(**case.dict())
    db.add(db_case)
    db.commit()
    db.refresh(db_case)
    return db_case

def update_application_case(db: Session, case_id: int, case_update: ApplicationCaseUpdate):
    db_case = db.query(ApplicationCase).filter(ApplicationCase.id == case_id).first()
    if db_case:
        update_data = case_update.dict(exclude_unset=True)
        for field, value in update_data.items():
            setattr(db_case, field, value)
        db.commit()
        db.refresh(db_case)
    return db_case

def delete_application_case(db: Session, case_id: int):
    db_case = db.query(ApplicationCase).filter(ApplicationCase.id == case_id).first()
    if db_case:
        db.delete(db_case)
        db.commit()
        return True
    return False
