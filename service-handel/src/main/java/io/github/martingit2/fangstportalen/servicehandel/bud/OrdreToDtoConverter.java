package io.github.martingit2.fangstportalen.servicehandel.bud;

import io.github.martingit2.fangstportalen.servicehandel.ordre.Ordre;
import io.github.martingit2.fangstportalen.servicehandel.ordre.dto.OrdreResponseDto;
import io.github.martingit2.fangstportalen.servicehandel.ordre.dto.OrdrelinjeDto;
import io.github.martingit2.fangstportalen.servicehandel.organisasjon.Organisasjon;
import io.github.martingit2.fangstportalen.servicehandel.organisasjon.OrganisasjonRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.function.Function;
import java.util.stream.Collectors;

@Component
@RequiredArgsConstructor
public class OrdreToDtoConverter {

    private final OrganisasjonRepository organisasjonRepository;

    public OrdreResponseDto convertToResponseDto(Ordre ordre) {
        Set<Long> orgIds = new HashSet<>();
        orgIds.add(ordre.getKjoperOrganisasjonId());
        if (ordre.getSelgerOrganisasjonId() != null) {
            orgIds.add(ordre.getSelgerOrganisasjonId());
        }
        Map<Long, Organisasjon> organisasjonMap = organisasjonRepository.findAllById(orgIds)
                .stream().collect(Collectors.toMap(Organisasjon::getId, Function.identity()));

        return convertToResponseDto(ordre, organisasjonMap);
    }

    private OrdreResponseDto convertToResponseDto(Ordre ordre, Map<Long, Organisasjon> organisasjonMap) {
        String kjoperNavn = organisasjonMap.getOrDefault(ordre.getKjoperOrganisasjonId(), new Organisasjon()).getNavn();
        String selgerNavn = ordre.getSelgerOrganisasjonId() != null ? organisasjonMap.getOrDefault(ordre.getSelgerOrganisasjonId(), new Organisasjon()).getNavn() : null;

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
                selgerNavn,
                ordre.getLeveringssted(),
                ordre.getForventetLeveringsdato(),
                ordre.getForventetLeveringstidFra(),
                ordre.getForventetLeveringstidTil(),
                ordre.getOpprettetTidspunkt(),
                linjeDtos
        );
    }
}