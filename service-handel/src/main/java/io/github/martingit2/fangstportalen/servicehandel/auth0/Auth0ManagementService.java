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
import java.util.Map;
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

    private String cachedToken;
    private Instant tokenExpiry;

    public void createInvitation(String email, Long orgId, String orgType, Set<String> roles) throws IOException {
        String accessToken = getAccessToken();
        String url = "https://" + domain + "/api/v2/tickets/password-change";

        ObjectNode appMetadata = objectMapper.createObjectNode();
        appMetadata.put("org_id", orgId);
        appMetadata.put("org_type", orgType);
        appMetadata.set("roles", objectMapper.valueToTree(roles));

        ObjectNode payload = objectMapper.createObjectNode();
        payload.put("email", email);
        payload.put("connection_id", "con_YOUR_CONNECTION_ID"); // VIKTIG: Endre denne
        payload.set("app_metadata", appMetadata);

        RequestBody body = RequestBody.create(payload.toString(), MediaType.get("application/json; charset=utf-8"));
        Request request = new Request.Builder()
                .url(url)
                .header("Authorization", "Bearer " + accessToken)
                .post(body)
                .build();

        try (Response response = httpClient.newCall(request).execute()) {
            if (!response.isSuccessful()) {
                log.error("Failed to create Auth0 invitation for {}: {}", email, response.body() != null ? response.body().string() : "No response body");
                throw new IOException("Unexpected code " + response);
            }
            log.info("Successfully created Auth0 invitation for email: {}", email);
        }
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
            if (!response.isSuccessful()) throw new IOException("Unexpected code " + response);
            String responseBody = response.body().string();
            JsonNode jsonNode = objectMapper.readTree(responseBody);
            this.cachedToken = jsonNode.get("access_token").asText();
            long expiresIn = jsonNode.get("expires_in").asLong();
            this.tokenExpiry = Instant.now().plusSeconds(expiresIn - 60);
            return this.cachedToken;
        }
    }
}