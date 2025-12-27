#!/bin/bash

echo "🚀 TSOK Learning Platform - GUARANTEED DEPLOYMENT SCRIPT"
echo "========================================================"
echo ""

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${YELLOW}This script will:${NC}"
echo "1. Clean all caches"
echo "2. Remove node_modules"
echo "3. Fresh install"
echo "4. Build locally to verify"
echo "5. Push to GitHub"
echo "6. Deploy to Vercel"
echo ""

read -p "Continue? (y/n) " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]
then
    exit 1
fi

echo -e "${GREEN}Step 1: Cleaning...${NC}"
rm -rf node_modules
rm -rf .next
rm -f package-lock.json
rm -f yarn.lock
npm cache clean --force

echo -e "${GREEN}Step 2: Installing dependencies...${NC}"
npm install --legacy-peer-deps

echo -e "${GREEN}Step 3: Building locally...${NC}"
npm run build

if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Build failed! Fix errors before deploying.${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Build successful!${NC}"
echo ""

read -p "Enter your GitHub repository URL: " REPO_URL

echo -e "${GREEN}Step 4: Pushing to GitHub...${NC}"
git add .
git commit -m "TSOK Platform - Fixed React errors - $(date)"
git push origin main --force

echo -e "${GREEN}Step 5: Deploying to Vercel...${NC}"
echo "Opening Vercel Dashboard..."
echo ""
echo -e "${YELLOW}Manual steps in Vercel:${NC}"
echo "1. Go to https://vercel.com/dashboard"
echo "2. Click 'Redeploy' on latest deployment"
echo "3. UNCHECK 'Use existing Build Cache'"
echo "4. Click 'Redeploy'"
echo "5. Wait 3-5 minutes"
echo ""
echo -e "${GREEN}✅ Done! Check Vercel for deployment status.${NC}"
