package io.github.martingit2.fangstportalen.servicehandel.ordre;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "ordrelinjer")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Ordrelinje {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ordre_id")
    @JsonIgnore
    private Ordre ordre;

    @Column(nullable = false)
    private String fiskeslag;

    private String kvalitet;

    private String storrelse;

    @Column(name = "avtalt_pris_per_kg", nullable = false)
    private Double avtaltPrisPerKg;

    @Column(name = "forventet_kvantum", nullable = false)
    private Double forventetKvantum;
}