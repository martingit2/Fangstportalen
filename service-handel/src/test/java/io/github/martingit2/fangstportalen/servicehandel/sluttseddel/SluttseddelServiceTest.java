package io.github.martingit2.fangstportalen.servicehandel.sluttseddel;

import io.github.martingit2.fangstportalen.servicehandel.sluttseddel.dto.CreateSluttseddelRequestDto;
import io.github.martingit2.fangstportalen.servicehandel.sluttseddel.dto.SluttseddelResponseDto;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class SluttseddelServiceTest {

    @Mock
    private SluttseddelRepository sluttseddelRepository;

    @InjectMocks
    private SluttseddelService sluttseddelService;

    @Test
    void createSluttseddel_mapsAndSavesCorrectly() {
        Long selgerOrganisasjonId = 1L;
        Long kjoperOrganisasjonId = 2L;
        CreateSluttseddelRequestDto request = new CreateSluttseddelRequestDto(
                LocalDate.now(), "MS Testbåt", "Testvik", "Torsk", 1500.5
        );

        Sluttseddel sluttseddelToSave = Sluttseddel.builder()
                .selgerOrganisasjonId(selgerOrganisasjonId)
                .kjoperOrganisasjonId(kjoperOrganisasjonId)
                .status(SluttseddelStatus.KLADD)
                .landingsdato(request.landingsdato())
                .fartoyNavn(request.fartoyNavn())
                .leveringssted(request.leveringssted())
                .fiskeslag(request.fiskeslag())
                .kvantum(request.kvantum())
                .build();

        // Simulerer at save-metoden returnerer entiteten med en ID
        Sluttseddel savedEntity = sluttseddelToSave;
        savedEntity.setId(1L);

        when(sluttseddelRepository.save(any(Sluttseddel.class))).thenReturn(savedEntity);

        SluttseddelResponseDto response = sluttseddelService.createSluttseddel(request, selgerOrganisasjonId, kjoperOrganisasjonId);

        assertNotNull(response);
        assertEquals(1L, response.id());
        assertEquals("MS Testbåt", response.fartoyNavn());
        verify(sluttseddelRepository).save(any(Sluttseddel.class));
    }

    @Test
    void getMineSluttsedler_returnsCorrectlyMappedDtosForOrganization() {
        Long selgerOrganisasjonId = 1L;
        Sluttseddel seddel1 = Sluttseddel.builder().id(1L).selgerOrganisasjonId(selgerOrganisasjonId).fartoyNavn("Båt 1").landingsdato(LocalDate.now()).fiskeslag("Torsk").kvantum(100.0).status(SluttseddelStatus.KLADD).build();
        Sluttseddel seddel2 = Sluttseddel.builder().id(2L).selgerOrganisasjonId(selgerOrganisasjonId).fartoyNavn("Båt 2").landingsdato(LocalDate.now()).fiskeslag("Sei").kvantum(200.0).status(SluttseddelStatus.KLADD).build();

        when(sluttseddelRepository.findBySelgerOrganisasjonIdOrderByLandingsdatoDesc(selgerOrganisasjonId)).thenReturn(List.of(seddel1, seddel2));

        List<SluttseddelResponseDto> responses = sluttseddelService.getMineSluttsedler(selgerOrganisasjonId);

        assertNotNull(responses);
        assertEquals(2, responses.size());
        assertEquals("Båt 1", responses.get(0).fartoyNavn());
        verify(sluttseddelRepository).findBySelgerOrganisasjonIdOrderByLandingsdatoDesc(selgerOrganisasjonId);
    }
}