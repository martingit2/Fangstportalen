package io.github.martingit2.fangstportalen.servicehandel.sluttseddel;

import io.github.martingit2.fangstportalen.servicehandel.ordre.Ordre;
import io.github.martingit2.fangstportalen.servicehandel.ordre.OrdreRepository;
import io.github.martingit2.fangstportalen.servicehandel.ordre.OrdreStatus;
import io.github.martingit2.fangstportalen.servicehandel.ordre.Ordrelinje;
import io.github.martingit2.fangstportalen.servicehandel.organisasjon.OrganisasjonType;
import io.github.martingit2.fangstportalen.servicehandel.sluttseddel.dto.CreateSluttseddelRequestDto;
import io.github.martingit2.fangstportalen.servicehandel.sluttseddel.dto.SluttseddelLinjeDto;
import io.github.martingit2.fangstportalen.servicehandel.sluttseddel.dto.SluttseddelResponseDto;

import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.Map;
import java.util.function.Function;
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

        if (ordre.getSelgerOrganisasjonId() == null || !ordre.getSelgerOrganisasjonId().equals(selgerOrganisasjonId)) {
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
                .status(SluttseddelStatus.SIGNERT_AV_FISKER)
                .landingsdato(requestDto.landingsdato())
                .build();

        Map<Long, Ordrelinje> ordrelinjeMap = ordre.getOrdrelinjer().stream()
                .collect(Collectors.toMap(Ordrelinje::getId, Function.identity()));

        requestDto.linjer().forEach(linjeDto -> {
            Ordrelinje tilhorendeOrdrelinje = ordrelinjeMap.get(linjeDto.ordrelinjeId());
            if (tilhorendeOrdrelinje == null) {
                throw new IllegalArgumentException("Ugyldig ordrelinje ID: " + linjeDto.ordrelinjeId());
            }
            SluttseddelLinje linje = SluttseddelLinje.builder()
                    .ordrelinjeId(linjeDto.ordrelinjeId())
                    .fiskeslag(tilhorendeOrdrelinje.getFiskeslag())
                    .faktiskKvantum(linjeDto.faktiskKvantum())
                    .avtaltPrisPerKg(tilhorendeOrdrelinje.getAvtaltPrisPerKg())
                    .build();
            sluttseddel.addSluttseddelLinje(linje);
        });

        Sluttseddel savedSluttseddel = sluttseddelRepository.save(sluttseddel);
        return convertToDto(savedSluttseddel);
    }

    @Transactional
    public SluttseddelResponseDto bekreftSluttseddel(Long sluttseddelId, Long kjoperOrganisasjonId) {
        Sluttseddel sluttseddel = sluttseddelRepository.findById(sluttseddelId)
                .orElseThrow(() -> new EntityNotFoundException("Sluttseddel ikke funnet med ID: " + sluttseddelId));

        if (!sluttseddel.getKjoperOrganisasjonId().equals(kjoperOrganisasjonId)) {
            throw new AccessDeniedException("Din organisasjon er ikke kjøper på denne sluttseddelen.");
        }
        if (sluttseddel.getStatus() != SluttseddelStatus.SIGNERT_AV_FISKER) {
            throw new IllegalStateException("Kan kun bekrefte en sluttseddel som er signert av fisker.");
        }

        sluttseddel.setStatus(SluttseddelStatus.BEKREFTET_AV_MOTTAK);
        sluttseddel.getOrdre().setStatus(OrdreStatus.FULLFØRT);

        Sluttseddel savedSluttseddel = sluttseddelRepository.save(sluttseddel);
        return convertToDto(savedSluttseddel);
    }

    @Transactional(readOnly = true)
    public List<SluttseddelResponseDto> getMineSluttsedler(Long orgId, OrganisasjonType orgType) {
        List<Sluttseddel> sedler;
        if (orgType == OrganisasjonType.REDERI) {
            sedler = sluttseddelRepository.findBySelgerOrganisasjonIdOrderByLandingsdatoDesc(orgId);
        } else {
            sedler = sluttseddelRepository.findByKjoperOrganisasjonIdOrderByLandingsdatoDesc(orgId);
        }
        return sedler.stream().map(this::convertToDto).collect(Collectors.toList());
    }

    private SluttseddelResponseDto convertToDto(Sluttseddel sluttseddel) {
        List<SluttseddelLinjeDto> linjeDtos = sluttseddel.getSluttseddelLinjer().stream()
                .map(linje -> new SluttseddelLinjeDto(
                        linje.getId(),
                        linje.getOrdrelinjeId(),
                        linje.getFiskeslag(),
                        linje.getFaktiskKvantum(),
                        linje.getAvtaltPrisPerKg(),
                        linje.getFaktiskKvantum() * linje.getAvtaltPrisPerKg()
                )).collect(Collectors.toList());

        double totalVerdi = linjeDtos.stream().mapToDouble(SluttseddelLinjeDto::totalVerdi).sum();
        String fartoyNavn = "Ukjent Fartøy";
        if (sluttseddel.getOrdre() != null && sluttseddel.getOrdre().getSelgerOrganisasjonId() != null) {
            // Denne logikken må forbedres for å hente fartøynavn
        }

        return new SluttseddelResponseDto(
                sluttseddel.getId(),
                sluttseddel.getOrdre().getId(),
                sluttseddel.getStatus(),
                sluttseddel.getLandingsdato(),
                fartoyNavn,
                sluttseddel.getOrdre().getLeveringssted(),
                linjeDtos,
                totalVerdi,
                sluttseddel.getOpprettetTidspunkt()
        );
    }
}