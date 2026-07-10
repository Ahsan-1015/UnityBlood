# 🌐 UnityBlood - Complete Deployment Guide

## 📋 Prerequisites

Before starting, make sure you have:
- **GitHub account** (code repository)
- **Vercel account** (free: vercel.com) - for frontend OR backend
- **Render account** (free: render.com) - alternative for backend
- **MongoDB Atlas account** (free: mongodb.com/atlas)
- **Firebase account** (free: firebase.google.com) - for Authentication
- **Stripe account** (free: stripe.com) - for payments
- **Node.js** installed locally (v18 or higher)

---

## 🔧 PART 1: Environment Variables Setup

### Step 1.1: Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click **Add project** → Name it (e.g., "unity-blood")
3. Go to **Project Settings** → **General** → **Your apps** → **Web app**
4. Register a web app and copy the Firebase config values

### Step 1.2: Enable Firebase Authentication

1. In Firebase Console, go to **Authentication** → **Sign-in method**
2. Enable **Email/Password** sign-in provider

### Step 1.3: Create MongoDB Atlas Cluster

1. Go to [MongoDB Atlas](https://cloud.mongodb.com/)
2. Create a **Free M0 cluster**
3. Create a **Database User** (username + password) - save these!
4. Go to **Network Access** → **Add IP Address** → Click **Allow Access from Anywhere** (`0.0.0.0/0`)
5. Click **Connect** → **Connect your application** → Copy the connection string
   - It looks like: `mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/`

### Step 1.4: Get Stripe Keys

1. Go to [Stripe Dashboard](https://dashboard.stripe.com/)
2. Toggle **Test mode** (for development)
3. Go to **Developers** → **API keys**
4. Copy your **Secret key** (starts with `sk_test_`)

### Step 1.5: Generate JWT Secret

Run this command in your terminal to generate a random secret:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```
Copy the output - this is your `ACCESS_TOKEN_SECRET`.

---

## 🖥️ PART 2: Frontend Deployment (Vercel)

### Step 2.1: Prepare Frontend Environment Variables

Create a `.env` file in the `Client/` folder with your actual values:
```env
# Firebase Configuration
VITE_apiKey=AIzaSyXXXXXXXXXXXXXXXXXXXX
VITE_authDomain=your-project.firebaseapp.com
VITE_projectId=your-project-id
VITE_storageBucket=your-project.appspot.com
VITE_messagingSenderId=123456789012
VITE_appId=1:123456789012:web:xxxxxxxxx

# Backend API URL - UPDATE THIS AFTER DEPLOYING BACKEND
VITE_API_BASE_URL=https://unity-blood-server.vercel.app/
```

### Step 2.2: Push Code to GitHub

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/UnityBlood.git
git push -u origin main
```
> ⚠️ Make sure `.env` files are in `.gitignore` so secrets aren't committed!

### Step 2.3: Deploy Frontend to Vercel

1. Go to [Vercel Dashboard](https://vercel.com/)
2. Click **Add New** → **Project**
3. Import your **GitHub repository**
4. Configure the project:

   | Setting | Value |
   |---------|-------|
   | **Framework Preset** | Vite |
   | **Root Directory** | `Client` |
   | **Build Command** | `npm run build` |
   | **Output Directory** | `dist` |

5. Click **Environment Variables** and add these:

   | Name | Value |
   |------|-------|
   | `VITE_apiKey` | Your Firebase API key |
   | `VITE_authDomain` | Your Firebase auth domain |
   | `VITE_projectId` | Your Firebase project ID |
   | `VITE_storageBucket` | Your Firebase storage bucket |
   | `VITE_messagingSenderId` | Your Firebase sender ID |
   | `VITE_appId` | Your Firebase app ID |
   | `VITE_API_BASE_URL` | `https://unity-blood-server.vercel.app/` (update after backend deploy) |

6. Click **Deploy** ✅

> **Your frontend will be live at:** `https://unity-blood.vercel.app/` (or similar)

---

## 🖥️ PART 3: Backend Deployment Options

Choose **ONE** of the following options:

---

### OPTION A: Deploy Backend on Vercel (Recommended)

#### Step 3A.1: Server already has vercel.json ✅
The file `Server/vercel.json` is already configured.

#### Step 3A.2: Deploy to Vercel

1. Go to [Vercel Dashboard](https://vercel.com/)
2. Click **Add New** → **Project**
3. Import the same GitHub repository
4. Configure:

   | Setting | Value |
   |---------|-------|
   | **Framework Preset** | Other |
   | **Root Directory** | `Server` |
   | **Build Command** | `npm install` |
   | **Output Directory** | (leave empty) |

5. Click **Environment Variables** and add:

   | Name | Value |
   |------|-------|
   | `DB_USER` | Your MongoDB username |
   | `DB_PASS` | Your MongoDB password |
   | `ACCESS_TOKEN_SECRET` | Your JWT secret (generated earlier) |
   | `STRIPE_SECRET_KEY` | Your Stripe secret key |
   | `ALLOWED_ORIGINS` | `https://your-frontend.vercel.app` |

   > ⚠️ For `ALLOWED_ORIGINS`, add the URL of your Vercel frontend (from Part 2). If you're also running locally, add `http://localhost:5173`.

6. Click **Deploy** ✅

#### Step 3A.3: Update Frontend with Backend URL

After deployment:
1. Copy your backend URL: `https://unity-blood-server.vercel.app`
2. Go to Vercel Dashboard → Frontend project → **Settings** → **Environment Variables**
3. Update `VITE_API_BASE_URL` to your backend URL
4. Go to **Deployments** → find latest → click **Redeploy**
5. The frontend will rebuild with the correct API URL ✅

---

### OPTION B: Deploy Backend on Render (Alternative)

#### Step 3B.1: `Server/render.yaml` is already created ✅

#### Step 3B.2: Deploy to Render

1. Go to [Render Dashboard](https://dashboard.render.com/)
2. Click **New** → **Web Service**
3. Connect your GitHub repository
4. Configure:

   | Setting | Value |
   |---------|-------|
   | **Name** | `unity-blood-server` |
   | **Root Directory** | `Server` |
   | **Runtime** | Node |
   | **Build Command** | `npm install` |
   | **Start Command** | `node index.js` |
   | **Instance Type** | Free |

5. Click **Advanced** → **Add Environment Variables**:

   | Name | Value |
   |------|-------|
   | `DB_USER` | Your MongoDB username |
   | `DB_PASS` | Your MongoDB password |
   | `ACCESS_TOKEN_SECRET` | Your JWT secret |
   | `STRIPE_SECRET_KEY` | Your Stripe secret key |
   | `ALLOWED_ORIGINS` | `https://your-frontend.vercel.app` |

6. Click **Create Web Service** ✅
7. Wait 2-5 minutes for deployment
8. Your backend URL will be: `https://unity-blood-server.onrender.com`

#### Step 3B.3: Update Frontend

1. Copy your Render backend URL
2. Go to Vercel Dashboard → Frontend project → **Settings** → **Environment Variables**
3. Update `VITE_API_BASE_URL` to `https://unity-blood-server.onrender.com/`
4. Go to **Deployments** → **Redeploy** the frontend ✅

---

## 🗄️ PART 4: MongoDB Database Setup

### Step 4.1: Create Database Collections

Once your backend is deployed and running, MongoDB collections will be created automatically when you first use the app. But you can also create them manually in MongoDB Atlas:

1. Go to **MongoDB Atlas** → **Browse Collections**
2. Click **Create Database** → name: `unity_blood`
3. Inside it, you'll need these collections:
   - `users`
   - `DonationRequests`
   - `blogs`
   - `payments`

### Step 4.2: Create Admin User (Optional)

You can create an admin user by directly inserting into MongoDB Atlas:

1. Go to **MongoDB Atlas** → **Collections** → `unity_blood.users`
2. Click **Insert Document**
3. Add a document like:
```json
{
  "email": "your-email@example.com",
  "name": "Admin",
  "role": "Admin",
  "status": "Active",
  "createdAt": { "$date": "2024-01-01T00:00:00Z" }
}
```

---

## 🔥 PART 5: Firebase Hosting (Alternative to Vercel for Frontend)

If you prefer Firebase Hosting over Vercel:

### Step 5.1: Install Firebase CLI
```bash
npm install -g firebase-tools
```

### Step 5.2: Login to Firebase
```bash
firebase login
```

### Step 5.3: Build the Frontend
```bash
cd Client
npm install
npm run build
```

### Step 5.4: Initialize Firebase Hosting
```bash
firebase init hosting
```
- Select your Firebase project
- Set `dist` as the public directory
- Configure as a **single-page app**: Yes
- Don't overwrite `index.html`

### Step 5.5: Deploy to Firebase
```bash
firebase deploy --only hosting
```

**Your Firebase URL:** `https://your-project-id.web.app`

---

## ✅ PART 6: Post-Deployment Verification

### Step 6.1: Test the Backend
Visit your backend URL in a browser:
- `https://unity-blood-server.vercel.app/` (or `.onrender.com`)
- You should see: `"unity_blood server is running to"`

### Step 6.2: Test the Frontend
Visit your frontend URL:
- `https://unity-blood.vercel.app/`
- The homepage should load
- Try navigating to different pages

### Step 6.3: Test Registration & Login
1. Go to `/registration` → Create a new account
2. Check Firebase Console → Authentication → Users (should show new user)
3. Check MongoDB Atlas → `unity_blood.users` collection (should show user)

### Step 6.4: Test Donation Request
1. Login → Go to Dashboard → Create Donation Request
2. Fill in the form → Submit
3. Check MongoDB → `DonationRequests` collection for the new document

---

## 🛠️ PART 7: Troubleshooting

### CORS Errors
If you see CORS errors in the browser console:
1. Make sure `VITE_API_BASE_URL` in frontend matches the exact backend URL
2. Check that `ALLOWED_ORIGINS` environment variable on backend includes your frontend URL
3. Wait a few minutes for environment variables to take effect (redeploy both services)

### 404 on Page Refresh (Vercel)
The `vercel.json` file in `Client/` handles this with rewrites:
```json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
}
```

### MongoDB Connection Issues
1. Check that IP whitelist in MongoDB Atlas includes `0.0.0.0/0`
2. Verify `DB_USER` and `DB_PASS` are correct
3. Make sure password doesn't contain special characters that need encoding

### "Cannot find module" errors on Vercel/Render
- Make sure `npm install` ran successfully
- Check that all dependencies in `package.json` are correct
- For Render, verify the **Root Directory** is set to `Server`

---

## 📊 Architecture Summary

```
                    ┌─────────────────────────┐
                    │   Firebase Auth         │
                    │   (Authentication)      │
                    └──────────┬──────────────┘
                               │
┌──────────────┐    ┌──────────▼──────────────┐    ┌─────────────────┐
│   Frontend   │    │   Backend (Express)     │    │   MongoDB Atlas │
│   (Vercel)   │◄──►│   (Vercel or Render)   │◄──►│   (Database)    │
│   React/Vite │    │   /api/*                │    │   unity_blood   │
└──────────────┘    └──────────┬──────────────┘    └─────────────────┘
                               │
                    ┌──────────▼──────────────┐
                    │   Stripe API            │
                    │   (Payments)            │
                    └─────────────────────────┘
```

---

## 📝 Quick Reference: All Required Environment Variables

### Frontend (`Client/.env`)
| Variable | Where to Get It |
|----------|----------------|
| `VITE_apiKey` | Firebase Console → Project Settings → Web App |
| `VITE_authDomain` | Same as above (format: `project.firebaseapp.com`) |
| `VITE_projectId` | Same as above |
| `VITE_storageBucket` | Same as above (format: `project.appspot.com`) |
| `VITE_messagingSenderId` | Same as above |
| `VITE_appId` | Same as above |
| `VITE_API_BASE_URL` | Your deployed backend URL |

### Backend (`Server/.env`)
| Variable | Where to Get It |
|----------|----------------|
| `DB_USER` | MongoDB Atlas → Database Access → Create User |
| `DB_PASS` | MongoDB Atlas → Database Access → User password |
| `ACCESS_TOKEN_SECRET` | Run: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"` |
| `STRIPE_SECRET_KEY` | Stripe Dashboard → Developers → API Keys |
| `ALLOWED_ORIGINS` | Your frontend URL(s), comma-separated |
| `PORT` | `5000` (default) |

---

## 🎯 Deployment Checklist

- [ ] Firebase project created & Authentication enabled
- [ ] MongoDB Atlas cluster created & IP whitelisted
- [ ] Stripe account ready with API keys
- [ ] JWT secret generated
- [ ] Frontend `.env` file created with real values
- [ ] Frontend deployed on Vercel (`vercel.json` already configured)
- [ ] Backend deployed on Vercel OR Render
- [ ] Backend environment variables set on deployment platform
- [ ] Frontend `VITE_API_BASE_URL` updated with backend URL
- [ ] Frontend redeployed after updating API URL
- [ ] Registration/Login flow working
- [ ] Donation requests working
- [ ] No CORS errors in browser console

---

> **Need help?** Check the project's GitHub issues or open a new one!