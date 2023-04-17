# tests/integration/post-fragments-unsupported-type.hurl
# Authenticated POST to /v1/fragments
POST http://localhost:8080/v1/fragments
# We're sending an image which is not supported yet
Content-Type: audio/aac
# Include HTTP Basic Auth credentials
[BasicAuth]
user1@email.com:password1
`This is a fragment!`

HTTP/1.1 415
