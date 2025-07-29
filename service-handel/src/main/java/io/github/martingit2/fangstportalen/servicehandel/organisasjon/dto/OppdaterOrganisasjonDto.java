package io.github.martingit2.fangstportalen.servicehandel.organisasjon.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;


public record OppdaterOrganisasjonDto(@NotBlank String navn, @Size(min = 8) String telefonnummer, @NotBlank String adresse, @NotBlank @Size(min = 4, max = 4) String postnummer, @NotBlank String poststed) {}