package io.github.martingit2.fangstportalen.servicehandel.fangstmelding;

import io.github.martingit2.fangstportalen.servicehandel.fangstmelding.dto.CreateFangstmeldingRequestDto;
import io.github.martingit2.fangstportalen.servicehandel.fangstmelding.dto.FangstlinjeResponseDto;
import io.github.martingit2.fangstportalen.servicehandel.fangstmelding.dto.FangstmeldingResponseDto;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class FangstmeldingService {

    private final FangstmeldingRepository fangstmeldingRepository;

    @Transactional
    public Fangstmelding createFangstmelding(CreateFangstmeldingRequestDto dto, Long selgerOrganisasjonId) {
        Fangstmelding fangstmelding = Fangstmelding.builder()
                .selgerOrganisasjonId(selgerOrganisasjonId)
                .fartoyNavn(dto.fartoyNavn())
                .leveringssted(dto.leveringssted())
                .tilgjengeligFraDato(dto.tilgjengeligFraDato())
                .status(FangstmeldingStatus.AAPEN_FOR_BUD)
                .build();

        dto.fangstlinjer().forEach(linjeDto -> {
            Fangstlinje linje = Fangstlinje.builder()
                    .fiskeslag(linjeDto.fiskeslag())
                    .estimertKvantum(linjeDto.estimertKvantum())
                    .kvalitet(linjeDto.kvalitet())
                    .storrelse(linjeDto.storrelse())
                    .build();
            fangstmelding.addFangstlinje(linje);
        });

        return fangstmeldingRepository.save(fangstmelding);
    }

    @Transactional(readOnly = true)
    public List<FangstmeldingResponseDto> findAktiveFangstmeldinger() {
        List<Fangstmelding> fangstmeldinger = fangstmeldingRepository.findByStatusOrderByTilgjengeligFraDatoAsc(FangstmeldingStatus.AAPEN_FOR_BUD);
        return fangstmeldinger.stream()
                .map(this::convertToResponseDto)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<FangstmeldingResponseDto> findMineAktiveFangstmeldinger(Long selgerOrganisasjonId) {
        List<Fangstmelding> fangstmeldinger = fangstmeldingRepository.findBySelgerOrganisasjonIdAndStatus(selgerOrganisasjonId, FangstmeldingStatus.AAPEN_FOR_BUD);
        return fangstmeldinger.stream()
                .map(this::convertToResponseDto)
                .collect(Collectors.toList());
    }

    private FangstmeldingResponseDto convertToResponseDto(Fangstmelding fangstmelding) {
        List<FangstlinjeResponseDto> fangstlinjeDtos = fangstmelding.getFangstlinjer().stream()
                .map(linje -> new FangstlinjeResponseDto(
                        linje.getId(),
                        linje.getFiskeslag(),
                        linje.getEstimertKvantum(),
                        linje.getKvalitet(),
                        linje.getStorrelse()))
                .collect(Collectors.toList());

        return new FangstmeldingResponseDto(
                fangstmelding.getId(),
                String.valueOf(fangstmelding.getSelgerOrganisasjonId()),
                fangstmelding.getFartoyNavn(),
                fangstmelding.getStatus().name(),
                fangstmelding.getLeveringssted(),
                fangstmelding.getTilgjengeligFraDato(),
                fangstmelding.getOpprettetTidspunkt(),
                fangstlinjeDtos);
    }
}