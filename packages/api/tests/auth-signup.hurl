# Test Better Auth - Sign Up Flow (triggers verification email)
# Note: This test requires a valid RESEND_API_KEY to actually send emails
# Without it, the signup will fail when trying to send the verification email

# Test 1: Sign up new user (triggers verification email)
# This test expects the email to be sent successfully
# If RESEND_API_KEY is not configured, this will fail with a 500 error
POST http://localhost:3000/api/auth/sign-up/email
Origin: http://localhost:4200
Content-Type: application/json
[Options]
variable: test_uuid={{newUuid}}
{
  "email": "test-{{test_uuid}}@example.com",
  "password": "NewUser123!",
  "name": "New Test User"
}
HTTP 200
[Asserts]
jsonpath "$.user.email" == "test-{{test_uuid}}@example.com"
jsonpath "$.user.name" == "New Test User"
jsonpath "$.user.emailVerified" == false
