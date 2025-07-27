package io.github.martingit2.fangstportalen.servicehandel;

import io.github.martingit2.fangstportalen.servicehandel.organisasjon.*;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Component;

@Component
@Profile("dev")
@RequiredArgsConstructor
public class DataSeeder implements CommandLineRunner {

    private final OrganisasjonRepository organisasjonRepository;
    private final OrganisasjonBrukerRepository organisasjonBrukerRepository;
    private static final Logger log = LoggerFactory.getLogger(DataSeeder.class);

    @Value("${TEST_SKIPPER_USER_ID}")
    private String skipperUserId;

    @Value("${TEST_INNKJOPER_USER_ID}")
    private String innkjoperUserId;

    @Override
    public void run(String... args) throws Exception {
        if (organisasjonRepository.count() > 0) {
            log.info("Database er allerede seedet. Hopper over.");
            return;
        }

        log.info("Starter seeding av database for utviklingsmiljø...");

        Organisasjon rederi = Organisasjon.builder()
                .navn("Havbris Rederi AS")
                .organisasjonsnummer("987654321")
                .type(OrganisasjonType.REDERI)
                .build();
        organisasjonRepository.save(rederi);

        Organisasjon fiskebruk = Organisasjon.builder()
                .navn("Kystmottaket AS")
                .organisasjonsnummer("123456789")
                .type(OrganisasjonType.FISKEBRUK)
                .build();
        organisasjonRepository.save(fiskebruk);

        log.info("Opprettet {} og {}", rederi.getNavn(), fiskebruk.getNavn());

        OrganisasjonBruker skipperLink = OrganisasjonBruker.builder()
                .id(new OrganisasjonBrukerId(rederi.getId(), skipperUserId))
                .organisasjon(rederi)
                .rolle(BrukerRolle.REDERI_SKIPPER)
                .build();
        organisasjonBrukerRepository.save(skipperLink);

        OrganisasjonBruker innkjoperLink = OrganisasjonBruker.builder()
                .id(new OrganisasjonBrukerId(fiskebruk.getId(), innkjoperUserId))
                .organisasjon(fiskebruk)
                .rolle(BrukerRolle.FISKEBRUK_INNKJOPER)
                .build();
        organisasjonBrukerRepository.save(innkjoperLink);

        log.info("Koblet skipper ({}) til Rederi ID {}", skipperUserId, rederi.getId());
        log.info("Koblet innkjoper ({}) til Fiskebruk ID {}", innkjoperUserId, fiskebruk.getId());
        log.info("Database seeding fullført.");
    }
}