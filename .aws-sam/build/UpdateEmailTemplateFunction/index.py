import json
import boto3
import cfnresponse
import os

cognito = boto3.client('cognito-idp')

def handler(event, context):
    """
    Custom resource to update Cognito User Pool email template
    """
    print(f"Event: {json.dumps(event)}")
    
    try:
        request_type = event['RequestType']
        properties = event['ResourceProperties']
        
        if request_type in ['Create', 'Update']:
            user_pool_id = properties['UserPoolId']
            
            # Read HTML template from file
            html_file = os.path.join(os.path.dirname(__file__), 'verification.html')
            with open(html_file, 'r', encoding='utf-8') as f:
                email_template = f.read()
            
            print(f"Updating User Pool: {user_pool_id}")
            
            # Update User Pool with custom email template
            response = cognito.update_user_pool(
                UserPoolId=user_pool_id,
                EmailVerificationSubject='Your WiseUni verification code',
                EmailVerificationMessage=email_template
            )
            
            print(f"Update successful: {response}")
            cfnresponse.send(event, context, cfnresponse.SUCCESS, {
                'Message': 'Email template updated successfully'
            })
        
        elif request_type == 'Delete':
            # No action needed on delete
            cfnresponse.send(event, context, cfnresponse.SUCCESS, {})
    
    except Exception as e:
        print(f"Error: {str(e)}")
        cfnresponse.send(event, context, cfnresponse.FAILED, {
            'Message': str(e)
        })