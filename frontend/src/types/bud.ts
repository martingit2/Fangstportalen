export interface BudLinjeResponseDto {
    id: number;
    fangstlinjeId: number;
    fiskeslag: string;
    budPrisPerKg: number;
}

export interface BudResponseDto {
    id: number;
    kjoperOrganisasjonNavn: string;
    budLinjer: BudLinjeResponseDto[];
    status: 'AKTIV' | 'AKSEPTERT' | 'AVVIST';
    opprettetTidspunkt: string;
}