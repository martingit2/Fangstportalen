package io.github.martingit2.fangstportalen.servicehandel.bud;

import io.github.martingit2.fangstportalen.servicehandel.bud.dto.*;
import io.github.martingit2.fangstportalen.servicehandel.fangstmelding.Fangstlinje;
import io.github.martingit2.fangstportalen.servicehandel.fangstmelding.Fangstmelding;
import io.github.martingit2.fangstportalen.servicehandel.fangstmelding.FangstmeldingRepository;
import io.github.martingit2.fangstportalen.servicehandel.fangstmelding.FangstmeldingStatus;
import io.github.martingit2.fangstportalen.servicehandel.ordre.Ordre;
import io.github.martingit2.fangstportalen.servicehandel.ordre.OrdreRepository;
import io.github.martingit2.fangstportalen.servicehandel.ordre.OrdreStatus;
import io.github.martingit2.fangstportalen.servicehandel.ordre.Ordrelinje;
import io.github.martingit2.fangstportalen.servicehandel.organisasjon.Organisasjon;
import io.github.martingit2.fangstportalen.servicehandel.organisasjon.OrganisasjonBruker;
import io.github.martingit2.fangstportalen.servicehandel.organisasjon.OrganisasjonBrukerId;
import io.github.martingit2.fangstportalen.servicehandel.organisasjon.OrganisasjonBrukerRepository;
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
    private final OrganisasjonBrukerRepository organisasjonBrukerRepository;

    @Transactional
    public BudResponseDto createBud(Long fangstmeldingId, Long kjoperOrganisasjonId, String kjoperBrukerId, CreateBudRequestDto dto) {
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
                .kjoperBrukerId(kjoperBrukerId)
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
        andreBud.forEach(b -> b.setStatus(BudStatus.AVVIST));
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
    public BudOversiktDto getBudOversiktForFangstmelding(Long fangstmeldingId, Long selgerOrganisasjonId) {
        Fangstmelding fangstmelding = fangstmeldingRepository.findById(fangstmeldingId)
                .orElseThrow(() -> new EntityNotFoundException("Fangstmelding ikke funnet"));

        if (!fangstmelding.getSelgerOrganisasjonId().equals(selgerOrganisasjonId)) {
            throw new AccessDeniedException("Du har ikke tilgang til å se bud på denne fangstmeldingen.");
        }

        OrganisasjonBruker selgerBruker = organisasjonBrukerRepository.findById(new OrganisasjonBrukerId(selgerOrganisasjonId, fangstmelding.getSkipperBrukerId()))
                .orElseThrow(() -> new EntityNotFoundException("Fant ikke selger-bruker"));

        KontaktinformasjonDto selgerKontakt = createKontaktinfo(selgerBruker);
        List<Bud> budListe = budRepository.findByFangstmeldingId(fangstmeldingId);
        List<BudResponseDto> budDtoer = convertToDtoList(budListe, fangstmelding);

        return new BudOversiktDto(
                fangstmelding.getId(),
                fangstmelding.getFartoy().getNavn(),
                fangstmelding.getLeveringssted(),
                fangstmelding.getTilgjengeligFraDato(),
                selgerKontakt,
                budDtoer
        );
    }

    private List<BudResponseDto> convertToDtoList(List<Bud> budListe, Fangstmelding fangstmelding) {
        if (budListe.isEmpty()) return List.of();

        List<OrganisasjonBrukerId> budgiverIds = budListe.stream()
                .map(b -> new OrganisasjonBrukerId(b.getKjoperOrganisasjonId(), b.getKjoperBrukerId()))
                .toList();

        Map<OrganisasjonBrukerId, OrganisasjonBruker> budgiverMap = organisasjonBrukerRepository.findAllById(budgiverIds).stream()
                .collect(Collectors.toMap(OrganisasjonBruker::getId, Function.identity()));

        Map<Long, Fangstlinje> fangstlinjeMap = fangstmelding.getFangstlinjer().stream()
                .collect(Collectors.toMap(Fangstlinje::getId, Function.identity()));

        return budListe.stream()
                .map(b -> {
                    OrganisasjonBrukerId id = new OrganisasjonBrukerId(b.getKjoperOrganisasjonId(), b.getKjoperBrukerId());
                    return convertToDto(b, budgiverMap.get(id), fangstlinjeMap);
                })
                .collect(Collectors.toList());
    }

    private BudResponseDto convertToDto(Bud bud) {
        OrganisasjonBrukerId id = new OrganisasjonBrukerId(bud.getKjoperOrganisasjonId(), bud.getKjoperBrukerId());
        OrganisasjonBruker kjoperBruker = organisasjonBrukerRepository.findById(id).orElse(null);
        Map<Long, Fangstlinje> fangstlinjeMap = bud.getFangstmelding().getFangstlinjer().stream()
                .collect(Collectors.toMap(Fangstlinje::getId, Function.identity()));
        return convertToDto(bud, kjoperBruker, fangstlinjeMap);
    }

    private BudResponseDto convertToDto(Bud bud, OrganisasjonBruker kjoperBruker, Map<Long, Fangstlinje> fangstlinjeMap) {
        KontaktinformasjonDto budgiverKontakt = createKontaktinfo(kjoperBruker);

        List<BudLinjeResponseDto> linjeDtos = bud.getBudLinjer().stream()
                .map(linje -> new BudLinjeResponseDto(
                        linje.getId(),
                        linje.getFangstlinjeId(),
                        fangstlinjeMap.getOrDefault(linje.getFangstlinjeId(), new Fangstlinje()).getFiskeslag(),
                        linje.getBudPrisPerKg()
                )).collect(Collectors.toList());

        double totalVerdi = bud.getBudLinjer().stream()
                .mapToDouble(linje -> {
                    Fangstlinje tilhorendeFangstlinje = fangstlinjeMap.get(linje.getFangstlinjeId());
                    if (tilhorendeFangstlinje != null) {
                        return linje.getBudPrisPerKg() * tilhorendeFangstlinje.getEstimertKvantum();
                    }
                    return 0.0;
                }).sum();

        return new BudResponseDto(
                bud.getId(),
                budgiverKontakt,
                linjeDtos,
                bud.getStatus().name(),
                bud.getOpprettetTidspunkt(),
                totalVerdi
        );
    }

    private KontaktinformasjonDto createKontaktinfo(OrganisasjonBruker bruker) {
        if (bruker == null) {
            return new KontaktinformasjonDto("Ukjent", null, "Ukjent", null, null);
        }
        Organisasjon org = bruker.getOrganisasjon();
        return new KontaktinformasjonDto(
                org.getNavn(),
                org.getTelefonnummer(),
                bruker.getNavn(),
                bruker.getTittel(),
                bruker.getTelefonnummer()
        );
    }
}