# tests/integration/put-fragments.hurl
# Authenticated POST to /v1/fragments
POST http://localhost:8080/v1/fragments
# We're sending a plain text fragment
Content-Type: text/plain
# Include HTTP Basic Auth credentials
[BasicAuth]
user1@email.com:password1
`fragment!`

HTTP/1.1 201
[Asserts]
[Captures]
url: header "Location"

GET {{url}}
[BasicAuth]
user1@email.com:password1

HTTP/1.1 200
Content-Type: text/plain
[Asserts]
`fragment!`

PUT {{url}}
Content-Type: text/plain; charset=utf-8
[BasicAuth]
user1@email.com:password1
`fragment updated!`

HTTP/1.1 201
Content-Type: text/plain; charset=utf-8

GET {{url}}
[BasicAuth]
user1@email.com:password1

HTTP/1.1 200
Content-Type: text/plain
[Asserts]
`fragment updated!`
