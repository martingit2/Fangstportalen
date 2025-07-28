package io.github.martingit2.fangstportalen.servicehandel.internal;

import java.util.Set;

public record InvitedUserDto(String brukerId, Long organisasjonId, Set<String> roller) {}