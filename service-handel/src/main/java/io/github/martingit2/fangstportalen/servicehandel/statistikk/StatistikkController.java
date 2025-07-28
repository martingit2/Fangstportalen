package io.github.martingit2.fangstportalen.servicehandel.statistikk;

import io.github.martingit2.fangstportalen.servicehandel.config.UserPrincipal;
import io.github.martingit2.fangstportalen.servicehandel.organisasjon.OrganisasjonType;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/v1/statistikk")
@RequiredArgsConstructor
public class StatistikkController {

    private final StatistikkService statistikkService;

    @GetMapping("/oversikt")
    @PreAuthorize("hasRole('REDERI_SKIPPER') or hasRole('FISKEBRUK_INNKJOPER')")
    public ResponseEntity<StatistikkResponseDto> getStatistikkOversikt(@AuthenticationPrincipal Jwt jwt) {
        UserPrincipal principal = new UserPrincipal(jwt);
        Long orgId = principal.getOrganisasjonId();

        Map<String, Object> claims = jwt.getClaimAsMap("https://fangstportalen.no/claims");
        OrganisasjonType orgType = OrganisasjonType.valueOf((String) claims.get("org_type"));

        StatistikkResponseDto statistikk = statistikkService.beregnStatistikkForOrganisasjon(orgId, orgType);
        return ResponseEntity.ok(statistikk);
    }
}