"""
Cognito User Pools - Lambda Triggers
Post-confirmation trigger: Custom welcome messages or event logging

This Lambda sends a welcome email after user confirms their account.

"""

import json
import logging
import boto3
from botocore.exceptions import ClientError

logger = logging.getLogger()
logger.setLevel(logging.INFO)

# Initialize SES Client
ses_client = boto3.client('ses')

def handler(event,contract):
    """
    Slide 5: Post Confirmation Lambda Trigger

    Triggered after user confirms email verification.
    Sends welcome email with getting started information
    
    """