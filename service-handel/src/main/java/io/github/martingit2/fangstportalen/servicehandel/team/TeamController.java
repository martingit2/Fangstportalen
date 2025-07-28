package io.github.martingit2.fangstportalen.servicehandel.team;

import io.github.martingit2.fangstportalen.servicehandel.config.UserPrincipal;
import io.github.martingit2.fangstportalen.servicehandel.team.dto.InviterMedlemRequestDto;
import io.github.martingit2.fangstportalen.servicehandel.team.dto.TeamMedlemResponseDto;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/team")
@RequiredArgsConstructor
public class TeamController {

    private static final Logger log = LoggerFactory.getLogger(TeamController.class);
    private final TeamService teamService;

    @GetMapping("/medlemmer")
    @PreAuthorize("hasAnyRole('REDERI_ADMIN', 'FISKEBRUK_ADMIN')")
    public ResponseEntity<List<TeamMedlemResponseDto>> getMineTeamMedlemmer(@AuthenticationPrincipal Jwt jwt) {
        UserPrincipal principal = new UserPrincipal(jwt);
        Long organisasjonId = principal.getOrganisasjonId();
        List<TeamMedlemResponseDto> medlemmer = teamService.getTeamMedlemmerForOrganisasjon(organisasjonId);
        return ResponseEntity.ok(medlemmer);
    }

    @PostMapping("/inviter")
    @PreAuthorize("hasAnyRole('REDERI_ADMIN', 'FISKEBRUK_ADMIN')")
    public ResponseEntity<Void> inviterNyttMedlem(
            @Valid @RequestBody InviterMedlemRequestDto dto,
            @AuthenticationPrincipal Jwt jwt) {
        log.info("Mottok invitasjonsforespørsel for e-post: {}", dto.email());
        UserPrincipal principal = new UserPrincipal(jwt);
        teamService.inviterMedlem(dto, principal.getOrganisasjonId());
        return ResponseEntity.ok().build();
    }
}