export type Peso = number;

export function retiro_en_pesos_sugerido_para_el_mes(
    retiros_anteriores_en_el_periodo: Peso[],
    retiro_total_del_mes: Peso,
    meses_restantes_en_el_periodo: number,
    maximo_de_la_ultima_categoria_monotributo: Peso,
    inflacion_proyectada_mensual
): Peso {
    const total_meses_anteriores = suma(retiros_anteriores_en_el_periodo);
    const total_restante_en_el_periodo = maximo_de_la_ultima_categoria_monotributo - total_meses_anteriores;

    const factor_de_inflacion = 1 + inflacion_proyectada_mensual;

    let inflacion_acumulada_en_el_periodo = 1;
    for (let mes_futuro = 1; mes_futuro < meses_restantes_en_el_periodo; mes_futuro++) {
        inflacion_acumulada_en_el_periodo += Math.pow(factor_de_inflacion, mes_futuro);
    }

    const retiro_maximo_mes_actual = total_restante_en_el_periodo / inflacion_acumulada_en_el_periodo;
    const retiro_sugerido_mes_actual = minimo(retiro_maximo_mes_actual, retiro_total_del_mes);

    return retiro_sugerido_mes_actual;
}

export function suma(lista_de_retiros: Peso[]): Peso {
    let total: Peso = 0
    lista_de_retiros.forEach(retiro => total += retiro);
    return total;
}

function minimo(retiro_maximo_por_mes_restante: number, retiro_total_del_mes: number) {
    return retiro_maximo_por_mes_restante > retiro_total_del_mes ?
        retiro_total_del_mes : retiro_maximo_por_mes_restante;
}