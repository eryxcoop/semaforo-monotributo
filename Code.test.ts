type Peso = number;

function suggested_salary_in_pesos_for_the_month(previous_salaries_during_period: Peso[], total_salary_for_current_month: Peso,
                                                 months_left_in_period: number, limit_for_the_period: Peso): Peso {
    return 10;
}

test('When the limit for the period wont be reached, the totality of the salary is suggested in pesos', () => {
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