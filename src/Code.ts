export type Peso = number;

export function retiro_en_pesos_sugerido_para_el_mes(
    retiros_anteriores_en_el_periodo: Peso[],
    retiro_total_del_mes: Peso,
    meses_restantes_en_el_periodo: number,
    maximo_de_la_ultima_categoria_monotributo: Peso,
    inflacion_proyectada_mensual
): Peso {
    const total_meses_anteriores = suma(retiros_anteriores_en_el_periodo);
    const total_meses_anteriores_incluyendo_mes_actual = total_meses_anteriores + retiro_total_del_mes;

    if (total_meses_anteriores_incluyendo_mes_actual > maximo_de_la_ultima_categoria_monotributo) {
        return total_meses_anteriores_incluyendo_mes_actual - maximo_de_la_ultima_categoria_monotributo;
    } else {
        const total_meses_futuros_incluyendo_actual = maximo_de_la_ultima_categoria_monotributo - total_meses_anteriores;
        const aumento_mensual_por_inflacion = 1 + inflacion_proyectada_mensual;

        let meses_restantes_mas_inflacion = 1;
        for (let i = 1; i < meses_restantes_en_el_periodo; i++) {
            meses_restantes_mas_inflacion += Math.pow(aumento_mensual_por_inflacion, i);
        }

        const retiro_maximo_mes_actual = total_meses_futuros_incluyendo_actual / meses_restantes_mas_inflacion;
        const retiro_sugerido_mes_actual = minimo(retiro_maximo_mes_actual, retiro_total_del_mes);
        return retiro_sugerido_mes_actual;
    }
}

function suma(lista_de_retiros: Peso[]): Peso {
    let total: Peso = 0
    lista_de_retiros.forEach(retiro => total += retiro);
    return total;
}

function minimo(retiro_maximo_por_mes_restante: number, retiro_total_del_mes: number) {
    return retiro_maximo_por_mes_restante > retiro_total_del_mes ?
        retiro_total_del_mes : retiro_maximo_por_mes_restante;
}