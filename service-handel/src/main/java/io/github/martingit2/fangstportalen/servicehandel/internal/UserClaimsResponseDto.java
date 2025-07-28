package io.github.martingit2.fangstportalen.servicehandel.internal;

import java.util.List;

public record UserClaimsResponseDto(
        Long orgId,
        String orgName,
        String orgType,
        List<String> roles,
        Long fartoyId
) {}