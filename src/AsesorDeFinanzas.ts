export type Peso = number;

export class AsesorDeFinanzas {
    private retiros_anteriores_en_el_periodo: Peso[];
    private retiro_total_del_mes: Peso;
    private precio_del_dolar_mep_actual: any;
    private meses_restantes_en_el_periodo: number;
    private maximo_de_la_ultima_categoria_monotributo: Peso;
    private inflacion_proyectada_mensual: any;
    private precio_del_dolar_oficial_actual: any;
    private calculadora: Calculadora;

    private static ya_se_paso_el_limite_de_la_ultima_categoria_mensaje_de_error() {
        return 'Ya se paso el limite de la ultima categoria del monotributo en el pasado';
    }

    constructor(retiros_anteriores_en_el_periodo: Peso[],
                retiro_total_del_mes: Peso,
                meses_restantes_en_el_periodo: number,
                maximo_de_la_ultima_categoria_monotributo: Peso,
                inflacion_proyectada_mensual,
                precio_del_dolar_oficial_actual,
                precio_del_dolar_mep_actual) {
        this.retiros_anteriores_en_el_periodo = retiros_anteriores_en_el_periodo;
        this.retiro_total_del_mes = retiro_total_del_mes;
        this.meses_restantes_en_el_periodo = meses_restantes_en_el_periodo;
        this.maximo_de_la_ultima_categoria_monotributo = maximo_de_la_ultima_categoria_monotributo;
        this.inflacion_proyectada_mensual = inflacion_proyectada_mensual;
        this.precio_del_dolar_oficial_actual = precio_del_dolar_oficial_actual;
        this.precio_del_dolar_mep_actual = precio_del_dolar_mep_actual;
        this.calculadora = new Calculadora();
    }

    retiro_en_pesos_sugerido_para_el_mes() {
        const total_restante_en_el_periodo =
            this.restante_en_el_periodo_antes_de_subir_de_categoria(this.retiros_anteriores_en_el_periodo, this.maximo_de_la_ultima_categoria_monotributo);

        if (this.ya_se_paso_el_maximo_del_monotributo(total_restante_en_el_periodo))
            throw AsesorDeFinanzas.ya_se_paso_el_limite_de_la_ultima_categoria_mensaje_de_error();

        const inflacion_acumulada_futura = this.inflacion_acumulada_futura_en_el_periodo(this.meses_restantes_en_el_periodo, this.inflacion_proyectada_mensual);

        if (this.precio_del_dolar_oficial_actual != this.precio_del_dolar_mep_actual) {
            const brecha = this.precio_del_dolar_oficial_actual / this.precio_del_dolar_mep_actual;
            return (this.maximo_de_la_ultima_categoria_monotributo - this.retiro_total_del_mes * brecha) / (1 - brecha);
        }

        const retiro_maximo_mes_actual = total_restante_en_el_periodo / inflacion_acumulada_futura;
        const retiro_sugerido_mes_actual = this.calculadora.minimo(retiro_maximo_mes_actual, this.retiro_total_del_mes);

        return retiro_sugerido_mes_actual;
    }

// private

    private ya_se_paso_el_maximo_del_monotributo(total_restante_en_el_periodo: number) {
        return total_restante_en_el_periodo <= 0;
    }

    private restante_en_el_periodo_antes_de_subir_de_categoria(retiros_anteriores_en_el_periodo: Peso[], maximo_de_la_ultima_categoria_monotributo: number) {
        const total_meses_anteriores = this.calculadora.suma(retiros_anteriores_en_el_periodo);
        const total_restante_en_el_periodo = maximo_de_la_ultima_categoria_monotributo - total_meses_anteriores;

        return total_restante_en_el_periodo;
    }

    private inflacion_acumulada_futura_en_el_periodo(meses_restantes_en_el_periodo: number, inflacion_proyectada_mensual: number) {
        const factor_de_inflacion = 1 + inflacion_proyectada_mensual;

        let inflacion_acumulada_en_el_periodo = 1;
        for (let mes_futuro = 1; mes_futuro < meses_restantes_en_el_periodo; mes_futuro++) {
            inflacion_acumulada_en_el_periodo += Math.pow(factor_de_inflacion, mes_futuro);
        }
        return inflacion_acumulada_en_el_periodo;
    }
}

export class Calculadora {
    suma(lista_de_numeros: number[]) {
        let total = 0
        lista_de_numeros.forEach(numero_en_la_lista => total += numero_en_la_lista);
        return total;
    }

    minimo(un_numero: number, otro_numero: number) {
        return un_numero > otro_numero ?
            otro_numero : un_numero;
    }
}
