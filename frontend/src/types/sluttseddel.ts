export type SluttseddelStatus = 'KLADD' | 'SIGNERT_AV_FISKER' | 'BEKREFTET_AV_MOTTAK' | 'AVVIST';

export interface SluttseddelLinjeDto {
    id: number;
    ordrelinjeId: number;
    fiskeslag: string;
    faktiskKvantum: number;
    avtaltPrisPerKg: number;
    totalVerdi: number;
}

export interface SluttseddelResponseDto {
    id: number;
    ordreId: number;
    status: SluttseddelStatus;
    landingsdato: string;
    fartoyNavn: string;
    leveringssted: string;
    linjer: SluttseddelLinjeDto[];
    totalVerdi: number;
    opprettetTidspunkt: string;
}