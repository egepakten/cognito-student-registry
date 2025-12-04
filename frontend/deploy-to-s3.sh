#!/bin/bash

set -e

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
BOLD='\033[1m'
NC='\033[0m'

print_info() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warn() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

print_highlight() {
    echo -e "${CYAN}${BOLD}$1${NC}"
}

# Check if we're in the frontend directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: Must run from frontend directory"
    echo "   cd frontend && ./deploy-to-s3.sh"
    exit 1
fi

# Default values
STACK_NAME="wiseuni-cognito-stack"
AWS_REGION=$(aws configure get region || echo "us-east-1")

echo ""
print_highlight "╔═══════════════════════════════════════════════════════════════╗"
print_highlight "║                 WiseUni Frontend Deployment                    ║"
print_highlight "╚═══════════════════════════════════════════════════════════════╝"
echo ""

# Get outputs from CloudFormation
print_info "📊 Getting deployment info from CloudFormation..."
BUCKET_NAME=$(aws cloudformation describe-stacks \
  --stack-name ${STACK_NAME} \
  --query 'Stacks[0].Outputs[?OutputKey==`FrontendBucketName`].OutputValue' \
  --output text \
  --region ${AWS_REGION})

DISTRIBUTION_ID=$(aws cloudformation describe-stacks \
  --stack-name ${STACK_NAME} \
  --query 'Stacks[0].Outputs[?OutputKey==`CloudFrontDistributionId`].OutputValue' \
  --output text \
  --region ${AWS_REGION})

WEBSITE_URL=$(aws cloudformation describe-stacks \
  --stack-name ${STACK_NAME} \
  --query 'Stacks[0].Outputs[?OutputKey==`WebsiteURL`].OutputValue' \
  --output text \
  --region ${AWS_REGION})

if [ -z "$BUCKET_NAME" ]; then
    echo "❌ Error: Could not find frontend bucket in stack outputs"
    echo "   Make sure the infrastructure is deployed: cd ../backend && ./deploy.sh"
    exit 1
fi

print_info "Target bucket: ${BUCKET_NAME}"
print_info "CloudFront ID: ${DISTRIBUTION_ID}"
echo ""

# Build React app
print_info "🔨 Building React app..."
npm run build

if [ ! -d "dist" ]; then
    echo "❌ Error: dist/ directory not found after build"
    exit 1
fi

echo ""
print_info "📤 Uploading files to S3..."

# Upload static assets with long cache (1 year)
print_info "Uploading JS, CSS, and assets (with 1-year cache)..."
aws s3 sync dist/ s3://${BUCKET_NAME}/ \
  --delete \
  --cache-control "public, max-age=31536000, immutable" \
  --exclude "index.html" \
  --exclude "*.html" \
  --region ${AWS_REGION}

# Upload HTML files with no cache
print_info "Uploading HTML files (no cache)..."
aws s3 sync dist/ s3://${BUCKET_NAME}/ \
  --cache-control "no-cache, no-store, must-revalidate" \
  --content-type "text/html" \
  --exclude "*" \
  --include "*.html" \
  --region ${AWS_REGION}

echo ""
print_info "🔄 Invalidating CloudFront cache..."
INVALIDATION_ID=$(aws cloudfront create-invalidation \
  --distribution-id ${DISTRIBUTION_ID} \
  --paths "/*" \
  --query 'Invalidation.Id' \
  --output text)

print_info "Invalidation ID: ${INVALIDATION_ID}"
echo ""

print_highlight "═══════════════════════════════════════════════════════════════"
print_highlight "                    DEPLOYMENT COMPLETE!"
print_highlight "═══════════════════════════════════════════════════════════════"
echo ""

echo "✅ Files uploaded to S3: ${BUCKET_NAME}"
echo "✅ CloudFront cache invalidated"
echo ""

print_warn "⏳ CloudFront cache invalidation takes 5-10 minutes"
print_warn "⏳ Your changes will be live after invalidation completes"
echo ""

echo "🌐 Your website:"
echo -e "   ${CYAN}${WEBSITE_URL}${NC}"
echo ""

print_info "💡 Check invalidation status:"
echo "   aws cloudfront get-invalidation \\"
echo "     --distribution-id ${DISTRIBUTION_ID} \\"
echo "     --id ${INVALIDATION_ID}"
echo ""