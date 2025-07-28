package io.github.martingit2.fangstportalen.servicehandel.organisasjon;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface OrganisasjonBrukerRepository extends JpaRepository<OrganisasjonBruker, OrganisasjonBrukerId> {

    Optional<OrganisasjonBruker> findById_BrukerId(String brukerId);

    @Query("SELECT ob FROM OrganisasjonBruker ob WHERE ob.id.organisasjonId = :orgId")
    List<OrganisasjonBruker> finnAlleForOrganisasjon(@Param("orgId") Long orgId);
}