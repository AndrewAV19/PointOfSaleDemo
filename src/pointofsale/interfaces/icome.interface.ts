import { Sale } from "./sales.interface";

export interface DailyIncomeDTO {
    totalIncome: number;
    numberOfTransactions: number;
    averageTicket: number;
    incomeByHour: { [hour: number]: number };
    lastFiveTransactions: Sale[];
  }

  export interface MonthlyIncomeDTO {
    totalIncome: number;
    numberOfTransactions: number;
    averageTicket: number;
    incomeByDay: { [day: number]: number };
    lastFiveTransactions: Sale[];
  }
  
  export interface YearlyIncomeDTO {
    totalIncome: number;
    numberOfTransactions: number;
    averageTicket: number;
    incomeByMonth: { [month: number]: number };
    lastFiveTransactions: Sale[];
  }