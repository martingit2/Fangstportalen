export interface FangstlinjeResponseDto {
    id: number;
    fiskeslag: string;
    estimertKvantum: number;
    utropsprisPerKg: number; 
    kvalitet: string | null;
    storrelse: string | null;
}

export interface FangstmeldingResponseDto {
    id: number;
    skipperBrukerId: string;
    fartoyNavn: string;
    status: string;
    leveringssted: string;
    tilgjengeligFraDato: string;
    opprettetTidspunkt: string;
    fangstlinjer: FangstlinjeResponseDto[];
}