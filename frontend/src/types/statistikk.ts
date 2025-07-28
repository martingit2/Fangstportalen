export interface StatistikkResponseDto {
    totalVerdi: number;
    totaltKvantum: number;
    antallHandler: number;
    verdiPerFiskeslag: Record<string, number>;
    kvantumPerFiskeslag: Record<string, number>;
    verdiPerMotpart: Record<string, number>;
}