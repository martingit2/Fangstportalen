package io.github.martingit2.fangstportalen.servicehandel.ordre;

import io.github.martingit2.fangstportalen.servicehandel.fartoy.Fartoy;
import io.github.martingit2.fangstportalen.servicehandel.fangstmelding.Fangstmelding;
import io.github.martingit2.fangstportalen.servicehandel.fangstmelding.FangstmeldingRepository;
import io.github.martingit2.fangstportalen.servicehandel.fangstmelding.FangstmeldingStatus;
import io.github.martingit2.fangstportalen.servicehandel.ordre.dto.CreateOrdreRequestDto;
import io.github.martingit2.fangstportalen.servicehandel.ordre.dto.OrdreResponseDto;
import io.github.martingit2.fangstportalen.servicehandel.ordre.dto.OrdrelinjeDto;
import io.github.martingit2.fangstportalen.servicehandel.organisasjon.Organisasjon;
import io.github.martingit2.fangstportalen.servicehandel.organisasjon.OrganisasjonBruker;
import io.github.martingit2.fangstportalen.servicehandel.organisasjon.OrganisasjonBrukerRepository;
import io.github.martingit2.fangstportalen.servicehandel.organisasjon.OrganisasjonRepository;
import io.github.martingit2.fangstportalen.servicehandel.organisasjon.OrganisasjonType;
import jakarta.persistence.EntityNotFoundException;
import jakarta.persistence.criteria.Join;
import jakarta.persistence.criteria.Predicate;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import java.time.LocalTime;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.function.Function;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class OrdreService {

    private final OrdreRepository ordreRepository;
    private final FangstmeldingRepository fangstmeldingRepository;
    private final OrganisasjonRepository organisasjonRepository;
    private final OrganisasjonBrukerRepository organisasjonBrukerRepository;
    private static final Logger logger = LoggerFactory.getLogger(OrdreService.class);

    @Transactional
    public OrdreResponseDto createOrdreFromFangstmelding(Long fangstmeldingId, Long kjoperOrganisasjonId) {
        Fangstmelding fangstmelding = fangstmeldingRepository.findById(fangstmeldingId)
                .orElseThrow(() -> new EntityNotFoundException("Fangstmelding med ID " + fangstmeldingId + " finnes ikke."));

        if (fangstmelding.getStatus() != FangstmeldingStatus.AAPEN_FOR_BUD) {
            throw new IllegalStateException("Fangstmeldingen er ikke lenger åpen for bud. Den kan allerede være solgt.");
        }

        fangstmelding.setStatus(FangstmeldingStatus.SOLGT);

        Ordre ordre = Ordre.builder()
                .kjoperOrganisasjonId(kjoperOrganisasjonId)
                .fangstmeldingId(fangstmelding.getId())
                .selgerOrganisasjonId(fangstmelding.getSelgerOrganisasjonId())
                .selgerBrukerId(fangstmelding.getSkipperBrukerId())
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
                    .avtaltPrisPerKg(fangstlinje.getUtropsprisPerKg()) // Bruker utropspris som default
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

    @Transactional(readOnly = true)
    public List<OrdreResponseDto> findMineOrdrer(Long orgId, OrganisasjonType orgType) {
        logger.info("Henter ordrer for organisasjon: {} av type {}", orgId, orgType);
        List<Ordre> ordrer;
        if (orgType == OrganisasjonType.REDERI) {
            ordrer = ordreRepository.findBySelgerOrganisasjonIdOrderByOpprettetTidspunktDesc(orgId);
        } else {
            ordrer = ordreRepository.findByKjoperOrganisasjonIdOrderByOpprettetTidspunktDesc(orgId);
        }
        return convertToResponseDtoList(ordrer);
    }

    @Transactional(readOnly = true)
    public List<OrdreResponseDto> findMineAvtalteOrdrer(Long selgerOrganisasjonId) {
        List<Ordre> ordrer = ordreRepository.findBySelgerOrganisasjonIdAndStatus(selgerOrganisasjonId, OrdreStatus.AVTALT);
        return convertToResponseDtoList(ordrer);
    }

    @Transactional(readOnly = true)
    public List<OrdreResponseDto> findTilgjengeligeOrdrer(Long ekskluderOrgId, String leveringssted, String fiskeslag) {
        Specification<Ordre> spec = (root, query, criteriaBuilder) -> {
            List<Predicate> predicates = new ArrayList<>();
            predicates.add(criteriaBuilder.equal(root.get("status"), OrdreStatus.AKTIV));
            predicates.add(criteriaBuilder.isNull(root.get("fangstmeldingId")));
            predicates.add(criteriaBuilder.notEqual(root.get("kjoperOrganisasjonId"), ekskluderOrgId));

            if (StringUtils.hasText(leveringssted)) {
                predicates.add(criteriaBuilder.like(criteriaBuilder.lower(root.get("leveringssted")), "%" + leveringssted.toLowerCase() + "%"));
            }
            if (StringUtils.hasText(fiskeslag)) {
                Join<Ordre, Ordrelinje> ordrelinjeJoin = root.join("ordrelinjer");
                predicates.add(criteriaBuilder.like(criteriaBuilder.lower(ordrelinjeJoin.get("fiskeslag")), "%" + fiskeslag.toLowerCase() + "%"));
                query.distinct(true);
            }
            return criteriaBuilder.and(predicates.toArray(new Predicate[0]));
        };

        List<Ordre> ordrer = ordreRepository.findAll(spec);
        return convertToResponseDtoList(ordrer);
    }

    @Transactional
    public OrdreResponseDto aksepterOrdre(Long ordreId, Long selgerOrganisasjonId, String selgerBrukerId) {
        Ordre ordre = ordreRepository.findById(ordreId)
                .orElseThrow(() -> new EntityNotFoundException("Finner ikke ordre med ID: " + ordreId));

        if (ordre.getStatus() != OrdreStatus.AKTIV || ordre.getSelgerOrganisasjonId() != null) {
            throw new IllegalStateException("Ordren er ikke lenger tilgjengelig for aksept.");
        }

        ordre.setSelgerOrganisasjonId(selgerOrganisasjonId);
        ordre.setSelgerBrukerId(selgerBrukerId);
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

        Set<Long> orgIds = new HashSet<>();
        for (Ordre ordre : ordrer) {
            orgIds.add(ordre.getKjoperOrganisasjonId());
            if (ordre.getSelgerOrganisasjonId() != null) {
                orgIds.add(ordre.getSelgerOrganisasjonId());
            }
        }

        Map<Long, Organisasjon> organisasjonMap = organisasjonRepository.findAllById(orgIds).stream()
                .collect(Collectors.toMap(Organisasjon::getId, Function.identity()));

        return ordrer.stream()
                .map(ordre -> convertToResponseDto(ordre, organisasjonMap))
                .collect(Collectors.toList());
    }

    private OrdreResponseDto convertToResponseDto(Ordre ordre) {
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