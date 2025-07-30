package io.github.martingit2.fangstportalen.servicehandel.ordre;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OrdreRepository extends JpaRepository<Ordre, Long>, JpaSpecificationExecutor<Ordre> {

    List<Ordre> findByKjoperOrganisasjonIdOrderByOpprettetTidspunktDesc(Long kjoperOrganisasjonId);

    List<Ordre> findBySelgerOrganisasjonIdOrderByOpprettetTidspunktDesc(Long selgerOrganisasjonId);

    List<Ordre> findBySelgerOrganisasjonIdAndStatus(Long selgerOrganisasjonId, OrdreStatus status);

    List<Ordre> findByKjoperOrganisasjonIdAndStatus(Long kjoperOrganisasjonId, OrdreStatus status);
}