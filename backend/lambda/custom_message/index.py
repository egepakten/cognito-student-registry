"""
Cognito User Pools - Lamnda Triggers
Custom message trigger: CUstomize Verification and invitation emails

This Lambda customizes email messages send by Cognito
"""

import json
import logging

logger = logging.getLogger()
logger.setLevel(logging.INFO)

def handler(event,context):
    """
    Custom Message Lambda Trigger

    Customize emails sent by Cognito:
    - Verification Codes
    - Password reset codes
    - Invitation emails
    """

    logger.info(f"Custom message trigger invoked: {json.dumps(event)}")

    try:
        trigger_source = event['triggerSource']
        code = event['requests']['codeParameter']
        username = event['username']
        email = event['request']['userAttributes'].get('email','')
        name = event['request']['userAttributes'].get('name','Student')

        logger.info(f"Customizing message for :{trigger_source}")

        # Customize Based on trigger type
        if trigger_source == 'CustomMessage_SignUp':
            # Email verification message
            event['response']['emailSubject'] = f'Welcome to WiseUni - Verify Your Email 📧'
            event['response']['emailMessage'] = f'''
                <html>
                <body style="font-family: Arial, sans-serif;">
                    <h2>Welcome to WiseUni, {name}! 🎓</h2>
                    <p>Thank you for registering with WiseUni Student Portal.</p>
                    <p>Your verification code is:</p>
                    <h1 style="color: #4CAF50; letter-spacing: 5px;">{code}</h1>
                    <p>Enter this code to verify your email address and activate your account.</p>
                    <p>This code expires in 24 hours.</p>
                    <hr>
                    <p style="color: #666; font-size: 12px;">
                        If you didn't create this account, please ignore this email.
                    </p>
                </body>
                </html>
            '''

        elif trigger_source == 'CustomMessage_ForgotPassword':
            # Password reset message
            event['response']['emailSubject'] = f'WiseUni - Password Reset Code 🔐'
            event['response']['emailMessage'] = f'''
                <html>
                <body style="font-family: Arial, sans-serif;">
                    <h2>Password Reset Request</h2>
                    <p>Hi {name},</p>
                    <p>You requested to reset your password for your WiseUni account.</p>
                    <p>Your password reset code is:</p>
                    <h1 style="color: #FF5722; letter-spacing: 5px;">{code}</h1>
                    <p>Enter this code to set a new password.</p>
                    <p>This code expires in 1 hour.</p>
                    <p><strong>If you didn't request this, please contact support immediately.</strong></p>
                    <hr>
                    <p style="color: #666; font-size: 12px;">
                        WiseUni Security Team<br>
                        support@wiseuni.com
                    </p>
                </body>
                </html>
            '''

        elif trigger_source == 'CustomMessage_ResendCode':
            # Resend verification code
            event['response']['emailSubject'] = f'WiseUni - New Verification Code 📧'
            event['response']['emailMessage'] = f'''
                <html>
                <body style="font-family: Arial, sans-serif;">
                    <h2>New Verification Code</h2>
                    <p>Hi {name},</p>
                    <p>Here's your new verification code:</p>
                    <h1 style="color: #2196F3; letter-spacing: 5px;">{code}</h1>
                    <p>Enter this code to verify your email address.</p>
                </body>
                </html>
            '''

        logger.info(f"Custom message created for: {trigger_source}")
        
        return event
    
    except Exception as e:
        logger.error(f"Custom message error: {str(e)}")
        # Return original event if customization fails
        return event