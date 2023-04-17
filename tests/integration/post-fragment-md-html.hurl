# tests/integration/post-fragments-markdown.hurl
# Authenticated POST to /v1/fragments
POST http://localhost:8080/v1/fragments
# We're sending a plain text fragment
Content-Type: text/markdown
# Include HTTP Basic Auth credentials
[BasicAuth]
user1@email.com:password1
`Text`

HTTP/1.1 201
[Asserts]
[Captures]
url: header "Location"

GET {{url}}
[BasicAuth]
user1@email.com:password1

HTTP/1.1 200
Content-Type: text/markdown
[Asserts]
`Text`

GET {{url}}.html
[BasicAuth]
user1@email.com:password1

HTTP/1.1 200
Content-Type: text/html; charset=utf-8
