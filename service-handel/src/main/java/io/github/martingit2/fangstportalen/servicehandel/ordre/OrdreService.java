package io.github.martingit2.fangstportalen.servicehandel.ordre;

import io.github.martingit2.fangstportalen.servicehandel.ordre.dto.CreateOrdreRequestDto;
import io.github.martingit2.fangstportalen.servicehandel.ordre.dto.OrdreResponseDto;
import io.github.martingit2.fangstportalen.servicehandel.ordre.dto.OrdrelinjeDto;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class OrdreService {

    private final OrdreRepository ordreRepository;
    private static final Logger logger = LoggerFactory.getLogger(OrdreService.class);

    @Transactional
    public OrdreResponseDto createOrdre(CreateOrdreRequestDto dto, String kjoperBrukerId) {
        logger.info("OrdreService: Bygger ordre-entitet for bruker {}", kjoperBrukerId);

        Ordre ordre = Ordre.builder()
                .kjoperBrukerId(kjoperBrukerId)
                .status(OrdreStatus.AKTIV)
                .forventetLeveringsdato(dto.forventetLeveringsdato())
                .build();

        dto.ordrelinjer().forEach(linjeDto -> {
            Ordrelinje linje = Ordrelinje.builder()
                    .fiskeslag(linjeDto.fiskeslag())
                    .kvalitet(linjeDto.kvalitet())
                    .storrelse(linjeDto.storrelse())
                    .avtaltPrisPerKg(linjeDto.avtaltPrisPerKg())
                    .forventetKvantum(linjeDto.forventetKvantum())
                    .build();
            ordre.addOrdrelinje(linje);
        });

        logger.debug("Klar til å lagre bygget Ordre-entitet: {}", ordre);

        Ordre savedOrdre = ordreRepository.save(ordre);

        logger.info("Ordre-entitet lagret med ID: {}", savedOrdre.getId());
        return convertToResponseDto(savedOrdre);
    }

    public List<OrdreResponseDto> findMineOrdrer(String kjoperBrukerId) {
        logger.info("Henter ordrer for bruker: {}", kjoperBrukerId);
        List<Ordre> ordrer = ordreRepository.findByKjoperBrukerIdOrderByOpprettetTidspunktDesc(kjoperBrukerId);
        return ordrer.stream()
                .map(this::convertToResponseDto)
                .collect(Collectors.toList());
    }

    private OrdreResponseDto convertToResponseDto(Ordre ordre) {
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
                ordre.getForventetLeveringsdato(),
                ordre.getOpprettetTidspunkt(),
                linjeDtos
        );
    }
}