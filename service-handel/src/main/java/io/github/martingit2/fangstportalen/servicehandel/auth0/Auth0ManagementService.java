package io.github.martingit2.fangstportalen.servicehandel.auth0;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;
import okhttp3.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.time.Instant;
import java.util.Set;

@Service
public class Auth0ManagementService {

    private static final Logger log = LoggerFactory.getLogger(Auth0ManagementService.class);
    private final OkHttpClient httpClient = new OkHttpClient();
    private final ObjectMapper objectMapper = new ObjectMapper();

    @Value("${auth0.management.domain}") private String domain;
    @Value("${auth0.management.clientId}") private String clientId;
    @Value("${auth0.management.clientSecret}") private String clientSecret;
    @Value("${auth0.management.audience}") private String audience;
    @Value("${app.frontend.url}") private String frontendUrl;

    private String cachedToken;
    private Instant tokenExpiry;

    public void createInvitation(String email, Long orgId, Set<String> roles) throws IOException {
        String accessToken = getAccessToken();
        String newUserId = createUser(accessToken, email, orgId, roles);
        createVerificationTicket(accessToken, newUserId);
    }

    private String createUser(String accessToken, String email, Long orgId, Set<String> roles) throws IOException {
        String url = "https://" + domain + "/api/v2/users";

        ObjectNode appMetadata = objectMapper.createObjectNode();
        appMetadata.put("org_id", orgId);
        appMetadata.set("roles", objectMapper.valueToTree(roles));

        ObjectNode payload = objectMapper.createObjectNode();
        payload.put("email", email);
        payload.put("connection", "Username-Password-Authentication");
        payload.put("password", generateRandomPassword());
        payload.put("verify_email", false);
        payload.put("email_verified", false);
        payload.set("app_metadata", appMetadata);

        RequestBody body = RequestBody.create(objectMapper.writeValueAsString(payload), MediaType.get("application/json; charset=utf-8"));
        Request request = new Request.Builder().url(url).header("Authorization", "Bearer " + accessToken).post(body).build();

        try (Response response = httpClient.newCall(request).execute()) {
            String responseBody = response.body() != null ? response.body().string() : "No response body";
            if (!response.isSuccessful()) {
                if (response.code() == 409) {
                    log.warn("Bruker med e-post {} eksisterer allerede i Auth0. Kan ikke invitere på nytt.", email);
                    throw new IOException("Bruker med denne e-posten eksisterer allerede.");
                }
                log.error("Klarte ikke å opprette bruker i Auth0. Status: {}, Body: {}", response.code(), responseBody);
                throw new IOException("Auth0 API feilet under brukeropprettelse: " + responseBody);
            }
            log.info("Opprettet bruker i Auth0 for e-post: {}", email);
            JsonNode jsonNode = objectMapper.readTree(responseBody);
            return jsonNode.get("user_id").asText();
        }
    }

    private void createVerificationTicket(String accessToken, String userId) throws IOException {
        String url = "https://" + domain + "/api/v2/tickets/email-verification";

        ObjectNode payload = objectMapper.createObjectNode();
        payload.put("user_id", userId);
        payload.put("result_url", frontendUrl);

        RequestBody body = RequestBody.create(objectMapper.writeValueAsString(payload), MediaType.get("application/json; charset=utf-8"));
        Request request = new Request.Builder().url(url).header("Authorization", "Bearer " + accessToken).post(body).build();

        try (Response response = httpClient.newCall(request).execute()) {
            if (!response.isSuccessful()) {
                String errorBody = response.body() != null ? response.body().string() : "No response body";
                log.error("Klarte ikke å opprette verifiseringsticket. Status: {}, Body: {}", response.code(), errorBody);
                throw new IOException("Auth0 API feilet under opprettelse av verifiseringsticket: " + errorBody);
            }
            log.info("Opprettet verifiseringsticket for bruker-ID: {}", userId);
        }
    }

    private String generateRandomPassword() {
        return "P@ssword" + System.currentTimeMillis() + "!";
    }

    private synchronized String getAccessToken() throws IOException {
        if (cachedToken != null && Instant.now().isBefore(tokenExpiry)) {
            return cachedToken;
        }

        String url = "https://" + domain + "/oauth/token";
        String jsonBody = String.format("{\"client_id\":\"%s\",\"client_secret\":\"%s\",\"audience\":\"%s\",\"grant_type\":\"client_credentials\"}",
                clientId, clientSecret, audience);

        RequestBody body = RequestBody.create(jsonBody, MediaType.get("application/json; charset=utf-8"));
        Request request = new Request.Builder().url(url).post(body).build();

        try (Response response = httpClient.newCall(request).execute()) {
            if (!response.isSuccessful()) {
                String errorBody = response.body() != null ? response.body().string() : "No response body";
                log.error("Klarte ikke å hente Auth0 Management Token. Status: {}, Body: {}", response.code(), errorBody);
                throw new IOException("Kunne ikke hente access token fra Auth0: " + errorBody);
            }
            String responseBody = response.body().string();
            JsonNode jsonNode = objectMapper.readTree(responseBody);
            this.cachedToken = jsonNode.get("access_token").asText();
            long expiresIn = jsonNode.get("expires_in").asLong();
            this.tokenExpiry = Instant.now().plusSeconds(expiresIn - 60);
            return this.cachedToken;
        }
    }
}