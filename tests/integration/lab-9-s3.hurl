# tests/integration/lab-9-s3.hurl
# Authenticated POST to /v1/fragments to S3 bucket
POST http://localhost:8080/v1/fragments
Content-Type: text/plain
[BasicAuth]
user1@email.com:password1
`Hello S3!`

HTTP/1.1 201
[Asserts]
header "Location" matches "^http:\/\/localhost:8080\/v1\/fragments\/[A-Za-z0-9_-]+$"
jsonpath "$.status" == "ok"
jsonpath "$.fragment.type" == "text/plain"
[Captures]
url: header "Location"

GET {{url}}
[BasicAuth]
user1@email.com:password1

HTTP/1.1 200
Content-Type: text/plain
[Asserts]
body == "Hello S3!"

DELETE {{url}}
[BasicAuth]
user1@email.com:password1

HTTP/1.1 200

GET {{url}}
[BasicAuth]
user1@email.com:password1

HTTP/1.1 404
