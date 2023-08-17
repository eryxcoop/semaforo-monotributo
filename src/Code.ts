export type Peso = number;

export function retiro_en_pesos_sugerido_para_el_mes(
    retiros_anteriores_en_el_periodo: Peso[],
    retiro_total_del_mes: Peso,
    meses_restantes_en_el_periodo: number,
    maximo_de_la_ultima_categoria_monotributo: Peso,
    inflacion_proyectada_mensual,
    precio_del_dolar_oficial_actual,
    precio_del_dolar_mep_actual,
): Peso {
    const total_restante_en_el_periodo =
        restante_en_el_periodo_antes_de_subir_de_categoria(retiros_anteriores_en_el_periodo, maximo_de_la_ultima_categoria_monotributo);

    if (ya_se_paso_el_maximo_del_monotributo(total_restante_en_el_periodo))
        throw 'Ya se paso el limite de la ultima categoria del monotributo en el pasado';

    const inflacion_acumulada_futura = inflacion_acumulada_futura_en_el_periodo(meses_restantes_en_el_periodo, inflacion_proyectada_mensual);

    if (precio_del_dolar_oficial_actual != precio_del_dolar_mep_actual) {
        return 6;
    }

    const retiro_maximo_mes_actual = total_restante_en_el_periodo / inflacion_acumulada_futura;
    const retiro_sugerido_mes_actual = minimo(retiro_maximo_mes_actual, retiro_total_del_mes);

    return retiro_sugerido_mes_actual;
}

function ya_se_paso_el_maximo_del_monotributo(total_restante_en_el_periodo: number) {
    return total_restante_en_el_periodo <= 0;
}

function restante_en_el_periodo_antes_de_subir_de_categoria(retiros_anteriores_en_el_periodo: Peso[], maximo_de_la_ultima_categoria_monotributo: number) {
    const total_meses_anteriores = suma(retiros_anteriores_en_el_periodo);
    const total_restante_en_el_periodo = maximo_de_la_ultima_categoria_monotributo - total_meses_anteriores;

    return total_restante_en_el_periodo;
}

function inflacion_acumulada_futura_en_el_periodo(meses_restantes_en_el_periodo: number, inflacion_proyectada_mensual: number) {
    const factor_de_inflacion = 1 + inflacion_proyectada_mensual;

    let inflacion_acumulada_en_el_periodo = 1;
    for (let mes_futuro = 1; mes_futuro < meses_restantes_en_el_periodo; mes_futuro++) {
        inflacion_acumulada_en_el_periodo += Math.pow(factor_de_inflacion, mes_futuro);
    }
    return inflacion_acumulada_en_el_periodo;
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