package io.github.martingit2.fangstportalen.servicehandel.team.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import java.util.Set;

@JsonInclude(JsonInclude.Include.NON_NULL)
public record TeamMedlemResponseDto(
        String brukerId,
        Set<String> roller,
        Long tildeltFartoyId,
        String tildeltFartoyNavn
) {}