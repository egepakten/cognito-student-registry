#!/bin/bash

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
BOLD='\033[1m'
NC='\033[0m' # No Color

# Function to print colored output
print_info() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warn() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

print_success() {
    echo -e "${GREEN}${BOLD}[SUCCESS]${NC} $1"
}

print_highlight() {
    echo -e "${CYAN}${BOLD}$1${NC}"
}

# Function to display usage
usage() {
    echo "Usage: $0 [OPTIONS]"
    echo ""
    echo "Options:"
    echo "  -e, --environment ENV    Environment to deploy (dev|staging|prod) [default: dev]"
    echo "  -h, --help               Show this help message"
    echo ""
    echo "Examples:"
    echo "  $0                      # Deploy to dev environment"
    echo "  $0 -e staging            # Deploy to staging environment"
    echo "  $0 -e prod               # Deploy to production environment"
    exit 1
}

# Default values
ENVIRONMENT="dev"

# Parse command line arguments
while [[ $# -gt 0 ]]; do
    case $1 in
        -e|--environment)
            ENVIRONMENT="$2"
            shift 2
            ;;
        -h|--help)
            usage
            ;;
        *)
            print_error "Unknown option: $1"
            usage
            ;;
    esac
done

# Validate environment
if [[ ! "$ENVIRONMENT" =~ ^(dev|staging|prod)$ ]]; then
    print_error "Invalid environment: $ENVIRONMENT"
    print_info "Valid environments are: dev, staging, prod"
    exit 1
fi

# Get the script directory and navigate to backend directory
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd "$SCRIPT_DIR"

# Display banner
echo ""
print_highlight "╔═══════════════════════════════════════════════════════════════╗"
print_highlight "║                  WiseUni Infrastructure Deploy                 ║"
print_highlight "╚═══════════════════════════════════════════════════════════════╝"
echo ""

print_info "Environment: ${ENVIRONMENT}"
print_info "Working directory: $(pwd)"
echo ""

# Check AWS credentials
print_info "Checking AWS credentials..."
if ! aws sts get-caller-identity &> /dev/null; then
    print_error "AWS credentials not configured. Please configure them:"
    print_info "  aws configure"
    exit 1
fi

ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)
AWS_REGION=$(aws configure get region || echo "us-east-1")
print_info "AWS Account: ${ACCOUNT_ID}"
print_info "AWS Region: ${AWS_REGION}"
echo ""

# Create deployment bucket
print_info "📦 Creating deployment bucket..."
BUCKET_NAME="wiseuni-deploy-${ACCOUNT_ID}"
if aws s3 mb s3://${BUCKET_NAME} 2>/dev/null; then
    print_success "Created deployment bucket: ${BUCKET_NAME}"
else
    print_info "✅ Deployment bucket already exists: ${BUCKET_NAME}"
fi
echo ""

# Package templates
print_info "📤 Packaging templates..."
print_info "Uploading nested stacks to S3..."
aws cloudformation package \
  --template-file template.yaml \
  --s3-bucket ${BUCKET_NAME} \
  --output-template-file packaged.yaml \
  --region ${AWS_REGION}

print_success "✅ Packaging complete! Generated packaged.yaml"
echo ""

# Deploy the stack
print_info "🚀 Deploying WiseUni stack to AWS..."
print_info "This will create/update the following resources:"
print_info "  • Lambda Functions (Pre-Signup, Post-Confirmation, Pre-Auth, Custom Message)"
print_info "  • Cognito User Pool & Identity Pool"
print_info "  • DynamoDB Table"
print_info "  • S3 Buckets (Uploads & Frontend)"
print_info "  • IAM Roles (Student, Professor, Admin)"
print_info "  • CloudFront Distribution"
echo ""
print_warn "This may take 10-15 minutes..."
echo ""

aws cloudformation deploy \
  --template-file packaged.yaml \
  --stack-name wiseuni-cognito-stack \
  --capabilities CAPABILITY_IAM CAPABILITY_NAMED_IAM CAPABILITY_AUTO_EXPAND \
  --parameter-overrides \
    ProjectName=wiseuni \
    Environment=${ENVIRONMENT} \
  --tags \
    Project=wiseuni \
    Environment=${ENVIRONMENT} \
  --region ${AWS_REGION}

echo ""
print_success "✅ Stack deployment complete!"
echo ""

# Get stack outputs
print_info "📊 Retrieving stack outputs..."
echo ""

# Get all outputs
OUTPUTS=$(aws cloudformation describe-stacks \
  --stack-name wiseuni-cognito-stack \
  --query 'Stacks[0].Outputs' \
  --output json \
  --region ${AWS_REGION})

