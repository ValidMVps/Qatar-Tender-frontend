// lib/theme.ts
export const theme = {
  colors: {
    primary: {
      50: 'bg-blue-50',
      100: 'bg-blue-100',
      500: 'bg-blue-500',
      600: 'bg-blue-600',
      700: 'bg-blue-700',
    },
    secondary: {
      50: 'bg-indigo-50',
      100: 'bg-indigo-100',
      600: 'bg-indigo-600',
      700: 'bg-indigo-700',
    },
    neutral: {
      50: 'bg-slate-50',
      200: 'bg-slate-200',
      600: 'text-slate-600',
      900: 'text-slate-900',
    }
  },
  gradients: {
    primary: 'bg-gradient-to-r from-blue-600 to-indigo-600',
    primaryHover: 'hover:from-blue-700 hover:to-indigo-700',
    light: 'bg-gradient-to-br from-blue-50 to-indigo-50',
  }
}