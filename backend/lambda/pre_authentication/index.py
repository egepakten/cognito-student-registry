
"""
Cognito User Pools - Lambda Triggers
Pre-authentication trigger: Custom validation before allowing login

This Lambda checks if login is during allowed hours
Prevents login during Lunch Break or holidays.
"""


import json
import logging
from datetime import datetime,time

logger = logging.getLogger()
logger.setLevel(logging.INFO)

def handler(event,context):
    """
    Pre-authentication Lambda Trigger
    Custom validation before user can log in.
    Example: Block student logins during lunch break (12:00 PM - 1:00 PM).
    """

    logger.info(f"Pre-authentication trigger invoked: {json.dumps(event)}")

    try:
        email = event['request']['userAttributes'].get('email','')
        username = event['userName']

        logger.info(f"Validating login attempt for: {username}")

        # Check if current date is during lunch break
        current_time = datetime.now().time()

        # Define lunch break hours (12:00 PM to 1:00 PM)
        lunch_start = time(12,0) # 12:00 PM
        lunch_end = time(13,0) # 13:00 PM

        if lunch_start <= current_time < lunch_end:
            # Allow staff (@wiseuni.com) but not students during lunch break
            email_domain = email.split('@')[1] if '@' in email else ''

            if email_domain == 'student.wiseuni.com':
                logger.warning(f"Login blocked during lunch break: {username}")
                raise Exception("Student logins are not available during lunch break")
        # More Checks Could add more:
        # Check if account is suspended
        # Check if user completed orientation
        # Check if payment is current
        # - Require MFA for domain users
        # Restrict login to business hours only (8AM - 6AM)
        logger.info(f"Login Validation successful: {username}")

        return event
    
    except Exception as e:
        logger.error(f"Pre-authenticated failed: {str(e)}")
        raise e




        # Lunch break: June (6)
