# tests/integration/lab-9-s3.hurl
# Authenticated POST to /v1/fragments to S3 bucket

# tests/integration/lab-9-s3.hurl
# 1. Create the fragment and save its location
POST http://localhost:8080/v1/fragments
# We're sending a plain text fragment
Content-Type: text/plain
# Include HTTP Basic Auth credentials
[BasicAuth]
user1@email.com:password1
`Hello S3!`

HTTP/1.1 201
[Captures]
url: header "Location"

# 2. GET the fragment and make sure it is alright
GET {{url}}
[BasicAuth]
user1@email.com:password1

HTTP/1.1 200
Content-Type: text/plain
[Asserts]
body == "Hello S3!"

# 3. Delete the fragment 
DELETE {{url}}
[BasicAuth]
user1@email.com:password1

HTTP/1.1 200

# 4. GET the fragment and make sure it deleted
GET {{url}}
[BasicAuth]
user1@email.com:password1

HTTP/1.1 404

