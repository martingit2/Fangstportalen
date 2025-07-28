package io.github.martingit2.fangstportalen.servicehandel.ordre;

import io.github.martingit2.fangstportalen.servicehandel.fangstmelding.Fangstmelding;
import io.github.martingit2.fangstportalen.servicehandel.fangstmelding.FangstmeldingRepository;
import io.github.martingit2.fangstportalen.servicehandel.fangstmelding.FangstmeldingStatus;
import io.github.martingit2.fangstportalen.servicehandel.ordre.dto.CreateOrdreRequestDto;
import io.github.martingit2.fangstportalen.servicehandel.ordre.dto.OrdreResponseDto;
import io.github.martingit2.fangstportalen.servicehandel.ordre.dto.OrdrelinjeDto;
import io.github.martingit2.fangstportalen.servicehandel.organisasjon.Organisasjon;
import io.github.martingit2.fangstportalen.servicehandel.organisasjon.OrganisasjonRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalTime;
import java.util.List;
import java.util.Map;
import java.util.function.Function;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class OrdreService {

    private final OrdreRepository ordreRepository;
    private final FangstmeldingRepository fangstmeldingRepository;
    private final OrganisasjonRepository organisasjonRepository;
    private static final Logger logger = LoggerFactory.getLogger(OrdreService.class);

    @Transactional
    public OrdreResponseDto createOrdreFromFangstmelding(Long fangstmeldingId, Long kjoperOrganisasjonId) {
        Fangstmelding fangstmelding = fangstmeldingRepository.findById(fangstmeldingId)
                .orElseThrow(() -> new EntityNotFoundException("Fangstmelding med ID " + fangstmeldingId + " finnes ikke."));

        if (fangstmelding.getStatus() != FangstmeldingStatus.AAPEN_FOR_BUD) {
            throw new IllegalStateException("Fangstmeldingen er ikke lenger åpen for bud. Den kan allerede være solgt.");
        }

        fangstmelding.setStatus(FangstmeldingStatus.SOLGT);
        fangstmeldingRepository.save(fangstmelding);

        Ordre ordre = Ordre.builder()
                .kjoperOrganisasjonId(kjoperOrganisasjonId)
                .fangstmeldingId(fangstmelding.getId())
                .selgerOrganisasjonId(fangstmelding.getSelgerOrganisasjonId())
                .status(OrdreStatus.AVTALT)
                .leveringssted(fangstmelding.getLeveringssted())
                .forventetLeveringsdato(fangstmelding.getTilgjengeligFraDato())
                .build();

        fangstmelding.getFangstlinjer().forEach(fangstlinje -> {
            Ordrelinje ordrelinje = Ordrelinje.builder()
                    .fiskeslag(fangstlinje.getFiskeslag())
                    .forventetKvantum(fangstlinje.getEstimertKvantum())
                    .kvalitet(fangstlinje.getKvalitet())
                    .storrelse(fangstlinje.getStorrelse())
                    .avtaltPrisPerKg(0.0)
                    .build();
            ordre.addOrdrelinje(ordrelinje);
        });

        Ordre savedOrdre = ordreRepository.save(ordre);
        logger.info("Ordre med ID {} opprettet fra Fangstmelding ID {}", savedOrdre.getId(), fangstmelding.getId());
        return convertToResponseDto(savedOrdre);
    }

    @Transactional
    public OrdreResponseDto createOrdre(CreateOrdreRequestDto dto, Long kjoperOrganisasjonId) {
        logger.info("OrdreService: Bygger ordre-entitet for organisasjon {}", kjoperOrganisasjonId);

        Ordre ordre = Ordre.builder()
                .kjoperOrganisasjonId(kjoperOrganisasjonId)
                .status(OrdreStatus.AKTIV)
                .leveringssted(dto.leveringssted())
                .forventetLeveringsdato(dto.forventetLeveringsdato())
                .forventetLeveringstidFra(LocalTime.parse(dto.forventetLeveringstidFra()))
                .forventetLeveringstidTil(LocalTime.parse(dto.forventetLeveringstidTil()))
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

    @Transactional(readOnly = true)
    public OrdreResponseDto findOrdreById(Long ordreId, Long kjoperOrganisasjonId) {
        Ordre ordre = ordreRepository.findById(ordreId)
                .orElseThrow(() -> new EntityNotFoundException("Finner ikke ordre med ID: " + ordreId));

        if (!ordre.getKjoperOrganisasjonId().equals(kjoperOrganisasjonId)) {
            logger.warn("Sikkerhetsbrudd! Organisasjon {} forsøkte å hente ordre {} som tilhører {}.",
                    kjoperOrganisasjonId, ordreId, ordre.getKjoperOrganisasjonId());
            throw new AccessDeniedException("Du har ikke tilgang til å se denne ordren.");
        }

        return convertToResponseDto(ordre);
    }

    public List<OrdreResponseDto> findMineOrdrer(Long kjoperOrganisasjonId) {
        logger.info("Henter ordrer for organisasjon: {}", kjoperOrganisasjonId);
        List<Ordre> ordrer = ordreRepository.findByKjoperOrganisasjonIdOrderByOpprettetTidspunktDesc(kjoperOrganisasjonId);
        return convertToResponseDtoList(ordrer);
    }

    @Transactional(readOnly = true)
    public List<OrdreResponseDto> findMineAvtalteOrdrer(Long selgerOrganisasjonId) {
        List<Ordre> ordrer = ordreRepository.findBySelgerOrganisasjonIdAndStatus(selgerOrganisasjonId, OrdreStatus.AVTALT);
        return convertToResponseDtoList(ordrer);
    }

    @Transactional(readOnly = true)
    public List<OrdreResponseDto> findTilgjengeligeOrdrer(Long ekskluderOrgId) {
        List<Ordre> ordrer = ordreRepository.findByStatusAndFangstmeldingIdIsNullAndKjoperOrganisasjonIdNot(OrdreStatus.AKTIV, ekskluderOrgId);
        return convertToResponseDtoList(ordrer);
    }

    @Transactional
    public OrdreResponseDto aksepterOrdre(Long ordreId, Long selgerOrganisasjonId) {
        Ordre ordre = ordreRepository.findById(ordreId)
                .orElseThrow(() -> new EntityNotFoundException("Finner ikke ordre med ID: " + ordreId));

        if (ordre.getStatus() != OrdreStatus.AKTIV || ordre.getSelgerOrganisasjonId() != null) {
            throw new IllegalStateException("Ordren er ikke lenger tilgjengelig for aksept.");
        }

        ordre.setSelgerOrganisasjonId(selgerOrganisasjonId);
        ordre.setStatus(OrdreStatus.AVTALT);
        Ordre savedOrdre = ordreRepository.save(ordre);

        logger.info("Organisasjon {} aksepterte ordre {}", selgerOrganisasjonId, ordreId);
        return convertToResponseDto(savedOrdre);
    }

    @Transactional
    public void deleteOrdre(Long ordreId, Long kjoperOrganisasjonId) {
        logger.info("Forespørsel om å slette ordre {} for organisasjon {}", ordreId, kjoperOrganisasjonId);

        Ordre ordre = ordreRepository.findById(ordreId)
                .orElseThrow(() -> new EntityNotFoundException("Finner ikke ordre med ID: " + ordreId));

        if (!ordre.getKjoperOrganisasjonId().equals(kjoperOrganisasjonId)) {
            logger.warn("Sikkerhetsbrudd! Organisasjon {} forsøkte å slette ordre {} som tilhører organisasjon {}.",
                    kjoperOrganisasjonId, ordreId, ordre.getKjoperOrganisasjonId());
            throw new AccessDeniedException("Du har ikke tilgang til å slette denne ordren.");
        }

        if (ordre.getStatus() != OrdreStatus.AKTIV) {
            logger.warn("Ugyldig operasjon. Forsøkte å slette ordre {} med status {}, men kun AKTIV kan slettes.",
                    ordreId, ordre.getStatus());
            throw new IllegalStateException("Kun aktive ordrer som ikke er akseptert kan slettes.");
        }

        ordreRepository.delete(ordre);
        logger.info("Ordre {} ble slettet av organisasjon {}", ordreId, kjoperOrganisasjonId);
    }

    @Transactional
    public OrdreResponseDto updateOrdre(Long ordreId, CreateOrdreRequestDto dto, Long kjoperOrganisasjonId) {
        logger.info("Forespørsel om å oppdatere ordre {} for organisasjon {}", ordreId, kjoperOrganisasjonId);

        Ordre ordre = ordreRepository.findById(ordreId)
                .orElseThrow(() -> new EntityNotFoundException("Finner ikke ordre med ID: " + ordreId));

        if (!ordre.getKjoperOrganisasjonId().equals(kjoperOrganisasjonId)) {
            logger.warn("Sikkerhetsbrudd! Organisasjon {} forsøkte å oppdatere ordre {} som tilhører {}.",
                    kjoperOrganisasjonId, ordreId, ordre.getKjoperOrganisasjonId());
            throw new AccessDeniedException("Du har ikke tilgang til å redigere denne ordren.");
        }

        if (ordre.getStatus() != OrdreStatus.AKTIV) {
            logger.warn("Ugyldig operasjon. Forsøkte å redigere ordre {} med status {}, men kun AKTIV kan redigeres.",
                    ordreId, ordre.getStatus());
            throw new IllegalStateException("Kun aktive ordrer som ikke er akseptert kan redigeres.");
        }

        ordre.setLeveringssted(dto.leveringssted());
        ordre.setForventetLeveringsdato(dto.forventetLeveringsdato());
        ordre.setForventetLeveringstidFra(LocalTime.parse(dto.forventetLeveringstidFra()));
        ordre.setForventetLeveringstidTil(LocalTime.parse(dto.forventetLeveringstidTil()));

        ordre.getOrdrelinjer().clear();
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

        Ordre updatedOrdre = ordreRepository.save(ordre);
        logger.info("Ordre {} ble oppdatert av organisasjon {}", ordreId, kjoperOrganisasjonId);

        return convertToResponseDto(updatedOrdre);
    }

    private List<OrdreResponseDto> convertToResponseDtoList(List<Ordre> ordrer) {
        if (ordrer.isEmpty()) {
            return List.of();
        }
        List<Long> orgIds = ordrer.stream().map(Ordre::getKjoperOrganisasjonId).distinct().toList();
        Map<Long, Organisasjon> organisasjonMap = organisasjonRepository.findAllById(orgIds).stream()
                .collect(Collectors.toMap(Organisasjon::getId, Function.identity()));

        return ordrer.stream()
                .map(ordre -> {
                    Organisasjon org = organisasjonMap.get(ordre.getKjoperOrganisasjonId());
                    String orgNavn = (org != null) ? org.getNavn() : "Ukjent Kjøper";
                    return convertToResponseDto(ordre, orgNavn);
                })
                .collect(Collectors.toList());
    }

    private OrdreResponseDto convertToResponseDto(Ordre ordre) {
        String kjoperNavn = organisasjonRepository.findById(ordre.getKjoperOrganisasjonId())
                .map(Organisasjon::getNavn)
                .orElse("Ukjent Kjøper");
        return convertToResponseDto(ordre, kjoperNavn);
    }

    private OrdreResponseDto convertToResponseDto(Ordre ordre, String kjoperNavn) {
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