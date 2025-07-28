package io.github.martingit2.fangstportalen.servicehandel.sluttseddel;

import io.github.martingit2.fangstportalen.servicehandel.ordre.Ordre;
import io.github.martingit2.fangstportalen.servicehandel.ordre.OrdreRepository;
import io.github.martingit2.fangstportalen.servicehandel.ordre.OrdreStatus;
import io.github.martingit2.fangstportalen.servicehandel.sluttseddel.dto.CreateSluttseddelRequestDto;
import io.github.martingit2.fangstportalen.servicehandel.sluttseddel.dto.SluttseddelResponseDto;
import io.github.martingit2.fangstportalen.servicehandel.sluttseddel.dto.SluttseddelLinjeDto;

import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class SluttseddelService {

    private final SluttseddelRepository sluttseddelRepository;
    private final OrdreRepository ordreRepository;

    @Transactional
    public SluttseddelResponseDto createSluttseddelFromOrdre(CreateSluttseddelRequestDto requestDto, Long selgerOrganisasjonId) {
        Ordre ordre = ordreRepository.findById(requestDto.ordreId())
                .orElseThrow(() -> new EntityNotFoundException("Ordre ikke funnet med ID: " + requestDto.ordreId()));

        if (!ordre.getSelgerOrganisasjonId().equals(selgerOrganisasjonId)) {
            throw new AccessDeniedException("Du eier ikke denne ordren og kan ikke opprette sluttseddel for den.");
        }
        if (ordre.getStatus() != OrdreStatus.AVTALT) {
            throw new IllegalStateException("Kan kun opprette sluttseddel for en ordre med status AVTALT.");
        }
        if (ordre.getSluttseddel() != null) {
            throw new IllegalStateException("Det eksisterer allerede en sluttseddel for denne ordren.");
        }

        Sluttseddel sluttseddel = Sluttseddel.builder()
                .ordre(ordre)
                .selgerOrganisasjonId(ordre.getSelgerOrganisasjonId())
                .kjoperOrganisasjonId(ordre.getKjoperOrganisasjonId())
                .status(SluttseddelStatus.KLADD)
                .landingsdato(requestDto.landingsdato())
                .build();

        Map<Long, String> ordrelinjeMap = ordre.getOrdrelinjer().stream()
                .collect(Collectors.toMap(ol -> ol.getId(), ol -> ol.getFiskeslag()));

        requestDto.linjer().forEach(linjeDto -> {
            if (!ordrelinjeMap.containsKey(linjeDto.ordrelinjeId())) {
                throw new IllegalArgumentException("Ugyldig ordrelinje ID: " + linjeDto.ordrelinjeId());
            }
            SluttseddelLinje linje = SluttseddelLinje.builder()
                    .ordrelinjeId(linjeDto.ordrelinjeId())
                    .fiskeslag(ordrelinjeMap.get(linjeDto.ordrelinjeId()))
                    .faktiskKvantum(linjeDto.faktiskKvantum())
                    .build();
            sluttseddel.addSluttseddelLinje(linje);
        });

        ordre.setStatus(OrdreStatus.FULLFØRT);
        ordreRepository.save(ordre);

        Sluttseddel savedSluttseddel = sluttseddelRepository.save(sluttseddel);
        return convertToDto(savedSluttseddel);
    }

    private SluttseddelResponseDto convertToDto(Sluttseddel sluttseddel) {
        List<SluttseddelLinjeDto> linjeDtos = sluttseddel.getSluttseddelLinjer().stream()
                .map(linje -> new SluttseddelLinjeDto(
                        linje.getId(),
                        linje.getOrdrelinjeId(),
                        linje.getFiskeslag(),
                        linje.getFaktiskKvantum()
                )).collect(Collectors.toList());

        return new SluttseddelResponseDto(
                sluttseddel.getId(),
                sluttseddel.getOrdre().getId(),
                sluttseddel.getStatus(),
                sluttseddel.getLandingsdato(),
                "Fartøyinfo fra Ordre", 
                sluttseddel.getOrdre().getLeveringssted(),
                linjeDtos,
                sluttseddel.getOpprettetTidspunkt()
        );
    }
}