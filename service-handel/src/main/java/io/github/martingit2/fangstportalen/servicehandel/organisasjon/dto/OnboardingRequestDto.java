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
        @NotBlank @Size(min = 9, max = 9) String organisasjonsnummer,
        @NotNull OrganisasjonType type,
        String telefonnummer,
        String adresse,
        String postnummer,
        String poststed,

        @NotBlank String adminNavn,
        String adminTittel,
        String adminTelefonnummer,

        @Valid List<CreateFartoyRequestDto> fartoy
) {}