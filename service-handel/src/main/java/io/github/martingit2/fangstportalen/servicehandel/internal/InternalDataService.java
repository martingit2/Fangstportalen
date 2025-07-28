package io.github.martingit2.fangstportalen.servicehandel.internal;

import io.github.martingit2.fangstportalen.servicehandel.fartoy.Fartoy;
import io.github.martingit2.fangstportalen.servicehandel.organisasjon.OrganisasjonBruker;
import io.github.martingit2.fangstportalen.servicehandel.organisasjon.OrganisasjonBrukerRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class InternalDataService {

    private final OrganisasjonBrukerRepository organisasjonBrukerRepository;

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
}