export interface BudResponseDto {
    id: number;
    kjoperOrganisasjonNavn: string;
    budPrisPerKg: number;
    status: 'AKTIV' | 'AKSEPTERT' | 'AVVIST';
    opprettetTidspunkt: string;
}