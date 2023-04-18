# tests/integration/post-fragments-image.hurl
# Authenticated POST to /v1/fragments
POST http://localhost:8080/v1/fragments
# We're sending a plain text fragment
Content-Type: image/png
# Include HTTP Basic Auth credentials
[BasicAuth]
user1@email.com:password1
file,test1.png;

HTTP/1.1 201
[Asserts]
[Captures]
url: header "Location"

GET {{url}}
[BasicAuth]
user1@email.com:password1

HTTP/1.1 200
Content-Type: image/png
[Asserts]
file,test1.png;

GET {{url}}.jpg
[BasicAuth]
user1@email.com:password1

HTTP/1.1 200
Content-Type: image/jpeg; charset=utf-8

GET {{url}}.gif
[BasicAuth]
user1@email.com:password1

HTTP/1.1 200
Content-Type: image/gif; charset=utf-8

GET {{url}}.png
[BasicAuth]
user1@email.com:password1

HTTP/1.1 200
Content-Type: image/png

GET {{url}}.webp
[BasicAuth]
user1@email.com:password1
file,test1.png;

HTTP/1.1 200
Content-Type: image/webp; charset=utf-8
