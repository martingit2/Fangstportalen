package io.github.martingit2.fangstportalen.servicehandel.bud;

import io.github.martingit2.fangstportalen.servicehandel.ordre.Ordre;
import io.github.martingit2.fangstportalen.servicehandel.ordre.dto.OrdreResponseDto;
import io.github.martingit2.fangstportalen.servicehandel.ordre.dto.OrdrelinjeDto;
import io.github.martingit2.fangstportalen.servicehandel.organisasjon.Organisasjon;
import io.github.martingit2.fangstportalen.servicehandel.organisasjon.OrganisasjonRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.stream.Collectors;

@Component
@RequiredArgsConstructor
public class OrdreToDtoConverter {

    private final OrganisasjonRepository organisasjonRepository;

    public OrdreResponseDto convertToResponseDto(Ordre ordre) {
        String kjoperNavn = organisasjonRepository.findById(ordre.getKjoperOrganisasjonId())
                .map(Organisasjon::getNavn)
                .orElse("Ukjent Kjøper");

        List<OrdrelinjeDto> linjeDtos = ordre.getOrdrelinjer().stream()
                .map(linje -> new OrdrelinjeDto(
                        linje.getId(),
                        linje.getFiskeslag(),
                        linje.getKvalitet(),
                        linje.getStorrelse(),
                        linje.getAvtaltPrisPerKg(),
                        linje.getForventetKvantum()
                )).collect(Collectors.toList());

        return new OrdreResponseDto(
                ordre.getId(),
                ordre.getStatus().name(),
                kjoperNavn,
                ordre.getLeveringssted(),
                ordre.getForventetLeveringsdato(),
                ordre.getForventetLeveringstidFra(),
                ordre.getForventetLeveringstidTil(),
                ordre.getOpprettetTidspunkt(),
                linjeDtos
        );
    }
}