package io.github.martingit2.fangstportalen.servicehandel.statistikk;

import java.util.Map;

public record StatistikkResponseDto(
        double totalVerdi,
        double totaltKvantum,
        int antallHandler,
        Map<String, Double> verdiPerFiskeslag,
        Map<String, Double> kvantumPerFiskeslag,
        Map<String, Double> verdiPerMotpart
) {}