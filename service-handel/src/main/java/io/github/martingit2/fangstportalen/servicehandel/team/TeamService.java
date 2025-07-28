package io.github.martingit2.fangstportalen.servicehandel.team;

import io.github.martingit2.fangstportalen.servicehandel.auth0.Auth0ManagementService;
import io.github.martingit2.fangstportalen.servicehandel.organisasjon.*;
import io.github.martingit2.fangstportalen.servicehandel.team.dto.InviterMedlemRequestDto;
import io.github.martingit2.fangstportalen.servicehandel.team.dto.TeamMedlemResponseDto;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.IOException;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TeamService {

    private final OrganisasjonBrukerRepository organisasjonBrukerRepository;
    private final OrganisasjonRepository organisasjonRepository;
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
            auth0ManagementService.createInvitation(dto.email(), organisasjon.getId(), organisasjon.getType().name(), dto.roller());
        } catch (IOException e) {
            throw new RuntimeException("Klarte ikke å sende invitasjon via Auth0", e);
        }
    }

    private void validateRoles(Set<String> roller, OrganisasjonType type) {
        boolean invalidRoleFound = roller.stream().anyMatch(rolle -> !rolle.startsWith(type.name()));
        if (invalidRoleFound) {
            throw new IllegalArgumentException("En eller flere roller er ugyldige for denne organisasjonstypen.");
        }
    }

    private TeamMedlemResponseDto convertToDto(OrganisasjonBruker medlem) {
        return new TeamMedlemResponseDto(
                medlem.getId().getBrukerId(),
                medlem.getRoller().stream().map(BrukerRolle::name).collect(Collectors.toSet())
        );
    }
}