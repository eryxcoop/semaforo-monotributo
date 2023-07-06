export type Peso = number;

export function retiro_en_pesos_sugerido_para_el_mes(retiros_anteriores_en_el_periodo: Peso[], retiro_total_del_mes: Peso,
                                                     meses_restantes_en_el_periodo: number, maximo_de_la_ultima_categoria_monotributo: Peso): Peso {
    const total_meses_anteriores = retiros_anteriores_en_el_periodo.reduce(
        (total, actual) => total + actual);
    const total_incluyendo_mes_actual = total_meses_anteriores + retiro_total_del_mes;

    if (total_incluyendo_mes_actual > maximo_de_la_ultima_categoria_monotributo) {
        return total_incluyendo_mes_actual - maximo_de_la_ultima_categoria_monotributo;
    } else {
        const total_meses_futuros_incluyendo_actual = maximo_de_la_ultima_categoria_monotributo - total_meses_anteriores;
        const retiro_maximo_por_mes_restante = total_meses_futuros_incluyendo_actual / meses_restantes_en_el_periodo;
        const retiro_sugerido_mes_actual = minimo(retiro_maximo_por_mes_restante, retiro_total_del_mes);
        return retiro_sugerido_mes_actual;
    }
}

function minimo(retiro_maximo_por_mes_restante: number, retiro_total_del_mes: number) {
    return retiro_maximo_por_mes_restante > retiro_total_del_mes ?
        retiro_total_del_mes : retiro_maximo_por_mes_restante;
}