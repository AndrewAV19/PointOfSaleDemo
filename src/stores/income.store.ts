import { StateCreator, create } from "zustand";
import { persist } from "zustand/middleware";
import { DailyIncomeDTO, MonthlyIncomeDTO, YearlyIncomeDTO } from "../pointofsale/interfaces/icome.interface";
import { IncomeService } from "../services/icome.service";

interface IncomeState {
  dailyIncome: DailyIncomeDTO | null;
  monthlyIncome: MonthlyIncomeDTO | null;
  yearlyIncome: YearlyIncomeDTO | null;
  loading: boolean;

  getDailyIncome: (year: number, month: number, day: number) => Promise<void>;
  getMonthlyIncome: (year: number, month: number) => Promise<void>;
  getYearlyIncome: (year: number) => Promise<void>;

  clearDailyIncome: () => void;
  clearMonthlyIncome: () => void;
  clearYearlyIncome: () => void;
}

const incomeStore: StateCreator<IncomeState> = (set) => ({
  dailyIncome: null,
  monthlyIncome: null,
  yearlyIncome: null,
  loading: false,

  // Obtener el ingreso diario
  getDailyIncome: async (year: number, month: number, day: number) => {
    try {
      set({ loading: true });
      const dailyIncome = await IncomeService.getDailyIncome(year, month, day);
      set({ dailyIncome, loading: false });
    } catch (error) {
      console.error(error);
      set({ dailyIncome: null, loading: false });
      throw new Error("Error al obtener el ingreso diario");
    }
  },

  // Obtener el ingreso mensual
  getMonthlyIncome: async (year: number, month: number) => {
    try {
      set({ loading: true });
      const monthlyIncome = await IncomeService.getMonthlyIncome(year, month);
      set({ monthlyIncome, loading: false });
    } catch (error) {
      console.error(error);
      set({ monthlyIncome: null, loading: false });
      throw new Error("Error al obtener el ingreso mensual");
    }
  },

  // Obtener el ingreso anual
  getYearlyIncome: async (year: number) => {
    try {
      set({ loading: true });
      const yearlyIncome = await IncomeService.getYearlyIncome(year);
      set({ yearlyIncome, loading: false });
    } catch (error) {
      console.error(error);
      set({ yearlyIncome: null, loading: false });
      throw new Error("Error al obtener el ingreso anual");
    }
  },

  clearDailyIncome: () => set({ dailyIncome: null }),

  clearMonthlyIncome: () => set({ monthlyIncome: null }),

  clearYearlyIncome: () => set({ yearlyIncome: null }),
});

export const useIncomeStore = create<IncomeState>()(
  persist(incomeStore, {
    name: "income-data",
  })
);