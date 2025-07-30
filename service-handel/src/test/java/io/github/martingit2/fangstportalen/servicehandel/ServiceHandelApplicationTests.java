package io.github.martingit2.fangstportalen.servicehandel;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.TestPropertySource;

@SpringBootTest
@TestPropertySource(properties = {
        "spring.security.oauth2.resourceserver.jwt.issuer-uri=https://test.auth0.com/",
        "spring.security.oauth2.resourceserver.jwt.audience=test-audience",
        "app.cors.allowed-origins=http://localhost:3000",
        "app.frontend.url=http://localhost:5173",
        "auth0.management.domain=test.auth0.com",
        "auth0.management.clientId=test_client_id",
        "auth0.management.clientSecret=test_client_secret",
        "auth0.management.audience=https://test.auth0.com/api/v2/",
        "auth0.frontend.clientId=test_frontend_client_id",
        "app.api-key=test-api-key"
})
class ServiceHandelApplicationTests {

    @Test
    void contextLoads() {
    }

}