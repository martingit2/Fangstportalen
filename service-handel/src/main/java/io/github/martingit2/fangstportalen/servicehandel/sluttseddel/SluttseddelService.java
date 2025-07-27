package io.github.martingit2.fangstportalen.servicehandel.sluttseddel;

import io.github.martingit2.fangstportalen.servicehandel.sluttseddel.dto.CreateSluttseddelRequestDto;
import io.github.martingit2.fangstportalen.servicehandel.sluttseddel.dto.SluttseddelResponseDto;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class SluttseddelService {

    private final SluttseddelRepository sluttseddelRepository;

    @Transactional
    public SluttseddelResponseDto createSluttseddel(CreateSluttseddelRequestDto requestDto, String userId) {
        Sluttseddel sluttseddel = Sluttseddel.builder()
                .userId(userId)
                .status(SluttseddelStatus.KLADD)
                .landingsdato(requestDto.landingsdato())
                .fartoyNavn(requestDto.fartoyNavn())
                .leveringssted(requestDto.leveringssted())
                .fiskeslag(requestDto.fiskeslag())
                .kvantum(requestDto.kvantum())
                .build();

        Sluttseddel savedSluttseddel = sluttseddelRepository.save(sluttseddel);
        return convertToDto(savedSluttseddel);
    }

    @Transactional
    public SluttseddelResponseDto signerSomFisker(Long sluttseddelId, String userId) {
        Sluttseddel sluttseddel = findSluttseddelById(sluttseddelId);

        if (!sluttseddel.getUserId().equals(userId)) {
            throw new AccessDeniedException("Du har ikke tilgang til å signere denne sluttseddelen.");
        }
        if (sluttseddel.getStatus() != SluttseddelStatus.KLADD) {
            throw new IllegalStateException("Sluttseddelen kan kun signeres når den har status KLADD.");
        }

        sluttseddel.setStatus(SluttseddelStatus.SIGNERT_AV_FISKER);
        sluttseddel.setFiskerSignaturTidspunkt(LocalDateTime.now());

        Sluttseddel savedSluttseddel = sluttseddelRepository.save(sluttseddel);
        return convertToDto(savedSluttseddel);
    }

    @Transactional
    public SluttseddelResponseDto bekreftMottak(Long sluttseddelId, String mottakUserId) {
        Sluttseddel sluttseddel = findSluttseddelById(sluttseddelId);

        if (sluttseddel.getStatus() != SluttseddelStatus.SIGNERT_AV_FISKER) {
            throw new IllegalStateException("Sluttseddelen kan kun bekreftes når den er signert av fisker.");
        }

        sluttseddel.setStatus(SluttseddelStatus.BEKREFTET_AV_MOTTAK);
        sluttseddel.setMottakSignaturUserId(mottakUserId);
        sluttseddel.setMottakSignaturTidspunkt(LocalDateTime.now());

        Sluttseddel savedSluttseddel = sluttseddelRepository.save(sluttseddel);
        return convertToDto(savedSluttseddel);
    }

    public List<SluttseddelResponseDto> getMineSluttsedler(String userId) {
        return sluttseddelRepository.findByUserIdOrderByLandingsdatoDesc(userId).stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    public List<SluttseddelResponseDto> getMottatteSluttsedler() {
        return sluttseddelRepository.findByStatusOrderByLandingsdatoDesc(SluttseddelStatus.SIGNERT_AV_FISKER).stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    private Sluttseddel findSluttseddelById(Long id) {
        return sluttseddelRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Finner ikke sluttseddel med ID: " + id));
    }

    private SluttseddelResponseDto convertToDto(Sluttseddel sluttseddel) {
        return new SluttseddelResponseDto(
                sluttseddel.getId(),
                sluttseddel.getUserId(),
                sluttseddel.getStatus(),
                sluttseddel.getLandingsdato(),
                sluttseddel.getFartoyNavn(),
                sluttseddel.getLeveringssted(),
                sluttseddel.getFiskeslag(),
                sluttseddel.getKvantum(),
                sluttseddel.getOpprettetTidspunkt(),
                sluttseddel.getFiskerSignaturTidspunkt(), // Kan være null, det er OK
                sluttseddel.getMottakSignaturUserId(),   // Kan være null, det er OK
                sluttseddel.getMottakSignaturTidspunkt() // Kan være null, det er OK
        );
    }
}