# Test Better Auth - Regular User Flow
# All POST requests require Origin header for CSRF protection
# Cookies are automatically managed by Hurl within a file

# Test 1: Sign in with regular user (sets session cookie)
POST http://localhost:3000/api/auth/sign-in/email
Origin: http://localhost:4200
Content-Type: application/json
{
  "email": "user@example.com",
  "password": "User123!"
}
HTTP 200
[Asserts]
jsonpath "$.user.email" == "user@example.com"
jsonpath "$.user.name" == "Regular User"
jsonpath "$.user.role" == "USER"
jsonpath "$.user.preferredName" == null

# Test 2: Get session (uses cookie from sign-in)
GET http://localhost:3000/api/auth/get-session
HTTP 200
[Asserts]
jsonpath "$.user.email" == "user@example.com"
jsonpath "$.user.role" == "USER"
jsonpath "$.session" exists

# Test 3: Sign out user
POST http://localhost:3000/api/auth/sign-out
Origin: http://localhost:4200
HTTP 200

# Test 4: Session should be invalid after sign-out
GET http://localhost:3000/api/auth/get-session
HTTP 200
[Asserts]
jsonpath "$.session" not exists
