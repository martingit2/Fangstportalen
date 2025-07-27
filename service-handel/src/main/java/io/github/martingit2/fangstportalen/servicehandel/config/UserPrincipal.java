package io.github.martingit2.fangstportalen.servicehandel.config;

import org.springframework.security.oauth2.jwt.Jwt;

import java.util.Map;

public class UserPrincipal {

    private final Map<String, Object> claims;

    public UserPrincipal(Jwt jwt) {
        this.claims = jwt.getClaimAsMap("https://fangstportalen.no/claims");
        if (this.claims == null) {
            throw new IllegalStateException("JWT token mangler påkrevde organisasjons-claims.");
        }
    }

    public Long getOrganisasjonId() {
        return ((Number) claims.get("org_id")).longValue();
    }
}