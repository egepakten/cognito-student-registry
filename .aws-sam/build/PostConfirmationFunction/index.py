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

    logger.info(f"Post-confirmation trigger invoked:{json.dumps(event)}")

    try:
        #Extract user information
        email = event['request']["userAttributes"].get('email')
        name = event['request']['userAttributes'].get('name','Student')
        username = event['userName']

        logger.info(f"Sending welcome email to:{email}")

        # Send Welcome Email via SES
        email_subject = "Welcome to WiseUni Student Portal!"
        email_body = f"""
            Hi {name},

            Welcome to WiseUni Student Portal! Your account has been successfully activated.

            Username: {username}
            Email: {email}

            You can now:
            ✅ Upload homework assignments
            ✅ View your grades
            ✅ Access course materials
            ✅ Download resources

            Getting Started:
            1. Log in at: https://app.wiseuni.com
            2. Complete your profile
            3. Explore your dashboard

            Need help? Contact support@wiseuni.com

            Best regards,
            WiseUni Team
        
        """

        response = ses_client.send_email(
            Source='egepakten@icloud.com', # Must be verified in SES
            Destination={
                'toAddresses':[email]
            },
            Message={
                'Subject':{
                    'Data':email_subject,
                    'Charset':'UTF-8'
                },
                'Body':{
                    'Text':{
                        'Data':email_body,
                        'Charset':'UTF-8'
                    }
                }
            }
        )

        logger.info(f"Welcome email sent successfully. MessageId: {response['MessageId']}")

        return event

    except ClientError as e:
        logger.error(f"SES error: {e.response['Error']['Message']}")
        # Dont fail user registration if email fails
        return event
    except Exception as e:
        logger.error(f"Post-Confirmation error: {str(e)}")
        return event