package io.github.martingit2.fangstportalen.servicehandel.bruker;

import io.github.martingit2.fangstportalen.servicehandel.organisasjon.*;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service @RequiredArgsConstructor
public class BrukerService {
    private final OrganisasjonBrukerRepository brukerRepository;
    @Transactional(readOnly = true)
    public MinProfilDto getMinProfil(Long orgId, String brukerId) {
        OrganisasjonBruker bruker = finnBruker(orgId, brukerId);
        return new MinProfilDto(bruker.getNavn(), bruker.getTittel(), bruker.getTelefonnummer());
    }
    @Transactional
    public MinProfilDto oppdaterMinProfil(Long orgId, String brukerId, OppdaterMinProfilDto dto) {
        OrganisasjonBruker bruker = finnBruker(orgId, brukerId);
        bruker.setNavn(dto.navn());
        bruker.setTittel(dto.tittel());
        bruker.setTelefonnummer(dto.telefonnummer());
        OrganisasjonBruker savedBruker = brukerRepository.save(bruker);
        return new MinProfilDto(savedBruker.getNavn(), savedBruker.getTittel(), savedBruker.getTelefonnummer());
    }
    private OrganisasjonBruker finnBruker(Long orgId, String brukerId) {
        return brukerRepository.findById(new OrganisasjonBrukerId(orgId, brukerId))
                .orElseThrow(() -> new EntityNotFoundException("Brukerprofil ikke funnet."));
    }
}