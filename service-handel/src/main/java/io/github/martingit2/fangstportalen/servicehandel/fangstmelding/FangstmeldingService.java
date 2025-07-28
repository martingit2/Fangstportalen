package io.github.martingit2.fangstportalen.servicehandel.fangstmelding;

import io.github.martingit2.fangstportalen.servicehandel.fartoy.Fartoy;
import io.github.martingit2.fangstportalen.servicehandel.fartoy.FartoyRepository;
import io.github.martingit2.fangstportalen.servicehandel.fangstmelding.dto.CreateFangstmeldingRequestDto;
import io.github.martingit2.fangstportalen.servicehandel.fangstmelding.dto.FangstlinjeResponseDto;
import io.github.martingit2.fangstportalen.servicehandel.fangstmelding.dto.FangstmeldingResponseDto;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class FangstmeldingService {

    private final FangstmeldingRepository fangstmeldingRepository;
    private final FartoyRepository fartoyRepository;
    private static final Logger logger = LoggerFactory.getLogger(FangstmeldingService.class);

    @Transactional
    public FangstmeldingResponseDto createFangstmeldingAndConvertToDto(CreateFangstmeldingRequestDto dto, Long selgerOrganisasjonId, Long fartoyId) {
        Fangstmelding fangstmelding = createFangstmelding(dto, selgerOrganisasjonId, fartoyId);
        return convertToResponseDto(fangstmelding);
    }

    @Transactional
    public Fangstmelding createFangstmelding(CreateFangstmeldingRequestDto dto, Long selgerOrganisasjonId, Long fartoyId) {
        Fartoy fartoy = fartoyRepository.findById(fartoyId)
                .orElseThrow(() -> new EntityNotFoundException("Fartøy ikke funnet med ID: " + fartoyId));

        if (!fartoy.getEierOrganisasjon().getId().equals(selgerOrganisasjonId)) {
            throw new AccessDeniedException("Ditt rederi eier ikke dette fartøyet.");
        }

        Fangstmelding fangstmelding = Fangstmelding.builder()
                .selgerOrganisasjonId(selgerOrganisasjonId)
                .fartoy(fartoy)
                .leveringssted(dto.leveringssted())
                .tilgjengeligFraDato(dto.tilgjengeligFraDato())
                .status(FangstmeldingStatus.AAPEN_FOR_BUD)
                .build();

        dto.fangstlinjer().forEach(linjeDto -> {
            Fangstlinje linje = Fangstlinje.builder()
                    .fiskeslag(linjeDto.fiskeslag())
                    .estimertKvantum(linjeDto.estimertKvantum())
                    .utropsprisPerKg(linjeDto.utropsprisPerKg())
                    .kvalitet(linjeDto.kvalitet())
                    .storrelse(linjeDto.storrelse())
                    .build();
            fangstmelding.addFangstlinje(linje);
        });

        return fangstmeldingRepository.save(fangstmelding);
    }

    @Transactional
    public FangstmeldingResponseDto updateFangstmelding(Long fangstmeldingId, CreateFangstmeldingRequestDto dto, Long selgerOrganisasjonId) {
        Fangstmelding fangstmelding = fangstmeldingRepository.findById(fangstmeldingId)
                .orElseThrow(() -> new EntityNotFoundException("Finner ikke fangstmelding med ID: " + fangstmeldingId));

        if (!fangstmelding.getSelgerOrganisasjonId().equals(selgerOrganisasjonId)) {
            throw new AccessDeniedException("Du har ikke tilgang til å redigere denne fangstmeldingen.");
        }

        if (fangstmelding.getStatus() != FangstmeldingStatus.AAPEN_FOR_BUD) {
            throw new IllegalStateException("Kun fangstmeldinger som er åpne for bud kan redigeres.");
        }

        fangstmelding.setLeveringssted(dto.leveringssted());
        fangstmelding.setTilgjengeligFraDato(dto.tilgjengeligFraDato());

        fangstmelding.getFangstlinjer().clear();
        dto.fangstlinjer().forEach(linjeDto -> {
            Fangstlinje linje = Fangstlinje.builder()
                    .fiskeslag(linjeDto.fiskeslag())
                    .estimertKvantum(linjeDto.estimertKvantum())
                    .utropsprisPerKg(linjeDto.utropsprisPerKg())
                    .kvalitet(linjeDto.kvalitet())
                    .storrelse(linjeDto.storrelse())
                    .build();
            fangstmelding.addFangstlinje(linje);
        });

        Fangstmelding updatedFangstmelding = fangstmeldingRepository.save(fangstmelding);
        logger.info("Fangstmelding {} ble oppdatert av organisasjon {}", fangstmeldingId, selgerOrganisasjonId);

        return convertToResponseDto(updatedFangstmelding);
    }

    @Transactional(readOnly = true)
    public List<FangstmeldingResponseDto> findAktiveFangstmeldinger() {
        List<Fangstmelding> fangstmeldinger = fangstmeldingRepository.findByStatusOrderByTilgjengeligFraDatoAsc(FangstmeldingStatus.AAPEN_FOR_BUD);
        return fangstmeldinger.stream()
                .map(this::convertToResponseDto)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<FangstmeldingResponseDto> findMineAktiveFangstmeldinger(Long selgerOrganisasjonId) {
        List<Fangstmelding> fangstmeldinger = fangstmeldingRepository.findBySelgerOrganisasjonIdAndStatus(selgerOrganisasjonId, FangstmeldingStatus.AAPEN_FOR_BUD);
        return fangstmeldinger.stream()
                .map(this::convertToResponseDto)
                .collect(Collectors.toList());
    }

    @Transactional
    public void deleteFangstmelding(Long fangstmeldingId, Long selgerOrganisasjonId) {
        logger.info("Forespørsel om å slette fangstmelding {} for organisasjon {}", fangstmeldingId, selgerOrganisasjonId);

        Fangstmelding fangstmelding = fangstmeldingRepository.findById(fangstmeldingId)
                .orElseThrow(() -> new EntityNotFoundException("Finner ikke fangstmelding med ID: " + fangstmeldingId));

        if (!fangstmelding.getSelgerOrganisasjonId().equals(selgerOrganisasjonId)) {
            logger.warn("Sikkerhetsbrudd! Organisasjon {} forsøkte å slette fangstmelding {} som tilhører {}.",
                    selgerOrganisasjonId, fangstmeldingId, fangstmelding.getSelgerOrganisasjonId());
            throw new AccessDeniedException("Du har ikke tilgang til å slette denne fangstmeldingen.");
        }

        if (fangstmelding.getStatus() != FangstmeldingStatus.AAPEN_FOR_BUD) {
            logger.warn("Ugyldig operasjon. Forsøkte å slette fangstmelding {} med status {}, men kun AAPEN_FOR_BUD kan slettes.",
                    fangstmeldingId, fangstmelding.getStatus());
            throw new IllegalStateException("Kun fangstmeldinger som er åpne for bud kan slettes.");
        }

        fangstmeldingRepository.delete(fangstmelding);
        logger.info("Fangstmelding {} ble slettet av organisasjon {}", fangstmeldingId, selgerOrganisasjonId);
    }

    private FangstmeldingResponseDto convertToResponseDto(Fangstmelding fangstmelding) {
        List<FangstlinjeResponseDto> fangstlinjeDtos = fangstmelding.getFangstlinjer().stream()
                .map(linje -> new FangstlinjeResponseDto(
                        linje.getId(),
                        linje.getFiskeslag(),
                        linje.getEstimertKvantum(),
                        linje.getUtropsprisPerKg(),
                        linje.getKvalitet(),
                        linje.getStorrelse()))
                .collect(Collectors.toList());

        return new FangstmeldingResponseDto(
                fangstmelding.getId(),
                String.valueOf(fangstmelding.getSelgerOrganisasjonId()),
                fangstmelding.getFartoy().getNavn(),
                fangstmelding.getStatus().name(),
                fangstmelding.getLeveringssted(),
                fangstmelding.getTilgjengeligFraDato(),
                fangstmelding.getOpprettetTidspunkt(),
                fangstlinjeDtos);
    }
}