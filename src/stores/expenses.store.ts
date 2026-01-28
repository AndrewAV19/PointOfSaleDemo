import { StateCreator, create } from "zustand";
import { persist } from "zustand/middleware";
import { DailyExpenseDTO, MonthlyExpenseDTO, YearlyExpenseDTO } from "../pointofsale/interfaces/expense.interface";
import { ExpenseService } from "../services/expenses.service";


interface ExpenseState {
  dailyExpense: DailyExpenseDTO | null;
  monthlyExpense: MonthlyExpenseDTO | null;
  yearlyExpense: YearlyExpenseDTO | null;
  loading: boolean;

  getDailyExpense: (year: number, month: number, day: number) => Promise<void>;
  getMonthlyExpense: (year: number, month: number) => Promise<void>;
  getYearlyExpense: (year: number) => Promise<void>;

  clearDailyExpense: () => void;
  clearMonthlyExpense: () => void;
  clearYearlyExpense: () => void;
}

const expenseStore: StateCreator<ExpenseState> = (set) => ({
  dailyExpense: null,
  monthlyExpense: null,
  yearlyExpense: null,
  loading: false,

  // Obtener el egreso diario
  getDailyExpense: async (year: number, month: number, day: number) => {
    try {
      set({ loading: true });
      const dailyExpense = await ExpenseService.getDailyExpense(year, month, day);
      set({ dailyExpense, loading: false });
    } catch (error) {
      console.error(error);
      set({ dailyExpense: null, loading: false });
      throw new Error("Error al obtener el egreso diario");
    }
  },

  // Obtener el egreso mensual
  getMonthlyExpense: async (year: number, month: number) => {
    try {
      set({ loading: true });
      const monthlyExpense = await ExpenseService.getMonthlyExpense(year, month);
      set({ monthlyExpense, loading: false });
    } catch (error) {
      console.error(error);
      set({ monthlyExpense: null, loading: false });
      throw new Error("Error al obtener el egreso mensual");
    }
  },

  // Obtener el egreso anual
  getYearlyExpense: async (year: number) => {
    try {
      set({ loading: true });
      const yearlyExpense = await ExpenseService.getYearlyExpense(year);
      set({ yearlyExpense, loading: false });
    } catch (error) {
      console.error(error);
      set({ yearlyExpense: null, loading: false });
      throw new Error("Error al obtener el egreso anual");
    }
  },

  clearDailyExpense: () => set({ dailyExpense: null }),

  clearMonthlyExpense: () => set({ monthlyExpense: null }),

  clearYearlyExpense: () => set({ yearlyExpense: null }),
});

export const useExpenseStore = create<ExpenseState>()(
  persist(expenseStore, {
    name: "expense-data",
  })
);
