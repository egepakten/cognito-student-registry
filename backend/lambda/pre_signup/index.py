
"""
Slide 5: Cognito User Pools - Lambda Trigers
Pre-Signup trigger: Custom Validation to accept or deny sign-up

This lambda validates email domains before allowing user registration
Only Third Party Valid Companies are allowed.(Google, iCloud, Outlook, Hotmail)

"""

import json 
import logging

logger = logging.getLogger()
logger.setLevel(logging.INFO)

def handler(event,context):
    """
    Slide 5: Pre-signup Lambda Trigger

    Event structure:
    {
        "request":{
            "userAttributes":{
                "email": "student@wiseuni.com",
                "name":"John doe"
            }
        },
        "response":{
            "userAttributes":{
                "autoConfirmUser:false,
                "autoVerifyEmail:false"
            }
        }
    }

    """

    logger.info(f"Pre-signup trigger invoked: {json.dumps(event)}")

    try:
        # Extract email from user attributes
        email = event['request']['userAttributes'].get('email','')
        logger.info(f"Validating email: {email}")

        # Only allow specific email domains (Google, iCloud, Outlook, Hotmail)
        allowed_domains = ['google.com','icloud.com','outlook.com','hotmail.com']
        email_domain = email.split('@')[1] if '@' in email else ''

        if email_domain not in allowed_domains:
            logger.warning(f"Email domain not allowed: {email_domain}")
            raise Exception(f'Invalid email domain. Only {", ".join(allowed_domains)}')
        logger.info(f"Email Validation successful: {email}")

        # Auto Confirms users from wiseuni.com (staff/professors)
        if email_domain == 'wiseuni.com':
            event['response']['autoConfirmUser'] = True
            event['response']['autoVerifyEmail'] = True
            logger.info("Auto confirming wiseuni.com email")
    except KeyError as e:
        logger.error(f"Missing required field: {str(e)}") 
        raise Exception("Invalid event Structure")
    except Exception as e:
        logger.error(f"Pre-signup validation failed: {str(e)}")
        raise(e)