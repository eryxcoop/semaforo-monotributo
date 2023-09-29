import {AsesorDeFinanzas, Calculadora, Peso} from "./src/AsesorDeFinanzas";

describe("Retiro sugerido en pesos para el mes", () => {
    // retiro sugerido

    describe("En el ultimo mes del periodo", () => {
        test('Cuando no se va a alcanzar el limite del monotributo, todo el retiro se sugiere en pesos', () => {
            let retiro_total_del_mes: Peso = 10
            let maximo_de_la_ultima_categoria_monotributo: Peso = 20

            let retiro_sugerido = retiro_sugerido_en_el_ultimo_mes_del_periodo(
                retiro_total_del_mes, maximo_de_la_ultima_categoria_monotributo);
            expect(retiro_sugerido).toBe(retiro_total_del_mes);
        });

        test('Cuando no se va a alcanzar el limite del monotributo, todo el retiro se sugiere en pesos', () => {
            let retiro_total_del_mes: Peso = 10
            let maximo_de_la_ultima_categoria_monotributo: Peso = 20

            let retiro_sugerido = retiro_sugerido_en_el_ultimo_mes_del_periodo(
                retiro_total_del_mes, maximo_de_la_ultima_categoria_monotributo);
            expect(retiro_sugerido).toBe(retiro_total_del_mes);
        });

        test('Cuando se va a alcanzar el limite del monotributo, el retiro en pesos sugerido es el maximo sin pasarse', () => {
            let retiro_total_del_mes = 20;
            let maximo_de_la_ultima_categoria_monotributo: Peso = 10;

            let retiro_sugerido = retiro_sugerido_en_el_ultimo_mes_del_periodo(
                retiro_total_del_mes, maximo_de_la_ultima_categoria_monotributo);
            expect(retiro_sugerido).toBe(maximo_de_la_ultima_categoria_monotributo);
        });

        test('Los meses pasados en el periodo se contabilizan para la categoria del monotributo', () => {
            let retiros_anteriores_en_el_periodo: Peso[] = [10, 10]
            let maximo_de_la_ultima_categoria_monotributo: Peso = 30
            let retiro_total_del_mes = 100;

            let retiro_sugerido = retiro_sugerido_en_el_ultimo_mes_considerando_meses_pasados(
                retiros_anteriores_en_el_periodo, retiro_total_del_mes, maximo_de_la_ultima_categoria_monotributo);

            let total_meses_pasados = total_meses_pasados_en_el_periodo(retiros_anteriores_en_el_periodo);
            const maximo_retiro_sin_pasar_limite = maximo_de_la_ultima_categoria_monotributo - total_meses_pasados;
            expect(retiro_sugerido).toBe(maximo_retiro_sin_pasar_limite);
        });

        test('Tira un error cuando ya se paso el limite del monotributo en el pasado', () => {
            let retiros_anteriores_en_el_periodo: Peso[] = [10]
            let maximo_de_la_ultima_categoria_monotributo: Peso = 9
            let retiro_total_del_mes = 100;

            expect(() => {
                retiro_sugerido_en_el_ultimo_mes_considerando_meses_pasados(
                    retiros_anteriores_en_el_periodo, retiro_total_del_mes, maximo_de_la_ultima_categoria_monotributo);
            }).toThrowError('Ya se paso el limite de la ultima categoria del monotributo en el pasado')
        });
    });

    // inflacion

    test('Cuando no hay inflacion, y restan varios meses en el periodo, se asumen iguales al mes actual', () => {
        let meses_restantes_en_el_periodo: number = 3
        let maximo_de_la_ultima_categoria_monotributo: Peso = 30
        let inflacion_proyectada_mensual = 0;

        const asesor_de_finanzas = new AsesorDeFinanzas([],
            100,
            meses_restantes_en_el_periodo,
            maximo_de_la_ultima_categoria_monotributo,
            inflacion_proyectada_mensual,
            0,
            0,);
        let retiro_sugerido = asesor_de_finanzas.retiro_en_pesos_sugerido_para_el_mes()
        let maximo_retiro_en_los_meses_restantes = maximo_de_la_ultima_categoria_monotributo / meses_restantes_en_el_periodo;
        expect(retiro_sugerido).toBe(maximo_retiro_en_los_meses_restantes);
    });

    test('Se tiene en cuenta la inflacion del mes siguiente para el retiro sugerido del mes actual', () => {
        let meses_restantes_en_el_periodo: number = 2
        let maximo_de_la_ultima_categoria_monotributo: Peso = 40
        let inflacion_proyectada_mensual = 0.5;

        const asesor_de_finanzas = new AsesorDeFinanzas([],
            100,
            meses_restantes_en_el_periodo,
            maximo_de_la_ultima_categoria_monotributo,
            inflacion_proyectada_mensual,
            0,
            0,);
        let retiro_sugerido = asesor_de_finanzas.retiro_en_pesos_sugerido_para_el_mes()
        let factor_de_inflacion = inflacion_proyectada_mensual + 1
        let inflacion_acumulada_en_el_periodo = 1 + factor_de_inflacion
        let maximo_retiro_actual_considerando_inflacion_futura = maximo_de_la_ultima_categoria_monotributo / inflacion_acumulada_en_el_periodo;
        expect(retiro_sugerido).toBe(maximo_retiro_actual_considerando_inflacion_futura);
    });

    test('La inflacion se estima correctamente para varios meses futuros', () => {
        let meses_restantes_en_el_periodo: number = 3
        let maximo_de_la_ultima_categoria_monotributo: Peso = 38
        let inflacion_proyectada_mensual = 0.5;

        const asesor_de_finanzas = new AsesorDeFinanzas([],
            100,
            meses_restantes_en_el_periodo,
            maximo_de_la_ultima_categoria_monotributo,
            inflacion_proyectada_mensual,
            0,
            0,);
        let retiro_sugerido = asesor_de_finanzas.retiro_en_pesos_sugerido_para_el_mes()
        let factor_de_inflacion = inflacion_proyectada_mensual + 1
        let inflacion_acumulada_en_el_periodo = 1 + factor_de_inflacion + Math.pow(factor_de_inflacion, 2)
        let maximo_retiro_actual_considerando_inflacion_futura = maximo_de_la_ultima_categoria_monotributo / inflacion_acumulada_en_el_periodo;
        expect(retiro_sugerido).toBe(maximo_retiro_actual_considerando_inflacion_futura);
    });

    // dolares

    test('Cuando no hay una brecha entre dolar mep y oficial, el retiro sugerido en pesos es el maximo sin pasarse de ' +
        'la categoria del monotributo', () => {
        let retiro_total_del_mes = 20;
        let maximo_de_la_ultima_categoria_monotributo: Peso = 10;
        let precio_del_dolar_oficial_actual = 1;
        let precio_del_dolar_mep_actual = 1;
        let mesesRestantesEnElPeriodo = 1;

        const asesor_de_finanzas = new AsesorDeFinanzas([],
            retiro_total_del_mes,
            mesesRestantesEnElPeriodo,
            maximo_de_la_ultima_categoria_monotributo,
            0,
            precio_del_dolar_oficial_actual,
            precio_del_dolar_mep_actual,);
        let retiro_sugerido = asesor_de_finanzas.retiro_en_pesos_sugerido_para_el_mes()
        expect(retiro_sugerido).toBe(maximo_de_la_ultima_categoria_monotributo);
    });

    test('Cuando hay una brecha del 50% entre dolar mep y oficial en el ultimo mes, se aprovecha para maximizar el retiro en pesos' +
        'sin pasarse de la categoria del monotributo', () => {
        let retiro_total_del_mes = 10;
        let maximo_de_la_ultima_categoria_monotributo: Peso = 8;
        let precio_del_dolar_oficial_actual = 1;
        let precio_del_dolar_mep_actual = 2;
        let mesesRestantesEnElPeriodo = 1;

        const asesor_de_finanzas = new AsesorDeFinanzas([],
            retiro_total_del_mes,
            mesesRestantesEnElPeriodo,
            maximo_de_la_ultima_categoria_monotributo,
            0,
            precio_del_dolar_oficial_actual,
            precio_del_dolar_mep_actual,);
        let retiro_sugerido = asesor_de_finanzas.retiro_en_pesos_sugerido_para_el_mes()
        expect(retiro_sugerido).toBe(6);
    });

    function retiro_sugerido_en_el_ultimo_mes_del_periodo(retiro_total_del_mes: number, maximo_de_la_ultima_categoria_monotributo: number) {
        const asesor_de_finanzas = new AsesorDeFinanzas([],
            retiro_total_del_mes,
            1,
            maximo_de_la_ultima_categoria_monotributo,
            0,
            0,
            0);
        return asesor_de_finanzas.retiro_en_pesos_sugerido_para_el_mes();
    }

    function retiro_sugerido_en_el_ultimo_mes_considerando_meses_pasados(retiros_anteriores_en_el_periodo: Peso[], retiro_total_del_mes: number, maximo_de_la_ultima_categoria_monotributo: number) {
        const asesor_de_finanzas = new AsesorDeFinanzas(retiros_anteriores_en_el_periodo,
            retiro_total_del_mes,
            1,
            maximo_de_la_ultima_categoria_monotributo,
            0,
            0,
            0,);
        return asesor_de_finanzas.retiro_en_pesos_sugerido_para_el_mes();
    }

    function total_meses_pasados_en_el_periodo(retiros_anteriores_en_el_periodo: Peso[]) {
        const calculadora = new Calculadora();
        return calculadora.suma(retiros_anteriores_en_el_periodo);
    }
});