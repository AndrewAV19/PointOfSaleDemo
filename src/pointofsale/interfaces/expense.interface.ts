import { Shopping } from "./shopping.interface";

export interface DailyExpenseDTO {
    totalExpense: number;
    numberOfTransactions: number;
    averageTicket: number;
    expenseByHour: { [hour: number]: number };
    lastFiveTransactions: Shopping[];
  }
  
  export interface MonthlyExpenseDTO {
    totalExpense: number;
    numberOfTransactions: number;
    averageTicket: number;
    expenseByDay: { [day: number]: number };
    lastFiveTransactions: Shopping[];
  }
  
  export interface YearlyExpenseDTO {
    totalExpense: number;
    numberOfTransactions: number;
    averageTicket: number;
    expenseByMonth: { [month: number]: number };
    lastFiveTransactions: Shopping[];
  }
  