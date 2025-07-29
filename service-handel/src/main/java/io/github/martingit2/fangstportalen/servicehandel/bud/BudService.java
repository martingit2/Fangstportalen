package io.github.martingit2.fangstportalen.servicehandel.bud;

import io.github.martingit2.fangstportalen.servicehandel.bud.dto.BudLinjeResponseDto;
import io.github.martingit2.fangstportalen.servicehandel.bud.dto.BudResponseDto;
import io.github.martingit2.fangstportalen.servicehandel.bud.dto.CreateBudRequestDto;
import io.github.martingit2.fangstportalen.servicehandel.fangstmelding.Fangstlinje;
import io.github.martingit2.fangstportalen.servicehandel.fangstmelding.Fangstmelding;
import io.github.martingit2.fangstportalen.servicehandel.fangstmelding.FangstmeldingRepository;
import io.github.martingit2.fangstportalen.servicehandel.fangstmelding.FangstmeldingStatus;
import io.github.martingit2.fangstportalen.servicehandel.ordre.Ordre;
import io.github.martingit2.fangstportalen.servicehandel.ordre.OrdreRepository;
import io.github.martingit2.fangstportalen.servicehandel.ordre.OrdreStatus;
import io.github.martingit2.fangstportalen.servicehandel.ordre.Ordrelinje;
import io.github.martingit2.fangstportalen.servicehandel.organisasjon.Organisasjon;
import io.github.martingit2.fangstportalen.servicehandel.organisasjon.OrganisasjonRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.function.Function;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class BudService {

    private final BudRepository budRepository;
    private final FangstmeldingRepository fangstmeldingRepository;
    private final OrganisasjonRepository organisasjonRepository;
    private final OrdreRepository ordreRepository;

    @Transactional
    public BudResponseDto createBud(Long fangstmeldingId, Long kjoperOrganisasjonId, CreateBudRequestDto dto) {
        Fangstmelding fangstmelding = fangstmeldingRepository.findById(fangstmeldingId)
                .orElseThrow(() -> new EntityNotFoundException("Fangstmelding ikke funnet"));

        if (fangstmelding.getStatus() != FangstmeldingStatus.AAPEN_FOR_BUD) {
            throw new IllegalStateException("Denne fangstmeldingen er ikke lenger åpen for bud.");
        }
        if (fangstmelding.getSelgerOrganisasjonId().equals(kjoperOrganisasjonId)) {
            throw new IllegalArgumentException("Kan ikke gi bud på egen fangstmelding.");
        }

        Bud bud = Bud.builder()
                .fangstmelding(fangstmelding)
                .kjoperOrganisasjonId(kjoperOrganisasjonId)
                .status(BudStatus.AKTIV)
                .build();

        dto.budLinjer().forEach(linjeDto -> {
            BudLinje budLinje = BudLinje.builder()
                    .fangstlinjeId(linjeDto.fangstlinjeId())
                    .budPrisPerKg(linjeDto.budPrisPerKg())
                    .build();
            bud.addBudLinje(budLinje);
        });

        Bud savedBud = budRepository.save(bud);
        return convertToDto(savedBud);
    }

    @Transactional
    public Ordre aksepterBud(Long budId, Long selgerOrganisasjonId, String selgerBrukerId) {
        Bud akseptertBud = budRepository.findById(budId)
                .orElseThrow(() -> new EntityNotFoundException("Bud ikke funnet"));

        Fangstmelding fangstmelding = akseptertBud.getFangstmelding();

        if (!fangstmelding.getSelgerOrganisasjonId().equals(selgerOrganisasjonId)) {
            throw new AccessDeniedException("Du eier ikke fangstmeldingen dette budet tilhører.");
        }
        if (fangstmelding.getStatus() != FangstmeldingStatus.AAPEN_FOR_BUD) {
            throw new IllegalStateException("Fangstmeldingen er ikke lenger åpen for bud.");
        }
        if (akseptertBud.getStatus() != BudStatus.AKTIV) {
            throw new IllegalStateException("Dette budet er ikke lenger aktivt.");
        }

        akseptertBud.setStatus(BudStatus.AKSEPTERT);
        fangstmelding.setStatus(FangstmeldingStatus.SOLGT);

        List<Bud> andreBud = budRepository.findByFangstmeldingIdAndIdNot(fangstmelding.getId(), budId);
        andreBud.forEach(bud -> bud.setStatus(BudStatus.AVVIST));
        budRepository.saveAll(andreBud);

        Map<Long, Fangstlinje> fangstlinjeMap = fangstmelding.getFangstlinjer().stream()
                .collect(Collectors.toMap(Fangstlinje::getId, Function.identity()));

        Ordre ordre = Ordre.builder()
                .fangstmeldingId(fangstmelding.getId())
                .kjoperOrganisasjonId(akseptertBud.getKjoperOrganisasjonId())
                .selgerOrganisasjonId(selgerOrganisasjonId)
                .selgerBrukerId(selgerBrukerId)
                .status(OrdreStatus.AVTALT)
                .leveringssted(fangstmelding.getLeveringssted())
                .forventetLeveringsdato(fangstmelding.getTilgjengeligFraDato())
                .build();

        for (BudLinje budLinje : akseptertBud.getBudLinjer()) {
            Fangstlinje fangstlinje = fangstlinjeMap.get(budLinje.getFangstlinjeId());
            Ordrelinje ordrelinje = Ordrelinje.builder()
                    .fiskeslag(fangstlinje.getFiskeslag())
                    .kvalitet(fangstlinje.getKvalitet())
                    .storrelse(fangstlinje.getStorrelse())
                    .forventetKvantum(fangstlinje.getEstimertKvantum())
                    .avtaltPrisPerKg(budLinje.getBudPrisPerKg())
                    .build();
            ordre.addOrdrelinje(ordrelinje);
        }

        return ordreRepository.save(ordre);
    }

    @Transactional(readOnly = true)
    public List<BudResponseDto> getBudForFangstmelding(Long fangstmeldingId, Long selgerOrganisasjonId) {
        Fangstmelding fangstmelding = fangstmeldingRepository.findById(fangstmeldingId)
                .orElseThrow(() -> new EntityNotFoundException("Fangstmelding ikke funnet"));

        if (!fangstmelding.getSelgerOrganisasjonId().equals(selgerOrganisasjonId)) {
            throw new AccessDeniedException("Du har ikke tilgang til å se bud på denne fangstmeldingen.");
        }

        List<Bud> bud = budRepository.findByFangstmeldingId(fangstmeldingId);
        return convertToDtoList(bud, fangstmelding);
    }

    private List<BudResponseDto> convertToDtoList(List<Bud> bud, Fangstmelding fangstmelding) {
        if (bud.isEmpty()) return List.of();

        Set<Long> orgIds = bud.stream().map(Bud::getKjoperOrganisasjonId).collect(Collectors.toSet());
        Map<Long, Organisasjon> organisasjonMap = organisasjonRepository.findAllById(orgIds).stream()
                .collect(Collectors.toMap(Organisasjon::getId, Function.identity()));

        Map<Long, String> fangstlinjeFiskeslagMap = fangstmelding.getFangstlinjer().stream()
                .collect(Collectors.toMap(Fangstlinje::getId, Fangstlinje::getFiskeslag));

        return bud.stream()
                .map(b -> convertToDto(b, organisasjonMap.get(b.getKjoperOrganisasjonId()), fangstlinjeFiskeslagMap))
                .collect(Collectors.toList());
    }

    private BudResponseDto convertToDto(Bud bud) {
        Organisasjon kjoper = organisasjonRepository.findById(bud.getKjoperOrganisasjonId()).orElse(null);
        Map<Long, String> fangstlinjeFiskeslagMap = bud.getFangstmelding().getFangstlinjer().stream()
                .collect(Collectors.toMap(Fangstlinje::getId, Fangstlinje::getFiskeslag));
        return convertToDto(bud, kjoper, fangstlinjeFiskeslagMap);
    }

    private BudResponseDto convertToDto(Bud bud, Organisasjon kjoper, Map<Long, String> fiskeslagMap) {
        String kjoperNavn = (kjoper != null) ? kjoper.getNavn() : "Ukjent Kjøper";

        List<BudLinjeResponseDto> linjeDtos = bud.getBudLinjer().stream()
                .map(linje -> new BudLinjeResponseDto(
                        linje.getId(),
                        linje.getFangstlinjeId(),
                        fiskeslagMap.getOrDefault(linje.getFangstlinjeId(), "Ukjent fiskeslag"),
                        linje.getBudPrisPerKg()
                )).collect(Collectors.toList());

        return new BudResponseDto(
                bud.getId(),
                kjoperNavn,
                linjeDtos,
                bud.getStatus().name(),
                bud.getOpprettetTidspunkt()
        );
    }
}