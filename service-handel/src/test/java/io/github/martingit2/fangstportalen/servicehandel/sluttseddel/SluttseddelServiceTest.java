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
        String userId = "auth0|test-user";
        CreateSluttseddelRequestDto request = new CreateSluttseddelRequestDto(
                LocalDate.now(), "MS Testbåt", "Testvik", "Torsk", 1500.5
        );

        Sluttseddel savedEntity = Sluttseddel.builder()
                .id(1L)
                .userId(userId)
                .landingsdato(request.landingsdato())
                .fartoyNavn(request.fartoyNavn())
                .leveringssted(request.leveringssted())
                .fiskeslag(request.fiskeslag())
                .kvantum(request.kvantum())
                .build();

        when(sluttseddelRepository.save(any(Sluttseddel.class))).thenReturn(savedEntity);

        SluttseddelResponseDto response = sluttseddelService.createSluttseddel(request, userId);

        assertNotNull(response);
        assertEquals(1L, response.id());
        assertEquals("MS Testbåt", response.fartoyNavn());
        assertEquals(userId, response.userId());
        verify(sluttseddelRepository).save(any(Sluttseddel.class));
    }

    @Test
    void getMineSluttsedler_returnsCorrectlyMappedDtosForUser() {
        String userId = "auth0|test-user";
        Sluttseddel seddel1 = Sluttseddel.builder().id(1L).userId(userId).fartoyNavn("Båt 1").landingsdato(LocalDate.now()).build();
        Sluttseddel seddel2 = Sluttseddel.builder().id(2L).userId(userId).fartoyNavn("Båt 2").landingsdato(LocalDate.now()).build();

        when(sluttseddelRepository.findByUserIdOrderByLandingsdatoDesc(userId)).thenReturn(List.of(seddel1, seddel2));

        List<SluttseddelResponseDto> responses = sluttseddelService.getMineSluttsedler(userId);

        assertNotNull(responses);
        assertEquals(2, responses.size());
        assertEquals("Båt 1", responses.get(0).fartoyNavn());
    }
}