# Test Better Auth - Admin User Flow
# All POST requests require Origin header for CSRF protection
# Cookies are automatically managed by Hurl within a file

# Test 1: Health endpoint (anonymous access)
GET http://localhost:3000/health
HTTP 200
[Asserts]
jsonpath "$.status" == "ok"

# Test 2: Auth ok endpoint
GET http://localhost:3000/api/auth/ok
HTTP 200
[Asserts]
jsonpath "$.ok" == true

# Test 3: Sign in with admin user (sets session cookie)
POST http://localhost:3000/api/auth/sign-in/email
Origin: http://localhost:4200
Content-Type: application/json
{
  "email": "admin@example.com",
  "password": "Admin123!"
}
HTTP 200
[Asserts]
jsonpath "$.user.email" == "admin@example.com"
jsonpath "$.user.name" == "Admin User"
jsonpath "$.user.role" == "ADMIN"
jsonpath "$.user.preferredName" == "Admin"
jsonpath "$.user.emailVerified" == true

# Test 4: Get session (uses cookie from sign-in)
GET http://localhost:3000/api/auth/get-session
HTTP 200
[Asserts]
jsonpath "$.user.email" == "admin@example.com"
jsonpath "$.user.role" == "ADMIN"
jsonpath "$.user.preferredName" == "Admin"
jsonpath "$.session" exists

# Test 5: Sign out admin
POST http://localhost:3000/api/auth/sign-out
Origin: http://localhost:4200
HTTP 200

# Test 6: Session should be invalid after sign-out
GET http://localhost:3000/api/auth/get-session
HTTP 200
[Asserts]
jsonpath "$.session" not exists
