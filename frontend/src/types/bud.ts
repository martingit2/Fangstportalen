export interface KontaktinformasjonDto {
    organisasjonNavn: string;
    organisasjonTelefon: string | null;
    kontaktpersonNavn: string;
    kontaktpersonTittel: string | null;
    kontaktpersonTelefon: string | null;
}

export interface BudLinjeResponseDto {
    id: number;
    fangstlinjeId: number;
    fiskeslag: string;
    budPrisPerKg: number;
}

export interface BudResponseDto {
    id: number;
    budgiverKontakt: KontaktinformasjonDto;
    budLinjer: BudLinjeResponseDto[];
    status: 'AKTIV' | 'AKSEPTERT' | 'AVVIST';
    opprettetTidspunkt: string;
    totalVerdi: number;
}

export interface BudOversiktResponseDto {
    fangstmeldingId: number;
    fartoyNavn: string;
    leveringssted: string;
    tilgjengeligFraDato: string;
    selgerKontakt: KontaktinformasjonDto;
    bud: BudResponseDto[];
}