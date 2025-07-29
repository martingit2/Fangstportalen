package io.github.martingit2.fangstportalen.servicehandel.organisasjon;

import io.github.martingit2.fangstportalen.servicehandel.organisasjon.dto.OppdaterOrganisasjonDto;
import io.github.martingit2.fangstportalen.servicehandel.organisasjon.dto.OrganisasjonDetaljerDto;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class OrganisasjonService {

    private final OrganisasjonRepository organisasjonRepository;

    @Transactional(readOnly = true)
    public OrganisasjonDetaljerDto getMinOrganisasjon(Long orgId) {
        Organisasjon org = finnOrg(orgId);
        return new OrganisasjonDetaljerDto(
                org.getNavn(),
                org.getOrganisasjonsnummer(),
                org.getTelefonnummer(),
                org.getAdresse(),
                org.getPostnummer(),
                org.getPoststed()
        );
    }

    @Transactional
    public OrganisasjonDetaljerDto oppdaterMinOrganisasjon(Long orgId, OppdaterOrganisasjonDto dto) {
        Organisasjon org = finnOrg(orgId);
        org.setNavn(dto.navn());
        org.setTelefonnummer(dto.telefonnummer());
        org.setAdresse(dto.adresse());
        org.setPostnummer(dto.postnummer());
        org.setPoststed(dto.poststed());
        Organisasjon savedOrg = organisasjonRepository.save(org);
        return new OrganisasjonDetaljerDto(
                savedOrg.getNavn(),
                savedOrg.getOrganisasjonsnummer(),
                savedOrg.getTelefonnummer(),
                savedOrg.getAdresse(),
                savedOrg.getPostnummer(),
                savedOrg.getPoststed()
        );
    }

    private Organisasjon finnOrg(Long orgId) {
        return organisasjonRepository.findById(orgId)
                .orElseThrow(() -> new EntityNotFoundException("Organisasjon ikke funnet."));
    }
}