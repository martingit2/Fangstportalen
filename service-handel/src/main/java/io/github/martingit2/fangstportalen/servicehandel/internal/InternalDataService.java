package io.github.martingit2.fangstportalen.servicehandel.internal;

import io.github.martingit2.fangstportalen.servicehandel.fartoy.Fartoy;
import io.github.martingit2.fangstportalen.servicehandel.organisasjon.*;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class InternalDataService {

    private final OrganisasjonBrukerRepository organisasjonBrukerRepository;
    private final OrganisasjonRepository organisasjonRepository;

    public Optional<UserClaimsResponseDto> findUserClaims(String brukerId) {
        Optional<OrganisasjonBruker> orgBrukerOpt = organisasjonBrukerRepository.findById_BrukerId(brukerId);

        return orgBrukerOpt.map(orgBruker -> {
            Long fartoyId = Optional.ofNullable(orgBruker.getTildeltFartoy())
                    .map(Fartoy::getId)
                    .orElse(null);

            List<String> rolleNavn = orgBruker.getRoller().stream()
                    .map(Enum::name)
                    .collect(Collectors.toList());

            return new UserClaimsResponseDto(
                    orgBruker.getOrganisasjon().getId(),
                    orgBruker.getOrganisasjon().getNavn(),
                    orgBruker.getOrganisasjon().getType().name(),
                    rolleNavn,
                    fartoyId
            );
        });
    }

    @Transactional
    public void onboardInvitedUser(InvitedUserDto dto) {
        Organisasjon org = organisasjonRepository.findById(dto.organisasjonId())
                .orElseThrow(() -> new EntityNotFoundException("Organisasjon ikke funnet for onboarding"));

        Set<BrukerRolle> roller = dto.roller().stream()
                .map(BrukerRolle::valueOf)
                .collect(Collectors.toSet());

        OrganisasjonBruker nyBruker = OrganisasjonBruker.builder()
                .id(new OrganisasjonBrukerId(dto.organisasjonId(), dto.brukerId()))
                .organisasjon(org)
                .roller(roller)
                .build();

        organisasjonBrukerRepository.save(nyBruker);
    }
}