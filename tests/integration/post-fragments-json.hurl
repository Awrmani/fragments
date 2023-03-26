# tests/integration/post-fragments-json.hurl
# Authenticated POST to /v1/fragments
POST http://localhost:8080/v1/fragments
# We're sending a json file
Content-Type: application/json
[BasicAuth]
user1@email.com:password1
`{'json1' : 'test1', 'json2' : 'test2', }`

HTTP/1.1 201
[Asserts]
header "Location" matches "^localhost:8080\/v1\/fragments\/[A-Za-z0-9_-]+$"
jsonpath "$.status" == "ok"
jsonpath "$.fragment.type" == "application/json"
[Captures]
url: header "Location"

GET {{url}}
[BasicAuth]
user1@email.com:password1

HTTP/1.1 200
Content-Type: application/json
[Asserts]
body == "{'json1' : 'test1', 'json2' : 'test2', }"
