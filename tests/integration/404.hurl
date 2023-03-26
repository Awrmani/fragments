# tests/integration/404.hurl
# Non-existing Route Test
GET http://localhost:8080/no-such-route

HTTP/1.1 404
