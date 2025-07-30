package io.github.martingit2.fangstportalen.servicehandel.ordre;

import io.github.martingit2.fangstportalen.servicehandel.fangstmelding.Fangstmelding;
import io.github.martingit2.fangstportalen.servicehandel.fangstmelding.FangstmeldingRepository;
import io.github.martingit2.fangstportalen.servicehandel.fangstmelding.FangstmeldingStatus;
import io.github.martingit2.fangstportalen.servicehandel.ordre.dto.CreateOrdreRequestDto;
import io.github.martingit2.fangstportalen.servicehandel.ordre.dto.OrdreResponseDto;
import io.github.martingit2.fangstportalen.servicehandel.ordre.dto.OrdrelinjeDto;
import io.github.martingit2.fangstportalen.servicehandel.organisasjon.Organisasjon;
import io.github.martingit2.fangstportalen.servicehandel.organisasjon.OrganisasjonRepository;
import io.github.martingit2.fangstportalen.servicehandel.organisasjon.OrganisasjonType;
import jakarta.persistence.EntityNotFoundException;
import jakarta.persistence.criteria.Join;
import jakarta.persistence.criteria.Predicate;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
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
                    .avtaltPrisPerKg(fangstlinje.getUtropsprisPerKg())
                    .build();
            ordre.addOrdrelinje(ordrelinje);
        });

        Ordre savedOrdre = ordreRepository.save(ordre);
        return convertToResponseDto(savedOrdre);
    }

    @Transactional
    public OrdreResponseDto createOrdre(CreateOrdreRequestDto dto, Long kjoperOrganisasjonId) {
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

        Ordre savedOrdre = ordreRepository.save(ordre);
        return convertToResponseDto(savedOrdre);
    }

    @Transactional(readOnly = true)
    public OrdreResponseDto findOrdreById(Long ordreId, Long kjoperOrganisasjonId) {
        Ordre ordre = ordreRepository.findById(ordreId)
                .orElseThrow(() -> new EntityNotFoundException("Finner ikke ordre med ID: " + ordreId));

        if (!ordre.getKjoperOrganisasjonId().equals(kjoperOrganisasjonId)) {
            throw new AccessDeniedException("Du har ikke tilgang til å se denne ordren.");
        }

        return convertToResponseDto(ordre);
    }

    @Transactional(readOnly = true)
    public Page<Ordre> findMineOrdrer(Long orgId, OrganisasjonType orgType, Pageable pageable) {
        if (orgType == OrganisasjonType.REDERI) {
            return ordreRepository.findBySelgerOrganisasjonId(orgId, pageable);
        } else {
            return ordreRepository.findByKjoperOrganisasjonId(orgId, pageable);
        }
    }

    @Transactional(readOnly = true)
    public List<OrdreResponseDto> findMineAvtalteOrdrer(Long selgerOrganisasjonId) {
        List<Ordre> ordrer = ordreRepository.findBySelgerOrganisasjonIdAndStatus(selgerOrganisasjonId, OrdreStatus.AVTALT);
        return convertToResponseDtoList(ordrer);
    }

    @Transactional(readOnly = true)
    public Page<Ordre> findTilgjengeligeOrdrer(Long ekskluderOrgId, String leveringssted, String fiskeslag, Pageable pageable) {
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

        return ordreRepository.findAll(spec, pageable);
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

        return convertToResponseDto(savedOrdre);
    }

    @Transactional
    public void deleteOrdre(Long ordreId, Long kjoperOrganisasjonId) {
        Ordre ordre = ordreRepository.findById(ordreId)
                .orElseThrow(() -> new EntityNotFoundException("Finner ikke ordre med ID: " + ordreId));

        if (!ordre.getKjoperOrganisasjonId().equals(kjoperOrganisasjonId)) {
            throw new AccessDeniedException("Du har ikke tilgang til å slette denne ordren.");
        }

        if (ordre.getStatus() != OrdreStatus.AKTIV) {
            throw new IllegalStateException("Kun aktive ordrer som ikke er akseptert kan slettes.");
        }

        ordreRepository.delete(ordre);
    }

    @Transactional
    public OrdreResponseDto updateOrdre(Long ordreId, CreateOrdreRequestDto dto, Long kjoperOrganisasjonId) {
        Ordre ordre = ordreRepository.findById(ordreId)
                .orElseThrow(() -> new EntityNotFoundException("Finner ikke ordre med ID: " + ordreId));

        if (!ordre.getKjoperOrganisasjonId().equals(kjoperOrganisasjonId)) {
            throw new AccessDeniedException("Du har ikke tilgang til å redigere denne ordren.");
        }

        if (ordre.getStatus() != OrdreStatus.AKTIV) {
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
        return convertToResponseDto(updatedOrdre);
    }

    public Page<OrdreResponseDto> convertToResponseDtoPage(Page<Ordre> ordrePage) {
        if (ordrePage.isEmpty()) {
            return Page.empty(ordrePage.getPageable());
        }

        Set<Long> orgIds = new HashSet<>();
        for (Ordre ordre : ordrePage.getContent()) {
            orgIds.add(ordre.getKjoperOrganisasjonId());
            if (ordre.getSelgerOrganisasjonId() != null) {
                orgIds.add(ordre.getSelgerOrganisasjonId());
            }
        }

        Map<Long, Organisasjon> organisasjonMap = organisasjonRepository.findAllById(orgIds).stream()
                .collect(Collectors.toMap(Organisasjon::getId, Function.identity()));

        return ordrePage.map(ordre -> convertToResponseDto(ordre, organisasjonMap));
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