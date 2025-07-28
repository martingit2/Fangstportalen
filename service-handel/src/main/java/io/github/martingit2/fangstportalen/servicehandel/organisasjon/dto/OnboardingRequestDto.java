package io.github.martingit2.fangstportalen.servicehandel.organisasjon.dto;

import io.github.martingit2.fangstportalen.servicehandel.fartoy.dto.CreateFartoyRequestDto;
import io.github.martingit2.fangstportalen.servicehandel.organisasjon.OrganisasjonType;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.util.List;

public record OnboardingRequestDto(
        @NotBlank String navn,
        @NotBlank @Size(min = 9, max = 9, message = "Organisasjonsnummer må være 9 siffer") String organisasjonsnummer,
        @NotNull OrganisasjonType type,
        @Valid List<CreateFartoyRequestDto> fartoy // Kan være tom for fiskebruk
) {}