# Extract specific outputs
USER_POOL_ID=$(echo $OUTPUTS | jq -r '.[] | select(.OutputKey=="UserPoolId") | .OutputValue')
USER_POOL_CLIENT_ID=$(echo $OUTPUTS | jq -r '.[] | select(.OutputKey=="UserPoolClientId") | .OutputValue')
IDENTITY_POOL_ID=$(echo $OUTPUTS | jq -r '.[] | select(.OutputKey=="IdentityPoolId") | .OutputValue')
WEBSITE_URL=$(echo $OUTPUTS | jq -r '.[] | select(.OutputKey=="WebsiteURL") | .OutputValue')
CLOUDFRONT_ID=$(echo $OUTPUTS | jq -r '.[] | select(.OutputKey=="CloudFrontDistributionId") | .OutputValue')
FRONTEND_BUCKET=$(echo $OUTPUTS | jq -r '.[] | select(.OutputKey=="FrontendBucketName") | .OutputValue')
TABLE_NAME=$(echo $OUTPUTS | jq -r '.[] | select(.OutputKey=="WiseUniTableName") | .OutputValue')

# Display outputs in a nice format
print_highlight "═══════════════════════════════════════════════════════════════"
print_highlight "                    DEPLOYMENT SUMMARY"
print_highlight "═══════════════════════════════════════════════════════════════"
echo ""

echo -e "${BOLD}🌐 Website URL:${NC}"
echo -e "   ${CYAN}${WEBSITE_URL}${NC}"
echo ""

echo -e "${BOLD}🔐 Cognito Configuration:${NC}"
echo "   User Pool ID:        ${USER_POOL_ID}"
echo "   App Client ID:       ${USER_POOL_CLIENT_ID}"
echo "   Identity Pool ID:    ${IDENTITY_POOL_ID}"
echo ""

echo -e "${BOLD}📦 Storage:${NC}"
echo "   DynamoDB Table:      ${TABLE_NAME}"
echo "   Frontend Bucket:     ${FRONTEND_BUCKET}"
echo ""

echo -e "${BOLD}🌍 CloudFront:${NC}"
echo "   Distribution ID:     ${CLOUDFRONT_ID}"
echo "   Status:              Deploying (takes 15-20 min)"
echo ""

print_highlight "═══════════════════════════════════════════════════════════════"
echo ""

# Show all outputs in table format
print_info "Complete Stack Outputs:"
echo ""
aws cloudformation describe-stacks \
  --stack-name wiseuni-cognito-stack \
  --query 'Stacks[0].Outputs[*].[OutputKey,OutputValue]' \
  --output table \
  --region ${AWS_REGION}

echo ""
print_highlight "═══════════════════════════════════════════════════════════════"
print_highlight "                    NEXT STEPS"
print_highlight "═══════════════════════════════════════════════════════════════"
echo ""

echo "1️⃣  Configure Frontend Environment:"
echo "   cd ../frontend"
echo "   cat > .env.production << EOF"
echo "VITE_AWS_REGION=${AWS_REGION}"
echo "VITE_USER_POOL_ID=${USER_POOL_ID}"
echo "VITE_USER_POOL_CLIENT_ID=${USER_POOL_CLIENT_ID}"
echo "VITE_IDENTITY_POOL_ID=${IDENTITY_POOL_ID}"
echo "EOF"
echo ""

echo "2️⃣  Build Frontend:"
echo "   npm run build"
echo ""

echo "3️⃣  Deploy Frontend to S3:"
echo "   aws s3 sync dist/ s3://${FRONTEND_BUCKET}/ --delete"
echo ""

echo "4️⃣  Invalidate CloudFront Cache:"
echo "   aws cloudfront create-invalidation \\"
echo "     --distribution-id ${CLOUDFRONT_ID} \\"
echo "     --paths '/*'"
echo ""

echo "5️⃣  Visit Your Website:"
echo "   ${CYAN}${WEBSITE_URL}${NC}"
echo ""

print_warn "⚠️  CloudFront distribution takes 15-20 minutes to fully deploy"
print_warn "⚠️  Website will show 'Access Denied' until you upload frontend files"
echo ""

print_highlight "═══════════════════════════════════════════════════════════════"
echo ""

print_info "🔗 AWS Console Links:"
echo "   CloudFormation: https://console.aws.amazon.com/cloudformation/home?region=${AWS_REGION}#/stacks"
echo "   Cognito: https://console.aws.amazon.com/cognito/home?region=${AWS_REGION}"
echo "   DynamoDB: https://console.aws.amazon.com/dynamodb/home?region=${AWS_REGION}"
echo "   S3: https://s3.console.aws.amazon.com/s3/home?region=${AWS_REGION}"
echo "   CloudFront: https://console.aws.amazon.com/cloudfront/home"
echo ""

print_success "🎉 Deployment Complete!"
echo ""

# Save outputs to file for later use
OUTPUTS_FILE="deployment-outputs-${ENVIRONMENT}.json"
echo $OUTPUTS | jq '.' > ${OUTPUTS_FILE}
print_info "💾 Outputs saved to: ${OUTPUTS_FILE}"
echo ""