export interface OrdrelinjeDto {
    id: number;
    fiskeslag: string;
    kvalitet: string | null;
    storrelse: string | null;
    avtaltPrisPerKg: number;
    forventetKvantum: number;
}

export interface OrdreResponseDto {
    id: number;
    status: string;
    kjoperOrganisasjonNavn: string; 
    leveringssted: string; 
    forventetLeveringsdato: string; 
    forventetLeveringstidFra: string | null; 
    forventetLeveringstidTil: string | null; 
    opprettetTidspunkt: string;
    ordrelinjer: OrdrelinjeDto[];
}