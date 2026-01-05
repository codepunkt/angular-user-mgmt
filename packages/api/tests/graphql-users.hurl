# Test GraphQL Users Query - Pagination and Auth
# Tests user listing with offset-based pagination
# Cookies are automatically managed by Hurl within a file

# Test 1: Unauthenticated request should fail
POST http://localhost:3000/graphql
Content-Type: application/json
{
  "query": "{ users(offset: 0, limit: 10) { items { id email } total } }"
}
HTTP 200
[Asserts]
jsonpath "$.errors[0].message" == "Unauthorized"
jsonpath "$.data" == null

# Test 2: Sign in as admin (sets session cookie)
POST http://localhost:3000/api/auth/sign-in/email
Origin: http://localhost:4200
Content-Type: application/json
{
  "email": "admin@example.com",
  "password": "Admin123!"
}
HTTP 200

# Test 3: Authenticated request should succeed (uses cookie)
POST http://localhost:3000/graphql
Content-Type: application/json
{
  "query": "{ users(offset: 0, limit: 10) { items { id email name preferredName role emailVerified createdAt } total offset limit hasMore } }"
}
HTTP 200
[Asserts]
jsonpath "$.errors" not exists
jsonpath "$.data.users.items" isCollection
jsonpath "$.data.users.total" >= 2
jsonpath "$.data.users.offset" == 0
jsonpath "$.data.users.limit" == 10
jsonpath "$.data.users.hasMore" isBoolean

# Test 4: Pagination with offset
POST http://localhost:3000/graphql
Content-Type: application/json
{
  "query": "{ users(offset: 1, limit: 1) { items { id email } total offset limit hasMore } }"
}
HTTP 200
[Asserts]
jsonpath "$.errors" not exists
jsonpath "$.data.users.items" count == 1
jsonpath "$.data.users.offset" == 1
jsonpath "$.data.users.limit" == 1

# Test 5: Sign out admin and sign in as regular user
POST http://localhost:3000/api/auth/sign-out
Origin: http://localhost:4200
HTTP 200

POST http://localhost:3000/api/auth/sign-in/email
Origin: http://localhost:4200
Content-Type: application/json
{
  "email": "user@example.com",
  "password": "User123!"
}
HTTP 200

# Test 6: Regular user can also query users list
POST http://localhost:3000/graphql
Content-Type: application/json
{
  "query": "{ users(offset: 0, limit: 5) { items { id email name role } total } }"
}
HTTP 200
[Asserts]
jsonpath "$.errors" not exists
jsonpath "$.data.users.items" isCollection
jsonpath "$.data.users.total" >= 2

# Test 7: Invalid offset (negative) should fail
POST http://localhost:3000/graphql
Content-Type: application/json
{
  "query": "{ users(offset: -1, limit: 10) { items { id } total } }"
}
HTTP 200
[Asserts]
jsonpath "$.errors[0].message" == "Offset must be non-negative"

# Test 8: Invalid limit (zero) should fail
POST http://localhost:3000/graphql
Content-Type: application/json
{
  "query": "{ users(offset: 0, limit: 0) { items { id } total } }"
}
HTTP 200
[Asserts]
jsonpath "$.errors[0].message" == "Limit must be between 1 and 100"

# Test 9: Invalid limit (too large) should fail
POST http://localhost:3000/graphql
Content-Type: application/json
{
  "query": "{ users(offset: 0, limit: 101) { items { id } total } }"
}
HTTP 200
[Asserts]
jsonpath "$.errors[0].message" == "Limit must be between 1 and 100"

# Test 10: Verify user fields are returned correctly
POST http://localhost:3000/graphql
Content-Type: application/json
{
  "query": "{ users(offset: 0, limit: 10) { items { id email name preferredName role emailVerified } } }"
}
HTTP 200
[Asserts]
jsonpath "$.errors" not exists
jsonpath "$.data.users.items[*].id" not isEmpty
jsonpath "$.data.users.items[*].email" not isEmpty
jsonpath "$.data.users.items[*].name" not isEmpty
jsonpath "$.data.users.items[*].role" not isEmpty
