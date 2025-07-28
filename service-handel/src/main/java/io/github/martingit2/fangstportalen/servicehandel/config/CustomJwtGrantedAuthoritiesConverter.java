package io.github.martingit2.fangstportalen.servicehandel.config;

import org.springframework.core.convert.converter.Converter;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.oauth2.jwt.Jwt;

import java.util.Collection;
import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

public class CustomJwtGrantedAuthoritiesConverter implements Converter<Jwt, Collection<GrantedAuthority>> {

    private static final String CLAIMS_NAMESPACE = "https://fangstportalen.no/claims";
    private static final String ROLES_KEY = "roles";
    private static final String AUTHORITY_PREFIX = "ROLE_";

    @Override
    public Collection<GrantedAuthority> convert(Jwt jwt) {
        Map<String, Object> claims = jwt.getClaimAsMap(CLAIMS_NAMESPACE);

        if (claims == null) {
            return Collections.emptyList();
        }

        Object rolesObject = claims.get(ROLES_KEY);
        if (!(rolesObject instanceof List<?>)) {
            return Collections.emptyList();
        }

        @SuppressWarnings("unchecked")
        List<String> roles = (List<String>) rolesObject;

        return roles.stream()
                .map(role -> new SimpleGrantedAuthority(AUTHORITY_PREFIX + role))
                .collect(Collectors.toList());
    }
}