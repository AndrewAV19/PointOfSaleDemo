import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Definición de paletas de colores
export const COLOR_THEMES = {
  AZUL_PROFESIONAL: {
    name: 'Azul Profesional',
    colors: {
      primary: "#2563EB",
      secondary: "#F59E0B",
      accent: "#10B981",
      background: "#0F172A",
      surface: "#1E293B",
      textPrimary: "#F1F5F9",
      textSecondary: "#94A3B8",
      border: "#334155",
      hover: "#334155",
      active: "#3B82F6",
      success: "#10B981",
      warning: "#F59E0B",
      error: "#EF4444",
    }
  },
  VIOLETA_ELEGANTE: {
    name: 'Violeta Elegante',
    colors: {
      primary: "#7C3AED",
      secondary: "#EC4899",
      accent: "#06B6D4",
      background: "#111827",
      surface: "#1F2937",
      textPrimary: "#F9FAFB",
      textSecondary: "#D1D5DB",
      border: "#374151",
      hover: "#374151",
      active: "#8B5CF6",
      success: "#10B981",
      warning: "#F59E0B",
      error: "#EF4444",
    }
  },
  VERDE_COMERCIAL: {
    name: 'Verde Comercial',
    colors: {
      primary: "#059669",
      secondary: "#DC2626",
      accent: "#2563EB",
      background: "#0C0F19",
      surface: "#161B26",
      textPrimary: "#E2E8F0",
      textSecondary: "#CBD5E1",
      border: "#2D3748",
      hover: "#2D3748",
      active: "#10B981",
      success: "#10B981",
      warning: "#F59E0B",
      error: "#EF4444",
    }
  }
};

export type ThemeKey = keyof typeof COLOR_THEMES;
export type ColorPalette = typeof COLOR_THEMES.AZUL_PROFESIONAL.colors;

interface ThemeState {
  currentTheme: ThemeKey;
  colorPalette: ColorPalette;
  setTheme: (theme: ThemeKey) => void;
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      currentTheme: 'VIOLETA_ELEGANTE',
      colorPalette: COLOR_THEMES.VIOLETA_ELEGANTE.colors,
      setTheme: (theme: ThemeKey) => set({ 
        currentTheme: theme,
        colorPalette: COLOR_THEMES[theme].colors
      }),
    }),
    {
      name: 'theme-storage',
    }
  )
);