export type SluttseddelStatus = 'KLADD' | 'SIGNERT_AV_FISKER' | 'BEKREFTET_AV_MOTTAK' | 'AVVIST';

export interface SluttseddelLinjeDto {
    id: number;
    ordrelinjeId: number;
    fiskeslag: string;
    produkttilstand: string | null;
    kvalitet: string | null;
    storrelse: string | null;
    faktiskKvantum: number;
    avtaltPrisPerKg: number;
    totalVerdi: number;
}

export interface SluttseddelResponseDto {
    id: number;
    seddelnummer: string;
    ordreId: number;
    status: SluttseddelStatus;
    landingsdato: string;
    landingsklokkeslett: string | null;
    selgerNavn: string;
    kjoperNavn: string;
    fartoyNavn: string;
    leveringssted: string;
    linjer: SluttseddelLinjeDto[];
    totalVerdi: number;
    opprettetTidspunkt: string;
}