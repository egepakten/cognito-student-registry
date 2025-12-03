cd ~/Desktop/Projects/cognito-student-registry/backend

# Step 1: Create deployment bucket
echo "📦 Creating deployment bucket..."
ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)
BUCKET_NAME="wiseuni-deploy-${ACCOUNT_ID}"
aws s3 mb s3://${BUCKET_NAME} 2>/dev/null || echo "✅ Bucket already exists"

# Step 2: Package all templates (uploads nested stacks to S3)
echo ""
echo "📤 Packaging templates..."
aws cloudformation package \
  --template-file template.yaml \
  --s3-bucket ${BUCKET_NAME} \
  --output-template-file packaged.yaml

echo ""
echo "✅ Packaging complete! Generated packaged.yaml"

# Step 3: Deploy the stack
echo ""
echo "🚀 Deploying stack to AWS..."
aws cloudformation deploy \
  --template-file packaged.yaml \
  --stack-name wiseuni-cognito-stack \
  --capabilities CAPABILITY_IAM CAPABILITY_NAMED_IAM CAPABILITY_AUTO_EXPAND \
  --parameter-overrides \
    ProjectName=wiseuni \
    Environment=dev \
  --tags \
    Project=wiseuni \
    Environment=dev

# Step 4: Show outputs
echo ""
echo "📊 Stack Outputs:"
aws cloudformation describe-stacks \
  --stack-name wiseuni-cognito-stack \
  --query 'Stacks[0].Outputs[*].[OutputKey,OutputValue]' \
  --output table

echo ""
echo "✅ Deployment complete!"
echo "View in AWS Console: https://console.aws.amazon.com/cloudformation/home?region=us-east-1#/stacks"
