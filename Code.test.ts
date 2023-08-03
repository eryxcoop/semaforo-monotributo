import {Peso, retiro_en_pesos_sugerido_para_el_mes, suma} from "./src/Code";

describe("Retiro sugerido en pesos para el mes", () => {
    describe("En el ultimo mes del periodo", () => {
        test('Cuando no se va a alcanzar el limite del monotributo, todo el retiro se sugiere en pesos', () => {
            let retiro_total_del_mes: Peso = 10
            let meses_restantes_en_el_periodo: number = 1
            let maximo_de_la_ultima_categoria_monotributo: Peso = 20

            let retiro_sugerido = retiro_en_pesos_sugerido_para_el_mes(
                [],
                retiro_total_del_mes,
                meses_restantes_en_el_periodo,
                maximo_de_la_ultima_categoria_monotributo,
                0,
                0,
                0,
            )
            expect(retiro_sugerido).toBe(retiro_total_del_mes);
        });

        test('Cuando se va a alcanzar el limite del monotributo, el retiro en pesos sugerido es el maximo sin pasarse', () => {
            let meses_restantes_en_el_periodo: number = 1
            let maximo_de_la_ultima_categoria_monotributo: Peso = 10

            let retiro_sugerido = retiro_en_pesos_sugerido_para_el_mes(
                [],
                100,
                meses_restantes_en_el_periodo,
                maximo_de_la_ultima_categoria_monotributo,
                0,
                0,
                0,
            )
            expect(retiro_sugerido).toBe(maximo_de_la_ultima_categoria_monotributo);
        });

        test('Los meses pasados en el periodo se contabilizan para la categoria del monotributo', () => {
            let retiros_anteriores_en_el_periodo: Peso[] = [10, 10]
            let meses_restantes_en_el_periodo: number = 1
            let maximo_de_la_ultima_categoria_monotributo: Peso = 30

            let retiro_sugerido = retiro_en_pesos_sugerido_para_el_mes(
                retiros_anteriores_en_el_periodo,
                100,
                meses_restantes_en_el_periodo,
                maximo_de_la_ultima_categoria_monotributo,
                0,
                0,
                0,
            )
            const total_meses_pasados = suma(retiros_anteriores_en_el_periodo);
            const maximo_retiro_sin_pasar_limite = maximo_de_la_ultima_categoria_monotributo - total_meses_pasados
            expect(retiro_sugerido).toBe(maximo_retiro_sin_pasar_limite);
        });
    });

    test('Cuando no hay inflacion, y restan varios meses en el periodo, se asumen iguales al mes actual', () => {
        let meses_restantes_en_el_periodo: number = 3
        let maximo_de_la_ultima_categoria_monotributo: Peso = 30
        let inflacion_proyectada_mensual = 0;

        let retiro_sugerido = retiro_en_pesos_sugerido_para_el_mes(
            [],
            100,
            meses_restantes_en_el_periodo,
            maximo_de_la_ultima_categoria_monotributo,
            inflacion_proyectada_mensual,
            0,
            0,
        )
        let maximo_retiro_en_los_meses_restantes = maximo_de_la_ultima_categoria_monotributo / meses_restantes_en_el_periodo;
        expect(retiro_sugerido).toBe(maximo_retiro_en_los_meses_restantes);
    });

    test('Se tiene en cuenta la inflacion del mes siguiente para el retiro sugerido del mes actual', () => {
        let meses_restantes_en_el_periodo: number = 2
        let maximo_de_la_ultima_categoria_monotributo: Peso = 40
        let inflacion_proyectada_mensual = 0.5;

        let retiro_sugerido = retiro_en_pesos_sugerido_para_el_mes(
            [],
            100,
            meses_restantes_en_el_periodo,
            maximo_de_la_ultima_categoria_monotributo,
            inflacion_proyectada_mensual,
            0,
            0,
        )
        let factor_de_inflacion = inflacion_proyectada_mensual + 1
        let inflacion_acumulada_en_el_periodo = 1 + factor_de_inflacion
        let maximo_retiro_actual_considerando_inflacion_futura = maximo_de_la_ultima_categoria_monotributo / inflacion_acumulada_en_el_periodo;
        expect(retiro_sugerido).toBe(maximo_retiro_actual_considerando_inflacion_futura);
    });

    test('La inflacion se estima correctamente para varios meses futuros', () => {
        let meses_restantes_en_el_periodo: number = 3
        let maximo_de_la_ultima_categoria_monotributo: Peso = 38
        let inflacion_proyectada_mensual = 0.5;

        let retiro_sugerido = retiro_en_pesos_sugerido_para_el_mes(
            [],
            100,
            meses_restantes_en_el_periodo,
            maximo_de_la_ultima_categoria_monotributo,
            inflacion_proyectada_mensual,
            0,
            0,
        )
        let factor_de_inflacion = inflacion_proyectada_mensual + 1
        let inflacion_acumulada_en_el_periodo = 1 + factor_de_inflacion + Math.pow(factor_de_inflacion, 2)
        let maximo_retiro_actual_considerando_inflacion_futura = maximo_de_la_ultima_categoria_monotributo / inflacion_acumulada_en_el_periodo;
        expect(retiro_sugerido).toBe(maximo_retiro_actual_considerando_inflacion_futura);
    });

    test('Cuando no hay una brecha entre dolar mep y oficial, el retiro sugerido en pesos es el maximo sin pasarse de la categoria del monotributo', () => {
        let retiro_total_del_mes = 20;
        let maximo_de_la_ultima_categoria_monotributo: Peso = 10;
        let precio_del_dolar_oficial_actual = 1;
        let precio_del_dolar_mep_actual = 1;

        let retiro_sugerido = retiro_en_pesos_sugerido_para_el_mes(
            [],
            retiro_total_del_mes,
            1,
            maximo_de_la_ultima_categoria_monotributo,
            0,
            precio_del_dolar_oficial_actual,
            precio_del_dolar_mep_actual,
        )
        expect(retiro_sugerido).toBe(maximo_de_la_ultima_categoria_monotributo);
    });
});