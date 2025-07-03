import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";
import typescriptEslint from "@typescript-eslint/eslint-plugin";
import typescriptParser from "@typescript-eslint/parser";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

/** @type {import('eslint').Linter.FlatConfig[]} */
const eslintConfig = [
  // 1. Configuração base do Next.js
  ...compat.extends("next/core-web-vitals"),

  // 2. Nossa configuração robusta para arquivos TypeScript
  {
    files: ["**/*.{ts,tsx}"], // Aplica estas regras apenas para arquivos .ts e .tsx
    plugins: {
      "@typescript-eslint": typescriptEslint,
    },
    languageOptions: {
      parser: typescriptParser,
      parserOptions: {
        project: true, // Essencial: habilita regras que precisam de informações de tipo
        tsconfigRootDir: __dirname,
      },
    },
    rules: {
      // Ativa o conjunto de regras mais forte, que usa o type checker
      ...typescriptEslint.configs["recommended-type-checked"].rules,
      
      // (Opcional) Você pode sobrescrever ou adicionar regras específicas aqui
      // Exemplo: Sinaliza o uso de `any` como um aviso (warning) em vez de erro
      "@typescript-eslint/no-explicit-any": "warn",
      
      // Exemplo: Garante que funções que retornam Promises sejam `async`
      "@typescript-eslint/promise-function-async": "error",
    },
  },
];

export default eslintConfig;