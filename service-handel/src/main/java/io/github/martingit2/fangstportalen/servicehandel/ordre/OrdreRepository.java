package io.github.martingit2.fangstportalen.servicehandel.ordre;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OrdreRepository extends JpaRepository<Ordre, Long> {

    List<Ordre> findByKjoperOrganisasjonIdOrderByOpprettetTidspunktDesc(Long kjoperOrganisasjonId);

    List<Ordre> findByStatusAndFangstmeldingIdIsNullAndKjoperOrganisasjonIdNot(OrdreStatus status, Long kjoperOrganisasjonId);
}