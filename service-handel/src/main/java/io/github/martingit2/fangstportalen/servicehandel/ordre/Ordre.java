package io.github.martingit2.fangstportalen.servicehandel.ordre;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "ordrer")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Ordre {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "kjoper_bruker_id", nullable = false)
    private String kjoperBrukerId;

    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private OrdreStatus status;

    @OneToMany(mappedBy = "ordre", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default // <-- DENNE LINJEN ER LØSNINGEN
    private List<Ordrelinje> ordrelinjer = new ArrayList<>();

    @Column(name = "forventet_leveringsdato")
    private LocalDate forventetLeveringsdato;

    @CreationTimestamp
    @Column(name = "opprettet_tidspunkt", nullable = false, updatable = false)
    private LocalDateTime opprettetTidspunkt;

    public void addOrdrelinje(Ordrelinje ordrelinje) {
        ordrelinjer.add(ordrelinje);
        ordrelinje.setOrdre(this);
    }
}