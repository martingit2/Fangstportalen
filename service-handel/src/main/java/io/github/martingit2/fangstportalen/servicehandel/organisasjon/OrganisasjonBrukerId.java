package io.github.martingit2.fangstportalen.servicehandel.organisasjon;

import jakarta.persistence.Embeddable;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

import java.io.Serializable;

@Embeddable
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode
@Data
public class OrganisasjonBrukerId implements Serializable {

    private Long organisasjonId;
    private String brukerId;
}