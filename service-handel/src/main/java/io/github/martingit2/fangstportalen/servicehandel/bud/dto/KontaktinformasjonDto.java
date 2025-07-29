package io.github.martingit2.fangstportalen.servicehandel.bud.dto;

public record KontaktinformasjonDto(
        String organisasjonNavn,
        String organisasjonTelefon,
        String kontaktpersonNavn,
        String kontaktpersonTittel,
        String kontaktpersonTelefon
) {}