# backend/lambda/post_confirmation/index.py
"""
Post-Confirmation Lambda Trigger
Sends branded welcome email from noreply@wiseuni.co.uk after email verification
"""

import boto3
import logging
import os

logger = logging.getLogger()
logger.setLevel(logging.INFO)

ses_client = boto3.client('ses')

def handler(event, context):
    """
    Triggered after user confirms their email via OTP
    Sends professional welcome email from custom domain
    
    Event structure:
    {
        'request': {
            'userAttributes': {
                'email': 'user@example.com',
                'name': 'John Smith',
                'sub': 'user-id-uuid'
            }
        }
    }
    """
    
    try:
        # Extract user information from Cognito event
        email = event['request']['userAttributes']['email']
        name = event['request']['userAttributes'].get('name', 'Student')
        user_id = event['request']['userAttributes'].get('sub', '')
        
        logger.info(f'Post-confirmation triggered for user: {email} (ID: {user_id})')
        
        # Professional sender with custom domain
        from_email = 'WiseUni Student Portal <noreply@wiseuni.co.uk>'
        
        # Branded HTML email template with WiseUni colors
        html_body = f'''
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif; background-color: #f4f7fc;">
            <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #f4f7fc; padding: 20px;">
                <tr>
                    <td align="center">
                        <!-- Main Container -->
                        <table width="600" cellpadding="0" cellspacing="0" border="0" style="background-color: white; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.1); max-width: 100%;">
                            
                            <!-- Header with Gradient -->
                            <tr>
                                <td style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 30px; text-align: center;">
                                    <h1 style="margin: 0; color: white; font-size: 32px; font-weight: 700; letter-spacing: -0.5px;">
                                        🎓 WiseUni
                                    </h1>
                                    <p style="margin: 10px 0 0; color: white; opacity: 0.95; font-size: 16px; font-weight: 500;">
                                        Student Portal
                                    </p>
                                </td>
                            </tr>
                            
                            <!-- Main Content -->
                            <tr>
                                <td style="padding: 40px 30px;">
                                    <!-- Welcome Message -->
                                    <h2 style="margin: 0 0 20px; color: #2d3748; font-size: 26px; font-weight: 700;">
                                        Welcome, {name}! 🎉
                                    </h2>
                                    
                                    <p style="margin: 0 0 20px; color: #4a5568; line-height: 1.7; font-size: 16px;">
                                        Your account has been successfully created and verified. You now have full access to the WiseUni Student Portal!
                                    </p>
                                    
                                    <!-- Feature Box -->
                                    <div style="background: #f7fafc; border-left: 4px solid #667eea; padding: 24px; margin: 30px 0; border-radius: 6px;">
                                        <h3 style="margin: 0 0 16px; color: #2d3748; font-size: 18px; font-weight: 600;">
                                            What You Can Do:
                                        </h3>
                                        <ul style="margin: 0; padding-left: 24px; color: #4a5568; line-height: 1.8;">
                                            <li style="margin-bottom: 10px;">
                                                <strong>📚 Upload Homework:</strong> Submit assignments securely to cloud storage
                                            </li>
                                            <li style="margin-bottom: 10px;">
                                                <strong>📊 View Grades:</strong> Check your grades and feedback in real-time
                                            </li>
                                            <li style="margin-bottom: 10px;">
                                                <strong>🔐 Secure Access:</strong> Your data is protected with AWS Cognito authentication
                                            </li>
                                            <li>
                                                <strong>📁 Manage Files:</strong> Access all your submitted work anytime
                                            </li>
                                        </ul>
                                    </div>
                                    
                                    <!-- Account Details -->
                                    <div style="background: white; border: 2px solid #e2e8f0; padding: 20px; margin: 30px 0; border-radius: 6px;">
                                        <h3 style="margin: 0 0 12px; color: #2d3748; font-size: 16px; font-weight: 600;">
                                            Your Account Details:
                                        </h3>
                                        <p style="margin: 8px 0; color: #4a5568; font-size: 14px;">
                                            <strong style="color: #667eea;">Email:</strong> {email}
                                        </p>
                                        <p style="margin: 8px 0; color: #4a5568; font-size: 14px;">
                                            <strong style="color: #667eea;">Account Type:</strong> Student
                                        </p>
                                        <p style="margin: 8px 0; color: #4a5568; font-size: 14px;">
                                            <strong style="color: #667eea;">Status:</strong> ✅ Verified
                                        </p>
                                    </div>
                                    
                                    <!-- Call to Action Button -->
                                    <div style="text-align: center; margin-top: 35px;">
                                        <a href="http://localhost:5173" 
                                           style="display: inline-block; 
                                                  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
                                                  color: white; 
                                                  padding: 16px 40px; 
                                                  text-decoration: none; 
                                                  border-radius: 8px; 
                                                  font-weight: 600; 
                                                  font-size: 16px;
                                                  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);">
                                            Access Your Portal
                                        </a>
                                    </div>
                                    
                                    <!-- Help Section -->
                                    <div style="margin-top: 35px; padding-top: 25px; border-top: 1px solid #e2e8f0;">
                                        <p style="margin: 0 0 10px; color: #718096; font-size: 14px; line-height: 1.6;">
                                            <strong>Need Help?</strong><br>
                                            If you have any questions or need assistance, please don't hesitate to reach out.
                                        </p>
                                        <p style="margin: 0; color: #718096; font-size: 14px;">
                                            Contact: <a href="mailto:egepakten@icloud.com" style="color: #667eea; text-decoration: none;">egepakten@icloud.com</a>
                                        </p>
                                    </div>
                                </td>
                            </tr>
                            
                            <!-- Footer -->
                            <tr>
                                <td style="background: #f7fafc; padding: 30px; text-align: center; border-top: 1px solid #e2e8f0;">
                                    <p style="margin: 0 0 8px; color: #718096; font-size: 14px;">
                                        <strong>WiseUni Student Portal</strong>
                                    </p>
                                    <p style="margin: 0 0 12px; color: #a0aec0; font-size: 12px;">
                                        Powered by AWS Cognito, S3, DynamoDB & Amazon SES
                                    </p>
                                    <p style="margin: 0; color: #a0aec0; font-size: 11px; line-height: 1.5;">
                                        This is an automated message from WiseUni. Please do not reply to this email.<br>
                                        For support, contact <a href="mailto:egepakten@icloud.com" style="color: #667eea; text-decoration: none;">egepakten@icloud.com</a>
                                    </p>
                                </td>
                            </tr>
                        </table>
                    </td>
                </tr>
            </table>
        </body>
        </html>
        '''
        
        # Plain text version (fallback for email clients that don't support HTML)
        text_body = f'''
            Welcome to WiseUni, {name}!

            Your account has been successfully created and verified.

            What You Can Do:
            - Upload Homework: Submit assignments securely to cloud storage
            - View Grades: Check your grades and feedback in real-time
            - Secure Access: Your data is protected with AWS authentication
            - Manage Files: Access all your submitted work anytime

            Your Account Details:
            Email: {email}
            Account Type: Student
            Status: Verified

            Access your portal at: http://localhost:5173

            Need Help?
            If you have any questions, contact: egepakten@icloud.com

            ---
            WiseUni Student Portal
            Powered by AWS Cognito, S3, DynamoDB & Amazon SES

            This is an automated message. Please do not reply.
        '''
        
        # Send email via Amazon SES
        response = ses_client.send_email(
            Source=from_email,  # Custom domain email
            Destination={
                'ToAddresses': [email]
            },
            Message={
                'Subject': {
                    'Data': f'Welcome to WiseUni, {name}! 🎓',
                    'Charset': 'UTF-8'
                },
                'Body': {
                    'Html': {
                        'Data': html_body,
                        'Charset': 'UTF-8'
                    },
                    'Text': {
                        'Data': text_body,
                        'Charset': 'UTF-8'
                    }
                }
            }
        )
        
        # Log successful email delivery
        message_id = response.get('MessageId', 'N/A')
        logger.info(f'✅ Welcome email sent successfully to {email}. MessageId: {message_id}')
        
        # Return event to continue Cognito flow
        return event
        
    except Exception as e:
        # Log error but don't fail the signup process
        logger.error(f'❌ Failed to send welcome email: {str(e)}', exc_info=True)
        
        # Still return event so user signup completes
        # Email failure shouldn't prevent account creation
        return event