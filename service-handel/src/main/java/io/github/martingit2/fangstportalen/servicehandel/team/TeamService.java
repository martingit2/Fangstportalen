package io.github.martingit2.fangstportalen.servicehandel.team;

import io.github.martingit2.fangstportalen.servicehandel.auth0.Auth0ManagementService;
import io.github.martingit2.fangstportalen.servicehandel.fartoy.Fartoy;
import io.github.martingit2.fangstportalen.servicehandel.fartoy.FartoyRepository;
import io.github.martingit2.fangstportalen.servicehandel.organisasjon.*;
import io.github.martingit2.fangstportalen.servicehandel.team.dto.InviterMedlemRequestDto;
import io.github.martingit2.fangstportalen.servicehandel.team.dto.TeamMedlemResponseDto;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.io.IOException;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TeamService {

    private final OrganisasjonBrukerRepository organisasjonBrukerRepository;
    private final OrganisasjonRepository organisasjonRepository;
    private final FartoyRepository fartoyRepository;
    private final Auth0ManagementService auth0ManagementService;

    @Transactional(readOnly = true)
    public List<TeamMedlemResponseDto> getTeamMedlemmerForOrganisasjon(Long organisasjonId) {
        List<OrganisasjonBruker> medlemmer = organisasjonBrukerRepository.finnAlleForOrganisasjon(organisasjonId);
        return medlemmer.stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    @Transactional
    public void inviterMedlem(InviterMedlemRequestDto dto, Long adminOrganisasjonId) {
        Organisasjon organisasjon = organisasjonRepository.findById(adminOrganisasjonId)
                .orElseThrow(() -> new EntityNotFoundException("Finner ikke organisasjon med ID: " + adminOrganisasjonId));

        validateRoles(dto.roller(), organisasjon.getType());

        try {
            auth0ManagementService.createInvitation(dto.email(), organisasjon.getId(), dto.roller());
        } catch (IOException e) {
            if (e.getMessage().contains("Bruker med denne e-posten eksisterer allerede.")) {
                throw new ResponseStatusException(HttpStatus.CONFLICT, "En bruker med denne e-postadressen finnes allerede.");
            }
            throw new RuntimeException("Klarte ikke å sende invitasjon via Auth0", e);
        }
    }

    @Transactional
    public void tildelFartoyTilSkipper(String brukerId, Long fartoyId, Long adminOrganisasjonId) {
        OrganisasjonBruker skipper = finnSkipper(brukerId, adminOrganisasjonId);
        Fartoy fartoy = fartoyRepository.findById(fartoyId)
                .orElseThrow(() -> new EntityNotFoundException("Fartøy ikke funnet med ID: " + fartoyId));

        if (!fartoy.getEierOrganisasjon().getId().equals(adminOrganisasjonId)) {
            throw new AccessDeniedException("Fartøyet tilhører ikke din organisasjon.");
        }
        skipper.setTildeltFartoy(fartoy);
        organisasjonBrukerRepository.save(skipper);
    }

    @Transactional
    public void fjernFartoyFraSkipper(String brukerId, Long adminOrganisasjonId) {
        OrganisasjonBruker skipper = finnSkipper(brukerId, adminOrganisasjonId);
        skipper.setTildeltFartoy(null);
        organisasjonBrukerRepository.save(skipper);
    }

    private OrganisasjonBruker finnSkipper(String brukerId, Long adminOrganisasjonId) {
        OrganisasjonBruker skipper = organisasjonBrukerRepository.findById(new OrganisasjonBrukerId(adminOrganisasjonId, brukerId))
                .orElseThrow(() -> new EntityNotFoundException("Bruker ikke funnet i din organisasjon."));

        if (!skipper.getRoller().contains(BrukerRolle.REDERI_SKIPPER)) {
            throw new IllegalArgumentException("Kan kun tildele fartøy til brukere med rollen REDERI_SKIPPER.");
        }
        return skipper;
    }

    private void validateRoles(Set<String> roller, OrganisasjonType type) {
        boolean invalidRoleFound = roller.stream().anyMatch(rolle -> !rolle.startsWith(type.name()));
        if (invalidRoleFound) {
            throw new IllegalArgumentException("En eller flere roller er ugyldige for denne organisasjonstypen.");
        }
    }

    private TeamMedlemResponseDto convertToDto(OrganisasjonBruker medlem) {
        Long tildeltFartoyId = null;
        String tildeltFartoyNavn = null;

        if (medlem.getTildeltFartoy() != null) {
            tildeltFartoyId = medlem.getTildeltFartoy().getId();
            tildeltFartoyNavn = medlem.getTildeltFartoy().getNavn();
        }

        return new TeamMedlemResponseDto(
                medlem.getId().getBrukerId(),
                medlem.getRoller().stream().map(BrukerRolle::name).collect(Collectors.toSet()),
                tildeltFartoyId,
                tildeltFartoyNavn
        );
    }
}