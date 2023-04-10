# tests/integration/lab-10-dynamodb.hurl
POST http://localhost:8080/v1/fragments
Content-Type: application/json
[BasicAuth]
user1@email.com:password1
{ "service": "DynamoDB" }

HTTP/1.1 201
[Asserts]
[Captures]
fragment1_url: header "Location"
fragment1_id: jsonpath "$.fragment.id"

GET {{fragment1_url}}/info
[BasicAuth]
user1@email.com:password1
HTTP/1.1 200
[Asserts]
jsonpath "$.fragment.id" == {{fragment1_id}}

POST http://localhost:8080/v1/fragments
Content-Type: text/markdown
[BasicAuth]
user1@email.com:password1
```DynamoDB is **great**.```
HTTP/1.1 201
[Asserts]
[Captures]
fragment2_url: header "Location"
fragment2_id: jsonpath "$.fragment.id"

GET {{fragment2_url}}/info
[BasicAuth]
user1@email.com:password1
HTTP/1.1 200
[Asserts]
jsonpath "$.fragment.id" == {{fragment2_id}}

DELETE {{fragment2_url}}
[BasicAuth]
user1@email.com:password1

HTTP/1.1 200

GET {{fragment2_url}}
[BasicAuth]
user1@email.com:password1
HTTP/1.1 404
