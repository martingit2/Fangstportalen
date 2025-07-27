package io.github.martingit2.fangstportalen.servicehandel.sluttseddel;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "sluttsedler", indexes = {
        @Index(name = "idx_sluttseddel_userid", columnList = "userId")
})
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Sluttseddel {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "user_id", nullable = false, updatable = false)
    private String userId;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private SluttseddelStatus status;

    @Column(nullable = false)
    private LocalDate landingsdato;

    @Column(name = "fartoy_navn", nullable = false)
    private String fartoyNavn;

    @Column(name = "leveringssted", nullable = false)
    private String leveringssted;

    @Column(name = "fiskeslag", nullable = false)
    private String fiskeslag;

    @Column(nullable = false)
    private Double kvantum;

    @CreationTimestamp
    @Column(name = "opprettet_tidspunkt", nullable = false, updatable = false)
    private LocalDateTime opprettetTidspunkt;

    @Column(name = "fisker_signatur_tidspunkt")
    private LocalDateTime fiskerSignaturTidspunkt;

    @Column(name = "mottak_signatur_user_id")
    private String mottakSignaturUserId;

    @Column(name = "mottak_signatur_tidspunkt")
    private LocalDateTime mottakSignaturTidspunkt;
}