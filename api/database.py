from sqlalchemy import create_engine, Column, Integer, String, Text, DateTime, Boolean
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import NullPool
import os
from dotenv import load_dotenv

load_dotenv()

# Neon database URL - optimized for serverless
DATABASE_URL = os.getenv("DATABASE_URL")

if not DATABASE_URL:
    raise ValueError("DATABASE_URL environment variable is required")

# Configure engine for serverless environment (Neon)
engine = create_engine(
    DATABASE_URL,
    poolclass=NullPool,  # Disable connection pooling for serverless
    pool_pre_ping=True,  # Verify connections before use
    pool_recycle=300,    # Recycle connections every 5 minutes
    echo=False
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

# Dependency to get database session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Initialize database tables
def init_db():
    try:
        Base.metadata.create_all(bind=engine)
        
        # Create default admin user if not exists
        from .models import User
        from .auth import get_password_hash
        
        db = SessionLocal()
        try:
            admin_email = os.getenv("ADMIN_EMAIL")
            admin_password = os.getenv("ADMIN_PASSWORD")
            if not admin_email or not admin_password:
                print("Warning: ADMIN_EMAIL or ADMIN_PASSWORD environment variables are not set. Default admin user will not be created.")
            else:
                existing_admin = db.query(User).filter(User.email == admin_email).first()
                if not existing_admin:
                    admin_user = User(
                        email=admin_email,
                        password_hash=get_password_hash(admin_password),
                        first_name="Admin",
                        last_name="User",
                        role="admin"
                    )
                    db.add(admin_user)
                    db.commit()
        import logging
        logging.error("Database initialization error", exc_info=True)
        # In production, you might want to handle this differently
        pass
            
    except Exception as e:
        print(f"Database initialization error: {e}")
        # In production, you might want to handle this differently
        pass
