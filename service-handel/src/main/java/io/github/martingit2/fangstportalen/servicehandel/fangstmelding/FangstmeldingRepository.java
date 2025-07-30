package io.github.martingit2.fangstportalen.servicehandel.fangstmelding;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

@Repository
public interface FangstmeldingRepository extends JpaRepository<Fangstmelding, Long>, JpaSpecificationExecutor<Fangstmelding> {

    Page<Fangstmelding> findBySelgerOrganisasjonIdAndStatus(Long selgerOrganisasjonId, FangstmeldingStatus status, Pageable pageable);
}