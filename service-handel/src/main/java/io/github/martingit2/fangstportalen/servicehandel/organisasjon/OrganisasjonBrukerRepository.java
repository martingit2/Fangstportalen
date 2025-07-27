// service-handel/src/main/java/io/github/martingit2/fangstportalen/servicehandel/organisasjon/OrganisasjonBrukerRepository.java
package io.github.martingit2.fangstportalen.servicehandel.organisasjon;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface OrganisasjonBrukerRepository extends JpaRepository<OrganisasjonBruker, OrganisasjonBrukerId> {

    Optional<OrganisasjonBruker> findById_BrukerId(String brukerId);
}