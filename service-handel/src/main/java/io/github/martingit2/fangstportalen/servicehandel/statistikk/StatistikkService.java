package io.github.martingit2.fangstportalen.servicehandel.statistikk;

import io.github.martingit2.fangstportalen.servicehandel.ordre.Ordre;
import io.github.martingit2.fangstportalen.servicehandel.ordre.OrdreRepository;
import io.github.martingit2.fangstportalen.servicehandel.ordre.OrdreStatus;
import io.github.martingit2.fangstportalen.servicehandel.organisasjon.Organisasjon;
import io.github.martingit2.fangstportalen.servicehandel.organisasjon.OrganisasjonRepository;
import io.github.martingit2.fangstportalen.servicehandel.organisasjon.OrganisasjonType;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.function.Function;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class StatistikkService {

    private final OrdreRepository ordreRepository;
    private final OrganisasjonRepository organisasjonRepository;

    @Transactional(readOnly = true)
    public StatistikkResponseDto beregnStatistikkForOrganisasjon(Long orgId, OrganisasjonType orgType) {
        List<Ordre> fullforteOrdrer;
        boolean erSelger = orgType == OrganisasjonType.REDERI;

        if (erSelger) {
            fullforteOrdrer = ordreRepository.findBySelgerOrganisasjonIdAndStatus(orgId, OrdreStatus.FULLFØRT);
        } else {
            fullforteOrdrer = ordreRepository.findByKjoperOrganisasjonIdAndStatus(orgId, OrdreStatus.FULLFØRT);
        }

        if (fullforteOrdrer.isEmpty()) {
            return new StatistikkResponseDto(0, 0, 0, Collections.emptyMap(), Collections.emptyMap(), Collections.emptyMap());
        }

        double totalVerdi = fullforteOrdrer.stream()
                .flatMap(ordre -> ordre.getSluttseddel().getSluttseddelLinjer().stream())
                .mapToDouble(linje -> {
                    double pris = linje.getSluttseddel().getOrdre().getOrdrelinjer().stream()
                            .filter(ol -> ol.getId().equals(linje.getOrdrelinjeId()))
                            .findFirst().map(ol -> ol.getAvtaltPrisPerKg()).orElse(0.0);
                    return linje.getFaktiskKvantum() * pris;
                }).sum();

        double totaltKvantum = fullforteOrdrer.stream()
                .flatMap(ordre -> ordre.getSluttseddel().getSluttseddelLinjer().stream())
                .mapToDouble(linje -> linje.getFaktiskKvantum())
                .sum();

        Map<String, Double> verdiPerFiskeslag = fullforteOrdrer.stream()
                .flatMap(ordre -> ordre.getSluttseddel().getSluttseddelLinjer().stream())
                .collect(Collectors.groupingBy(
                        linje -> linje.getFiskeslag(),
                        Collectors.summingDouble(linje -> {
                            double pris = linje.getSluttseddel().getOrdre().getOrdrelinjer().stream()
                                    .filter(ol -> ol.getId().equals(linje.getOrdrelinjeId()))
                                    .findFirst().map(ol -> ol.getAvtaltPrisPerKg()).orElse(0.0);
                            return linje.getFaktiskKvantum() * pris;
                        })
                ));

        Map<String, Double> kvantumPerFiskeslag = fullforteOrdrer.stream()
                .flatMap(ordre -> ordre.getSluttseddel().getSluttseddelLinjer().stream())
                .collect(Collectors.groupingBy(
                        linje -> linje.getFiskeslag(),
                        Collectors.summingDouble(linje -> linje.getFaktiskKvantum())
                ));

        Set<Long> motpartIds = fullforteOrdrer.stream()
                .map(ordre -> erSelger ? ordre.getKjoperOrganisasjonId() : ordre.getSelgerOrganisasjonId())
                .collect(Collectors.toSet());

        Map<Long, String> motpartNavnMap = organisasjonRepository.findAllById(motpartIds).stream()
                .collect(Collectors.toMap(Organisasjon::getId, Organisasjon::getNavn));

        Map<String, Double> verdiPerMotpart = fullforteOrdrer.stream()
                .collect(Collectors.groupingBy(
                        ordre -> motpartNavnMap.getOrDefault(erSelger ? ordre.getKjoperOrganisasjonId() : ordre.getSelgerOrganisasjonId(), "Ukjent"),
                        Collectors.summingDouble(ordre ->
                                ordre.getSluttseddel().getSluttseddelLinjer().stream().mapToDouble(linje -> {
                                    double pris = linje.getSluttseddel().getOrdre().getOrdrelinjer().stream()
                                            .filter(ol -> ol.getId().equals(linje.getOrdrelinjeId()))
                                            .findFirst().map(ol -> ol.getAvtaltPrisPerKg()).orElse(0.0);
                                    return linje.getFaktiskKvantum() * pris;
                                }).sum()
                        )
                ));

        return new StatistikkResponseDto(totalVerdi, totaltKvantum, fullforteOrdrer.size(), verdiPerFiskeslag, kvantumPerFiskeslag, verdiPerMotpart);
    }
}