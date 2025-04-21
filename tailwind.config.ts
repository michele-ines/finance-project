import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      screens: {
        // Se quiser manter os breakpoints padrões, inclua-os aqui também.
        sm: '640px',
        md: '768px',
        lg: '1024px',
        xl: '1280px',
        '2xl': '1536px',
  
        // Adicionando um breakpoint customizado chamado 'desktop'
        desktop: '1024px'
      },
      borderRadius: {
        'md': '8px',
      },
      colors: {
        background: 'var(--background)',
        foreground: 'var(--foreground)',

        // Personalizadas
        'byte-black': 'var(--byte-color-black)',
        'byte-error': 'var(--byte-color-error)',
        'byte-red-500': 'var(--byte-color-red-500)',
        'byte-orange-500': 'var(--byte-color-orange-500)',
        'byte-orange-300': 'var(--byte-color-orange-300)',
        'byte-green-500': 'var(--byte-color-green-500)',
        'byte-green-100': 'var(--byte-color-green-100)',
        'byte-blue-500': 'var(--byte-color-blue-500)',
        'byte-purple-500': 'var(--byte-color-purple-500)',
        'byte-magenta-500': 'var(--byte-color-magenta-500)',
        'byte-gray-100': 'var(--byte-gray-100)',
        'byte-gray-200': 'var(--byte-gray-200)',
        'byte-gray-800': 'var(--byte-gray-800)',
      },
      fontFamily: {
        inter: ['var(--font-inter)', 'sans-serif'],
      },
      fontWeight: {
        normal: 'var(--font-normal)',
        medium: 'var(--font-medium)',
        semibold: 'var(--font-semibold)',
        bold: 'var(--font-bold)',
      },
    },
  },
  darkMode: 'media',
  plugins: [],
};

export default config;
