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
    forventetLeveringsdato: string;
    opprettetTidspunkt: string;
    ordrelinjer: OrdrelinjeDto[];
}