type Peso = number;

function suggested_salary_in_pesos_for_the_month(previous_salaries_during_period: Peso[], total_salary_for_current_month: Peso,
                                                 months_left_in_period: number, limit_for_the_period: Peso): Peso {
    let total_for_previous_months = previous_salaries_during_period.reduce(
        (sum, current) => sum + current);
    let total_including_current_salary = total_for_previous_months + total_salary_for_current_month;

    if (total_including_current_salary > limit_for_the_period)
        return total_including_current_salary - limit_for_the_period;
    else
        return total_salary_for_current_month;
}

describe("Suggested salary in pesos for the month", () => {
    test('When the limit for the period cant be reached, the totality of the salary is suggested in pesos', () => {
        let previous_salaries_during_period: Peso[] = [10, 10]
        let total_salary_for_current_month: Peso = 10
        let months_left_in_the_period: number = 1
        let limit_for_the_period: Peso = 40

        let suggested_salary_in_pesos = suggested_salary_in_pesos_for_the_month(
            previous_salaries_during_period,
            total_salary_for_current_month,
            months_left_in_the_period,
            limit_for_the_period
        )
        expect(suggested_salary_in_pesos).toBe(10);
    });

    test('When the limit for the period can be reached, the suggested salary is the maximum before going over the limit', () => {
        let previous_salaries_during_period: Peso[] = [10, 10]
        let total_salary_for_current_month: Peso = 10
        let months_left_in_the_period: number = 1
        let limit_for_the_period: Peso = 25

        let suggested_salary_in_pesos = suggested_salary_in_pesos_for_the_month(
            previous_salaries_during_period,
            total_salary_for_current_month,
            months_left_in_the_period,
            limit_for_the_period
        )
        expect(suggested_salary_in_pesos).toBe(5);
    });
});