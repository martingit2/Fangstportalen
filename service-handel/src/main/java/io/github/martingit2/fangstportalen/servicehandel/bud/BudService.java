package io.github.martingit2.fangstportalen.servicehandel.bud;

import io.github.martingit2.fangstportalen.servicehandel.bud.dto.BudResponseDto;
import io.github.martingit2.fangstportalen.servicehandel.bud.dto.CreateBudRequestDto;
import io.github.martingit2.fangstportalen.servicehandel.fangstmelding.Fangstmelding;
import io.github.martingit2.fangstportalen.servicehandel.fangstmelding.FangstmeldingRepository;
import io.github.martingit2.fangstportalen.servicehandel.fangstmelding.FangstmeldingStatus;
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
                .budPrisPerKg(dto.budPrisPerKg())
                .status(BudStatus.AKTIV)
                .build();

        Bud savedBud = budRepository.save(bud);
        return convertToDto(savedBud);
    }

    @Transactional(readOnly = true)
    public List<BudResponseDto> getBudForFangstmelding(Long fangstmeldingId, Long selgerOrganisasjonId) {
        Fangstmelding fangstmelding = fangstmeldingRepository.findById(fangstmeldingId)
                .orElseThrow(() -> new EntityNotFoundException("Fangstmelding ikke funnet"));

        if (!fangstmelding.getSelgerOrganisasjonId().equals(selgerOrganisasjonId)) {
            throw new AccessDeniedException("Du har ikke tilgang til å se bud på denne fangstmeldingen.");
        }

        List<Bud> bud = budRepository.findByFangstmeldingId(fangstmeldingId);
        return convertToDtoList(bud);
    }

    private List<BudResponseDto> convertToDtoList(List<Bud> bud) {
        if (bud.isEmpty()) {
            return List.of();
        }
        Set<Long> orgIds = bud.stream().map(Bud::getKjoperOrganisasjonId).collect(Collectors.toSet());
        Map<Long, Organisasjon> organisasjonMap = organisasjonRepository.findAllById(orgIds).stream()
                .collect(Collectors.toMap(Organisasjon::getId, Function.identity()));

        return bud.stream()
                .map(b -> convertToDto(b, organisasjonMap.get(b.getKjoperOrganisasjonId())))
                .collect(Collectors.toList());
    }

    private BudResponseDto convertToDto(Bud bud) {
        Organisasjon kjoper = organisasjonRepository.findById(bud.getKjoperOrganisasjonId()).orElse(null);
        return convertToDto(bud, kjoper);
    }

    private BudResponseDto convertToDto(Bud bud, Organisasjon kjoper) {
        String kjoperNavn = (kjoper != null) ? kjoper.getNavn() : "Ukjent Kjøper";
        return new BudResponseDto(
                bud.getId(),
                kjoperNavn,
                bud.getBudPrisPerKg(),
                bud.getStatus().name(),
                bud.getOpprettetTidspunkt()
        );
    }
}