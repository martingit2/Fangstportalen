package io.github.martingit2.fangstportalen.servicehandel.bruker;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record OppdaterMinProfilDto(@NotBlank String navn, String tittel, @Size(min = 8, message = "Telefonnummer må være minst 8 siffer") String telefonnummer) {}
