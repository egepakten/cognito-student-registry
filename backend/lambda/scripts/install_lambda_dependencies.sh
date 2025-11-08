# scripts/install_lambda_dependencies.sh

#!/bin/bash

# Install dependencies for all Lambda functions

echo "Installing Lambda dependencies..."

# Pre-signup
cd backend/lambda/pre_signup
pip install -r requirements.txt -t . --upgrade

# Post-confirmation
cd ../post_confirmation
pip install -r requirements.txt -t . --upgrade

# Pre-authentication
cd ../pre_authentication
pip install -r requirements.txt -t . --upgrade

# Custom message
cd ../custom_message
pip install -r requirements.txt -t . --upgrade

cd ../../..
echo "All dependencies installed!"