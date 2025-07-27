package io.github.martingit2.fangstportalen.servicehandel.internal;

import io.github.martingit2.fangstportalen.servicehandel.organisasjon.OrganisasjonBruker;
import io.github.martingit2.fangstportalen.servicehandel.organisasjon.OrganisasjonBrukerRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class InternalDataService {

    private final OrganisasjonBrukerRepository organisasjonBrukerRepository;

    public Optional<UserClaimsResponseDto> findUserClaims(String brukerId) {
        Optional<OrganisasjonBruker> orgBrukerOpt = organisasjonBrukerRepository.findById_BrukerId(brukerId);

        return orgBrukerOpt.map(orgBruker -> new UserClaimsResponseDto(
                orgBruker.getOrganisasjon().getId(),
                orgBruker.getOrganisasjon().getNavn(),
                orgBruker.getOrganisasjon().getType().name(),
                Collections.singletonList(orgBruker.getRolle().name())
        ));
    }
}