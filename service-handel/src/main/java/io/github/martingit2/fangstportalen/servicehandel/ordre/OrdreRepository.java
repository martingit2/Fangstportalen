package io.github.martingit2.fangstportalen.servicehandel.ordre;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OrdreRepository extends JpaRepository<Ordre, Long>, JpaSpecificationExecutor<Ordre> {

    Page<Ordre> findByKjoperOrganisasjonId(Long kjoperOrganisasjonId, Pageable pageable);

    Page<Ordre> findBySelgerOrganisasjonId(Long selgerOrganisasjonId, Pageable pageable);

    List<Ordre> findBySelgerOrganisasjonIdAndStatus(Long selgerOrganisasjonId, OrdreStatus status);

    Page<Ordre> findByKjoperOrganisasjonIdAndStatus(Long kjoperOrganisasjonId, OrdreStatus status, Pageable pageable);
    
    List<Ordre> findAllBySelgerOrganisasjonIdAndStatus(Long selgerOrganisasjonId, OrdreStatus status);

    List<Ordre> findAllByKjoperOrganisasjonIdAndStatus(Long kjoperOrganisasjonId, OrdreStatus status);
}