import api from "../lib/axios";
import { DailyIncomeDTO, MonthlyIncomeDTO, YearlyIncomeDTO } from "../pointofsale/interfaces/icome.interface";


export class IncomeService {
  static readonly getDailyIncome = async (
    year: number,
    month: number,
    day: number
  ): Promise<DailyIncomeDTO> => {
    try {
      const response = await api.get<DailyIncomeDTO>("/sales/daily-income", {
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
      throw new Error("Error al obtener el ingreso diario");
    }
  };

  static readonly getMonthlyIncome = async (
    year: number,
    month: number
  ): Promise<MonthlyIncomeDTO> => {
    try {
      const response = await api.get<MonthlyIncomeDTO>("/sales/monthly-income", {
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
      throw new Error("Error al obtener el ingreso mensual");
    }
  };

  static readonly getYearlyIncome = async (
    year: number
  ): Promise<YearlyIncomeDTO> => {
    try {
      const response = await api.get<YearlyIncomeDTO>("/sales/yearly-income", {
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
      throw new Error("Error al obtener el ingreso anual");
    }
  };
}