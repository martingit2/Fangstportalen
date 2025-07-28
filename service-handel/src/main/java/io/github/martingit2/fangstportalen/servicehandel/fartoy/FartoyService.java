package io.github.martingit2.fangstportalen.servicehandel.fartoy;

import io.github.martingit2.fangstportalen.servicehandel.fartoy.dto.CreateFartoyRequestDto;
import io.github.martingit2.fangstportalen.servicehandel.fartoy.dto.FartoyResponseDto;
import io.github.martingit2.fangstportalen.servicehandel.organisasjon.Organisasjon;
import io.github.martingit2.fangstportalen.servicehandel.organisasjon.OrganisasjonRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class FartoyService {

    private final FartoyRepository fartoyRepository;
    private final OrganisasjonRepository organisasjonRepository;

    @Transactional
    public FartoyResponseDto createFartoy(CreateFartoyRequestDto dto, Long eierOrganisasjonId) {
        Organisasjon eier = organisasjonRepository.findById(eierOrganisasjonId)
                .orElseThrow(() -> new EntityNotFoundException("Organisasjon ikke funnet med ID: " + eierOrganisasjonId));

        Fartoy fartoy = Fartoy.builder()
                .navn(dto.navn())
                .fiskerimerke(dto.fiskerimerke())
                .kallesignal(dto.kallesignal())
                .eierOrganisasjon(eier)
                .build();

        Fartoy savedFartoy = fartoyRepository.save(fartoy);

        return convertToDto(savedFartoy);
    }

    private FartoyResponseDto convertToDto(Fartoy fartoy) {
        return new FartoyResponseDto(
                fartoy.getId(),
                fartoy.getNavn(),
                fartoy.getFiskerimerke(),
                fartoy.getKallesignal()
        );
    }
}