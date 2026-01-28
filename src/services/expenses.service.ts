import api from "../lib/axios";
import { DailyExpenseDTO, MonthlyExpenseDTO, YearlyExpenseDTO } from "../pointofsale/interfaces/expense.interface";

export class ExpenseService {
  static readonly getDailyExpense = async (
    year: number,
    month: number,
    day: number
  ): Promise<DailyExpenseDTO> => {
    try {
      const response = await api.get<DailyExpenseDTO>("/shoppings/daily-expense", {
        params: { year, month, day },
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      });
      console.log(response.data);
      return response.data;
    } catch (error) {
      console.error(error);
      throw new Error("Error al obtener el egreso diario");
    }
  };

  static readonly getMonthlyExpense = async (
    year: number,
    month: number
  ): Promise<MonthlyExpenseDTO> => {
    try {
      const response = await api.get<MonthlyExpenseDTO>("/shoppings/monthly-expense", {
        params: { year, month },
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      });
      console.log(response.data);
      return response.data;
    } catch (error) {
      console.error(error);
      throw new Error("Error al obtener el egreso mensual");
    }
  };

  static readonly getYearlyExpense = async (
    year: number
  ): Promise<YearlyExpenseDTO> => {
    try {
      const response = await api.get<YearlyExpenseDTO>("/shoppings/yearly-expense", {
        params: { year },
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      });
      console.log(response.data);
      return response.data;
    } catch (error) {
      console.error(error);
      throw new Error("Error al obtener el egreso anual");
    }
  };
}