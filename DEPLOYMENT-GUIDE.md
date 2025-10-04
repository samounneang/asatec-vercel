# Step-by-Step Deployment Guide

## 🚀 Complete Setup: Neon + Vercel Deployment

Follow these steps exactly to deploy your ASATEC website.

---

## Phase 1: Database Setup (Neon)

### Step 1: Create Neon Account
1. 🌐 Go to **[neon.tech](https://neon.tech)**
2. 🔗 Click **"Sign up with GitHub"** (recommended)
3. ✅ Complete the signup process

### Step 2: Create Your Database
1. 🆕 Click **"Create Project"**
2. ⚙️ Configure your project:
   - **Project Name**: `asatec-website`
   - **Database Name**: `asatec_db`
   - **Region**: Choose closest to your users
   - **PostgreSQL Version**: `15` (recommended)
3. 🐈 Click **"Create Project"**

### Step 3: Get Database Connection String
1. 📋 In your Neon dashboard, find **"Connection Details"**
2. 📋 Copy the **"Connection String"** (starts with `postgresql://`)
3. 📎 **SAVE THIS** - you'll need it in Step 8!

**Example connection string:**
```
postgresql://username:password@ep-example-123456.us-east-1.neon.tech/asatec_db
```

---

## Phase 2: Code Repository (GitHub)

### Step 4: Upload to GitHub
1. 🆕 Create new repository on **[github.com](https://github.com)**
   - Name: `asatec-website`
   - Public or Private (your choice)
   - Don't initialize with README

2. 💻 In your local project folder, run:
   ```bash
   git init
   git add .
   git commit -m "Initial ASATEC website"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/asatec-website.git
   git push -u origin main
   ```

3. ✅ Verify files are uploaded to GitHub

---

## Phase 3: Deployment (Vercel)

### Step 5: Create Vercel Account
1. 🌐 Go to **[vercel.com](https://vercel.com)**
2. 🔗 Click **"Sign up with GitHub"**
3. ✅ Authorize Vercel to access your repositories

### Step 6: Import Your Project
1. 📋 Click **"New Project"** in Vercel dashboard
2. 🔍 Find your `asatec-website` repository
3. 📋 Click **"Import"**

### Step 7: Configure Project Settings
**Keep these default settings:**
- **Framework Preset**: `Other`
- **Root Directory**: `./`
- **Build Command**: (leave empty)
- **Output Directory**: (leave empty)

📋 Click **"Deploy"** (but it will fail - that's expected!)

### Step 8: Add Environment Variables
1. ⚙️ In Vercel, go to **Project Settings** > **Environment Variables**
2. ➕ Add these variables:

   **DATABASE_URL**
   ```
   postgresql://your_actual_neon_connection_string_here
   ```
   *(Use the string you saved in Step 3)*

   **SECRET_KEY**
   ```
   your_super_secret_key_here
   ```
   *(Generate one: run `openssl rand -base64 64` in terminal)*

   **ALGORITHM**
   ```
   HS256
   ```

   **ACCESS_TOKEN_EXPIRE_MINUTES**
   ```
   30
   ```

3. ✅ Save all variables

### Step 9: Redeploy
1. 🔄 Go to **Deployments** tab
2. 📋 Click the **3 dots** on the latest deployment
3. 📋 Click **"Redeploy"**
4. ⏳ Wait for deployment to complete (2-3 minutes)

---

## Phase 4: Testing & Access

### Step 10: Access Your Website
Your website is now live! 🎉

**URLs** (replace `your-project` with your actual Vercel project name):
- 🌐 **Main Website**: `https://your-project.vercel.app`
- 🔧 **Admin Panel**: `https://your-project.vercel.app/admin`
- 📊 **API Docs**: `https://your-project.vercel.app/api/docs`

### Step 11: Test Admin Login
1. 🔗 Go to your admin panel URL
2. 🔐 Login with:
   - **Email**: `admin@asatec.com`
   - **Password**: `admin123`
3. ✅ Verify you can access the dashboard

### Step 12: Test Contact Form
1. 🔗 Go to your main website
2. 📝 Fill out the contact form
3. 📋 Check admin panel > Contacts to see the submission

---

## Phase 5: Customization

### Step 13: Update Website Content
1. 🔐 Login to admin panel
2. 📝 Update:
   - Page content (Home, About, Services)
   - Products/services
   - Application cases
3. 👁️ Preview changes on main website

### Step 14: Custom Domain (Optional)
1. ⚙️ In Vercel project settings > **Domains**
2. ➕ Add your domain (e.g., `asatec.com`)
3. 🔧 Configure DNS records as shown
4. ⏳ Wait for DNS propagation (up to 48 hours)

---

## 🎆 Congratulations!

Your ASATEC website is now live on a modern, scalable infrastructure:

✅ **Database**: Neon PostgreSQL (serverless, auto-scaling)  
✅ **Hosting**: Vercel (global CDN, automatic HTTPS)  
✅ **API**: FastAPI (fast, modern, auto-documented)  
✅ **Admin**: Full content management system  
✅ **Cost**: $0/month to start (free tiers)  

---

## 🔧 Quick Commands Reference

**Local Development:**
```bash
# Start local development
npm run dev

# Deploy to production
npm run deploy
```

**Database Management:**
- 📋 Use Neon Console for database management
- 📁 Access via: `https://console.neon.tech`

**Monitoring:**
- 📈 Vercel Analytics: Project Settings > Analytics
- 🔍 Function Logs: Vercel Dashboard > Functions

---

## ❓ Need Help?

**Common Issues:**
1. **500 Error**: Check environment variables are set correctly
2. **Database Error**: Verify Neon connection string
3. **Admin Won't Load**: Check browser console for errors

**Support:**
- 📚 Documentation: Check README.md
- 🐛 Issues: Create GitHub issue
- 💬 Community: Vercel/Neon Discord servers
