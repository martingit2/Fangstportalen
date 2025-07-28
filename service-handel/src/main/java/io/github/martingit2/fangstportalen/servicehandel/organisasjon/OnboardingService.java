package io.github.martingit2.fangstportalen.servicehandel.organisasjon;

import io.github.martingit2.fangstportalen.servicehandel.fartoy.Fartoy;
import io.github.martingit2.fangstportalen.servicehandel.fartoy.FartoyRepository;
import io.github.martingit2.fangstportalen.servicehandel.organisasjon.dto.OnboardingRequestDto;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Set;

@Service
@RequiredArgsConstructor
public class OnboardingService {

    private final OrganisasjonRepository organisasjonRepository;
    private final FartoyRepository fartoyRepository;
    private final OrganisasjonBrukerRepository organisasjonBrukerRepository;

    @Transactional
    public void onboardNewOrganisasjon(OnboardingRequestDto dto, String adminBrukerId) {
        if (organisasjonBrukerRepository.findById_BrukerId(adminBrukerId).isPresent()) {
            throw new IllegalStateException("Bruker er allerede medlem av en organisasjon.");
        }

        Organisasjon organisasjon = Organisasjon.builder()
                .navn(dto.navn())
                .organisasjonsnummer(dto.organisasjonsnummer())
                .type(dto.type())
                .build();
        Organisasjon savedOrganisasjon = organisasjonRepository.save(organisasjon);

        Fartoy forsteFartoy = null;
        if (dto.type() == OrganisasjonType.REDERI && dto.fartoy() != null && !dto.fartoy().isEmpty()) {
            var fartoyDto = dto.fartoy().get(0);
            Fartoy fartoy = Fartoy.builder()
                    .eierOrganisasjon(savedOrganisasjon)
                    .navn(fartoyDto.navn())
                    .fiskerimerke(fartoyDto.fiskerimerke())
                    .kallesignal(fartoyDto.kallesignal())
                    .build();
            forsteFartoy = fartoyRepository.save(fartoy);
        }

        Set<BrukerRolle> startRoller;
        if (dto.type() == OrganisasjonType.REDERI) {
            startRoller = Set.of(BrukerRolle.REDERI_ADMIN, BrukerRolle.REDERI_SKIPPER);
        } else {
            startRoller = Set.of(BrukerRolle.FISKEBRUK_ADMIN, BrukerRolle.FISKEBRUK_INNKJOPER);
        }

        OrganisasjonBruker adminLink = OrganisasjonBruker.builder()
                .id(new OrganisasjonBrukerId(savedOrganisasjon.getId(), adminBrukerId))
                .organisasjon(savedOrganisasjon)
                .roller(startRoller)
                .tildeltFartoy(forsteFartoy)
                .build();
        organisasjonBrukerRepository.save(adminLink);
    }
}