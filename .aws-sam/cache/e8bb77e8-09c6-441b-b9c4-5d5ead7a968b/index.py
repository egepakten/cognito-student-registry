"""
Pre-signup trigger with optional blacklist
Allows all emails EXCEPT blocked domains
"""

import json
import logging

logger = logging.getLogger()
logger.setLevel(logging.INFO)

def handler(event, context):
    """
    Pre-signup Lambda Trigger
    
    Allows all email domains except blacklisted ones.
    Blocks temporary/disposable email services.
    """
    
    logger.info(f"Pre-signup trigger invoked: {json.dumps(event)}")
    
    # Extract email from user attributes
    email = event['request']['userAttributes'].get('email', '').lower()
    logger.info(f"Validating email: {email}")
    
    # Validate email format
    if '@' not in email or '.' not in email.split('@')[1]:
        logger.error(f"Invalid email format: {email}")
        raise ValueError("Invalid email format. Please enter a valid email address.")
    
    # Extract domain
    email_domain = email.split('@')[1]
    
    # OPTIONAL: Block disposable/temporary email domains
    # These are common temporary email services used for spam
    blocked_domains = [
        'tempmail.com',
        '10minutemail.com',
        'guerrillamail.com',
        'throwaway.email',
        'mailinator.com',
        'trashmail.com',
        # Add more if needed
    ]
    
    if email_domain in blocked_domains:
        logger.warning(f"Blocked temporary email domain: {email_domain}")
        raise ValueError("Temporary or disposable email addresses are not allowed. Please use a permanent email address.")
    
    logger.info(f"Email validation successful: {email} (domain: {email_domain})")
    
    # All users must verify their email
    event['response']['autoConfirmUser'] = False
    event['response']['autoVerifyEmail'] = False
    
    # Return event - signup allowed
    return event