import {AsesorDeFinanzas, Peso} from "./AsesorDeFinanzas";

/**
 * Recomienda un retiro en pesos para el mes, de manera que no se pase el límite del monotributo. Esta función asume que los dolares valen 0 pesos.
 *
 * @param {array<number>} retiros_anteriores_en_el_periodo
 * @param {number} retiro_total_del_mes
 * @param {number} meses_restantes_en_el_periodo
 * @param {number} maximo_de_la_ultima_categoria_monotributo
 * @param {number} inflacion_proyectada_mensual Asume que cada mes futuro tendrá una inflacion fija. Se pone como un número entre 0 y 1 que representa un porcentaje a aumentar. Es efectiva, se aplica sobre el mes anterior actualizado.
 * @return {number} retiro_sugerido
 * @customfunction
 */
function retiro_en_pesos_sugerido(retiros_anteriores_en_el_periodo: Peso[],
                                  retiro_total_del_mes: Peso,
                                  meses_restantes_en_el_periodo: number,
                                  maximo_de_la_ultima_categoria_monotributo: Peso,
                                  inflacion_proyectada_mensual: any) {
    const retiros_anteriores = retiros_anteriores_en_el_periodo.flat();

    const asesor_de_finanzas = new AsesorDeFinanzas(
        retiros_anteriores,
        retiro_total_del_mes,
        meses_restantes_en_el_periodo,
        maximo_de_la_ultima_categoria_monotributo,
        inflacion_proyectada_mensual,
        0,
        0
    );

    return asesor_de_finanzas.retiro_en_pesos_sugerido_para_el_mes();
}

/**
 * Recomienda un retiro en pesos para el mes, de manera que no se pase el límite del monotributo. Esta función asume que los dolares valen 0 pesos.
 *
 * @param {array<number>} retiros_anteriores_en_el_periodo
 * @param {number} retiro_total_del_mes
 * @param {number} meses_restantes_en_el_periodo
 * @param {number} maximo_de_la_ultima_categoria_monotributo
 * @param {number} inflacion_proyectada_mensual Asume que cada mes futuro tendrá una inflacion fija. Se pone como un número entre 0 y 1 que representa un porcentaje a aumentar. Es efectiva, se aplica sobre el mes anterior actualizado. * @param {number} precio_del_dolar_oficial_actual
 * @param {number} precio_del_dolar_mep_actual
 * @return {number} retiro_sugerido
 * @customfunction
 */
function retiro_en_pesos_sugerido_con_dolares(retiros_anteriores_en_el_periodo: Peso[],
                                              retiro_total_del_mes: Peso,
                                              meses_restantes_en_el_periodo: number,
                                              maximo_de_la_ultima_categoria_monotributo: Peso,
                                              inflacion_proyectada_mensual,
                                              precio_del_dolar_oficial_actual,
                                              precio_del_dolar_mep_actual) {
    const retiros_anteriores = retiros_anteriores_en_el_periodo.flat();

    const asesor_de_finanzas = new AsesorDeFinanzas(
        retiros_anteriores,
        retiro_total_del_mes,
        meses_restantes_en_el_periodo,
        maximo_de_la_ultima_categoria_monotributo,
        inflacion_proyectada_mensual,
        precio_del_dolar_oficial_actual,
        precio_del_dolar_mep_actual
    );

    return asesor_de_finanzas.retiro_en_pesos_sugerido_para_el_mes();
}