# Whales Solution - Netlify Deployment Guide

This application is optimized for deployment on Netlify using **Netlify Functions** for the backend API and **Vite** for the frontend.

## 🚀 Quick Deployment

1. **Push to GitHub**: Push your code to a GitHub repository.
2. **Connect to Netlify**:
   - Go to [Netlify Dashboard](https://app.netlify.com/).
   - Click **Add new site** > **Import from an existing project**.
   - Select your GitHub repository.
3. **Configure Build Settings**:
   - **Build Command**: `npm run build`
   - **Publish Directory**: `dist`
4. **Set Environment Variables**:
   - Go to **Site Settings** > **Environment variables**.
   - Add the following keys:
     - `GEMINI_API_KEY`: Your Google AI API Key (for the Sales Agent and Blog Generator).
     - `WEB3FORMS_ACCESS_KEY`: Your Web3Forms Access Key (for the Contact Form).

## 🛠 Manual Deployment (Drag & Drop)

1. Run `npm run build` locally.
2. Drag and drop the following items into the Netlify "Deploy" box:
   - `dist/` folder
   - `netlify/` folder
   - `netlify.toml` file

## 📁 Technical Architecture

- **Frontend**: React + Vite + Tailwind CSS (deployed as static assets in `dist/`).
- **Backend**: Express.js app wrapped as a serverless function (located in `src/backend/` and exported via `netlify/functions/api.ts`).
- **Routing**: `netlify.toml` handles redirects so all `/api/*` requests hit the serverless function and all other routes hit the SPA index.

## 📧 Contact Form Failover

The contact form uses **Web3Forms** for reliable delivery. Ensure you have authorized your production domain (e.g., `whalessolution.com`) in your Web3Forms dashboard to prevent 403 Forbidden errors.
