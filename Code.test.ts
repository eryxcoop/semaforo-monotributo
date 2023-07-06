type Peso = number;

function retiro_en_pesos_sugerido_para_el_mes(retiros_anteriores_en_el_periodo: Peso[], retiro_total_del_mes: Peso,
                                              meses_restantes_en_el_periodo: number, maximo_de_la_ultima_categoria_monotributo: Peso): Peso {
    let total_meses_anteriores = retiros_anteriores_en_el_periodo.reduce(
        (total, actual) => total + actual);
    let total_incluyendo_mes_actual = total_meses_anteriores + retiro_total_del_mes;

    if (total_incluyendo_mes_actual > maximo_de_la_ultima_categoria_monotributo) {
        return total_incluyendo_mes_actual - maximo_de_la_ultima_categoria_monotributo;
    } else {
        let total_meses_futuros_incluyendo_actual = maximo_de_la_ultima_categoria_monotributo - total_meses_anteriores;
        let retiro_sugerido_por_mes_restante = total_meses_futuros_incluyendo_actual / meses_restantes_en_el_periodo
        let retiro_sugerido_mes_actual = retiro_sugerido_por_mes_restante > retiro_total_del_mes ?
            retiro_total_del_mes : retiro_sugerido_por_mes_restante;
        return retiro_sugerido_mes_actual;
    }
}

describe("Retiro sugerido en pesos para el mes", () => {
    test('Cuando no se va a alcanzar el limite del monotributo, todo el retiro se sugiere en pesos', () => {
        let retiros_anteriores_en_el_periodo: Peso[] = [10, 10]
        let retiro_total_del_mes: Peso = 10
        let meses_restantes_en_el_periodo: number = 1
        let maximo_de_la_ultima_categoria_monotributo: Peso = 40

        let retiro_sugerido = retiro_en_pesos_sugerido_para_el_mes(
            retiros_anteriores_en_el_periodo,
            retiro_total_del_mes,
            meses_restantes_en_el_periodo,
            maximo_de_la_ultima_categoria_monotributo
        )
        expect(retiro_sugerido).toBe(10);
    });

    test('Cuando se va a alcanzar el limite del monotributo, el retiro en pesos sugerido es el maximo sin pasarse', () => {
        let retiros_anteriores_en_el_periodo: Peso[] = [10, 10]
        let retiro_total_del_mes: Peso = 10
        let meses_restantes_en_el_periodo: number = 1
        let maximo_de_la_ultima_categoria_monotributo: Peso = 25

        let retiro_sugerido = retiro_en_pesos_sugerido_para_el_mes(
            retiros_anteriores_en_el_periodo,
            retiro_total_del_mes,
            meses_restantes_en_el_periodo,
            maximo_de_la_ultima_categoria_monotributo
        )
        expect(retiro_sugerido).toBe(5);
    });

    test('Cuando restan varios meses en el periodo, se asumen iguales al mes actual', () => {
        let retiros_anteriores_en_el_periodo: Peso[] = [10, 10]
        let retiro_total_del_mes: Peso = 20
        let meses_restantes_en_el_periodo: number = 2
        let maximo_de_la_ultima_categoria_monotributo: Peso = 40

        let retiro_sugerido = retiro_en_pesos_sugerido_para_el_mes(
            retiros_anteriores_en_el_periodo,
            retiro_total_del_mes,
            meses_restantes_en_el_periodo,
            maximo_de_la_ultima_categoria_monotributo
        )
        expect(retiro_sugerido).toBe(10);
    });
});