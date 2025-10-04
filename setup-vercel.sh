#!/bin/bash

# ASATEC Website - Vercel Deployment Setup Script
# This script helps you set up and deploy your website to Vercel with Neon database

set -e

echo "🚀 ASATEC Website - Vercel + Neon Setup"
echo "======================================"
echo ""

# Check if required tools are installed
check_dependencies() {
    echo "🔍 Checking dependencies..."
    
    # Check Node.js
    if ! command -v node &> /dev/null; then
        echo "❌ Node.js is not installed. Please install Node.js 18+ from https://nodejs.org"
        exit 1
    fi
    
    NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
    if [ "$NODE_VERSION" -lt 18 ]; then
        echo "❌ Node.js version 18+ is required. Current version: $(node -v)"
        exit 1
    fi
    
    # Check npm
    if ! command -v npm &> /dev/null; then
        echo "❌ npm is not installed. Please install npm"
        exit 1
    fi
    
    # Check git
    if ! command -v git &> /dev/null; then
        echo "❌ Git is not installed. Please install Git"
        exit 1
    fi
    
    echo "✅ All dependencies are installed"
}

# Install project dependencies
install_dependencies() {
    echo "📦 Installing project dependencies..."
    npm install
    echo "✅ Dependencies installed"
}

# Install Vercel CLI
install_vercel_cli() {
    echo "🔧 Installing Vercel CLI..."
    if ! command -v vercel &> /dev/null; then
        npm install -g vercel
        echo "✅ Vercel CLI installed"
    else
        echo "✅ Vercel CLI already installed"
    fi
}

# Setup environment file
setup_environment() {
    echo "⚙️  Setting up environment file..."
    
    if [ ! -f ".env" ]; then
        cp .env.example .env
        echo "📝 Created .env file from template"
        echo ""
        echo "⚠️  IMPORTANT: Please update the .env file with your actual values:"
        echo "   1. DATABASE_URL - Your Neon database connection string"
        echo "   2. SECRET_KEY - Generate a secure secret key"
        echo ""
        echo "💡 To generate a secret key, run: openssl rand -base64 64"
        echo ""
    else
        echo "✅ .env file already exists"
    fi
}

# Login to Vercel
vercel_login() {
    echo "🔐 Logging into Vercel..."
    vercel login
    echo "✅ Logged into Vercel"
}

# Deploy to Vercel
deploy_to_vercel() {
    echo "🚀 Deploying to Vercel..."
    echo ""
    echo "📋 Deployment checklist:"
    echo "   ✅ Dependencies installed"
    echo "   ✅ Vercel CLI ready"
    echo "   ✅ Environment configured"
    echo ""
    echo "🔄 Starting deployment..."
    
    # First deployment
    vercel --prod
    
    echo ""
    echo "🎉 Deployment completed!"
    echo ""
    echo "📋 Next steps:"
    echo "   1. Set up your Neon database (see README.md)"
    echo "   2. Configure environment variables in Vercel dashboard"
    echo "   3. Redeploy after setting up database"
    echo ""
}

# Main setup flow
main() {
    echo "This script will help you deploy your ASATEC website to Vercel."
    echo ""
    
    # Check if user wants to continue
    read -p "Do you want to continue? (y/N): " -n 1 -r
    echo ""
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo "Setup cancelled."
        exit 0
    fi
    
    echo ""
    check_dependencies
    echo ""
    install_dependencies
    echo ""
    install_vercel_cli
    echo ""
    setup_environment
    echo ""
    
    # Ask about Vercel login
    read -p "Do you want to login to Vercel and deploy now? (y/N): " -n 1 -r
    echo ""
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        echo ""
        vercel_login
        echo ""
        deploy_to_vercel
    else
        echo ""
        echo "⏭️  Skipping deployment. To deploy later, run: npm run deploy"
        echo ""
        echo "📚 Don't forget to:"
        echo "   1. Set up your Neon database"
        echo "   2. Update the .env file with your database URL"
        echo "   3. Run 'npm run deploy' when ready"
    fi
    
    echo ""
    echo "🎯 Setup complete! Check README.md for detailed instructions."
}

# Run main function
main
