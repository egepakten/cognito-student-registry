#!/bin/bash

set -e

GREEN='\033[0;32m'
CYAN='\033[0;36m'
BOLD='\033[1m'
NC='\033[0m'

print_info() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_highlight() {
    echo -e "${CYAN}${BOLD}$1${NC}"
}

echo ""
print_highlight "╔═══════════════════════════════════════════════════════════════╗"
print_highlight "║           WiseUni Complete Deployment (Backend + Frontend)    ║"
print_highlight "╚═══════════════════════════════════════════════════════════════╝"
echo ""

# Step 1: Deploy backend infrastructure
print_info "STEP 1: Deploying backend infrastructure..."
cd backend
./deploy.sh
cd ..
echo ""

# Step 2: Get Cognito outputs for frontend
print_info "STEP 2: Configuring frontend environment..."
cd frontend

AWS_REGION=$(aws configure get region || echo "us-east-1")

cat > .env.production << EOF
VITE_AWS_REGION=${AWS_REGION}
VITE_USER_POOL_ID=$(aws cloudformation describe-stacks --stack-name wiseuni-cognito-stack --query 'Stacks[0].Outputs[?OutputKey==`UserPoolId`].OutputValue' --output text)
VITE_USER_POOL_CLIENT_ID=$(aws cloudformation describe-stacks --stack-name wiseuni-cognito-stack --query 'Stacks[0].Outputs[?OutputKey==`UserPoolClientId`].OutputValue' --output text)
VITE_IDENTITY_POOL_ID=$(aws cloudformation describe-stacks --stack-name wiseuni-cognito-stack --query 'Stacks[0].Outputs[?OutputKey==`IdentityPoolId`].OutputValue' --output text)
EOF

print_info "✅ Created .env.production"
cat .env.production
echo ""

# Step 3: Deploy frontend
print_info "STEP 3: Building and deploying frontend..."
./deploy-to-s3.sh
cd ..
echo ""

print_highlight "═══════════════════════════════════════════════════════════════"
print_highlight "                    ALL DEPLOYMENTS COMPLETE!"
print_highlight "═══════════════════════════════════════════════════════════════"
echo ""

WEBSITE_URL=$(aws cloudformation describe-stacks \
  --stack-name wiseuni-cognito-stack \
  --query 'Stacks[0].Outputs[?OutputKey==`WebsiteURL`].OutputValue' \
  --output text)

echo "🎉 Your WiseUni application is live!"
echo ""
echo "🌐 Visit your website:"
echo -e "   ${CYAN}${WEBSITE_URL}${NC}"
echo ""