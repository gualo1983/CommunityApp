// eslint.config.js (Configurazione "flat" per ESLint v9+)
//
// Questa versione usa l'utilità FlatCompat per supportare le configurazioni
// non ancora aggiornate al nuovo sistema.

// Importa le utilità e i plugin necessari.
import path from "path";
import { fileURLToPath } from "url";

import { FlatCompat } from "@eslint/eslintrc";
import js from "@eslint/js";
import importPlugin from "eslint-plugin-import";
import promise from "eslint-plugin-promise";
import reactNative from "eslint-plugin-react-native";
import globals from "globals";
import ts from "typescript-eslint";


// Definisci il percorso del file corrente per la compatibilità
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
  baseDirectory: __dirname,
  resolvePluginsRelativeTo: __dirname,
});

export default [
  // Aggiunge la configurazione base di ESLint e TypeScript.
  js.configs.recommended,
  ...ts.configs.recommended,
  
  // Abilita le regole raccomandate per React, React Hooks e JSX A11y
  // usando l'utilità di compatibilità.
  ...compat.extends("plugin:react/recommended", "plugin:react-hooks/recommended", "plugin:jsx-a11y/recommended"),
  
  // Aggiunge la configurazione del plugin react-native
  ...compat.extends("plugin:react-native/all"),
  
  // Aggiunge le regole di Prettier disabilitando quelle in conflitto.
  ...compat.extends("prettier"),
  
  // Definisce i file da analizzare
  {
    files: ["**/*.{js,jsx,ts,tsx}"],
  },
  
  {
    // Definisce i plugin specifici.
    plugins: {
      import: importPlugin,
      promise,
      "react-native": reactNative,
    },
    
    // Definisce le impostazioni del linter
    languageOptions: {
      parser: ts.parser,
      ecmaVersion: "latest",
      sourceType: "module",
      globals: {
        ...globals.browser,
        ...globals.es2021,
      },
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    
    // Regole del linter personalizzate e sovrascritte.
    rules: {
      "react/prop-types": "off",
      "react/react-in-jsx-scope": "off",
      "@typescript-eslint/no-explicit-any": "warn",
      
      // Regole per il plugin eslint-plugin-import
      "import/no-unresolved": "error",
      "import/order": [
        "error",
        {
          "newlines-between": "always",
          "groups": ["builtin", "external", "internal", "parent", "sibling", "index"],
        },
      ],
      
      // Regole per il plugin eslint-plugin-promise
      "promise/always-return": "error",
      "promise/no-return-wrap": "error",
      "promise/param-names": "error",
      "promise/catch-or-return": "error",
      "promise/no-promise-in-callback": "error",
    },
    settings: {
      react: {
        version: "detect",
      },
      "import/resolver": {
        typescript: {},
      },
    },
  },
];


// comando da usare per trovare errori:
// npx eslint "**/*.{ts,tsx}" --fix


/*
// https://docs.expo.dev/guides/using-eslint/
const { defineConfig } = require('eslint/config');
const expoConfig = require('eslint-config-expo/flat');

// Importa esplicitamente i plugin e il parser
const pluginReact = require('eslint-plugin-react');
const pluginReactHooks = require('eslint-plugin-react-hooks');
const pluginPrettier = require('eslint-plugin-prettier');
const pluginJsxA11y = require('eslint-plugin-jsx-a11y');
const pluginReactNative = require('eslint-plugin-react-native');
const typescriptEslint = require('@typescript-eslint/eslint-plugin');
const parser = require('@typescript-eslint/parser');

module.exports = defineConfig([
  // Estende la configurazione di base di Expo per React Native
  expoConfig,
  {
    // Ignora la directory di distribuzione
    ignores: ['dist/*'],
  },
  {
    // Applica a file specifici
    //  * * / *.  tutto attaccato
    files: ['***.{ts,tsx}'],
    languageOptions: {
      parser: parser,
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    plugins: {
      'react': pluginReact,
      'react-hooks': pluginReactHooks,
      'prettier': pluginPrettier,
      'jsx-a11y': pluginJsxA11y,
      'react-native': pluginReactNative,
      '@typescript-eslint': typescriptEslint
    },
    rules: {
      // Sovrascrivi o aggiungi regole personalizzate qui
      'react/prop-types': 'off', // Disabilita prop-types poiché usiamo TypeScript
      'react/react-in-jsx-scope': 'off', // Non necessario con la nuova JSX transform di React 17+

      // Regole di accessibilità per JSX
      'jsx-a11y/alt-text': 'error',
      'jsx-a11y/accessible-emoji': 'off',

      // Migliora le regole per l'import
      'import/no-unresolved': 'error',
      'import/order': ['error', {
        'newlines-between': 'always',
        'groups': ['builtin', 'external', 'internal', 'parent', 'sibling', 'index'],
      }],

      // Regole per prevenire l'uso di 'any' in TypeScript
      '@typescript-eslint/no-explicit-any': 'warn',

      // Regole specifiche per React Native
      'react-native/no-unused-styles': 'warn',
      'react-native/split-platform-components': 'error',
      'react-native/no-inline-styles': 'error', // Consiglia l'uso di StyleSheet.create
      // 'react-native/no-color-literals': 'error', // Regola rimossa perché non supportata
      // 'react-native/no-invalid-styles': 'error', // Regola rimossa perché non supportata

      // Regola per i warning di Prettier
      'prettier/prettier': 'error',
    },
    settings: {
      // Impostazioni per il resolver degli import di TypeScript
      'import/resolver': {
        typescript: {},
      },
      // Impostazioni per React
      react: {
        version: 'detect',
      },
    },
  },
  {
    // Configurazione specifica per il file di configurazione stesso
    files: ['eslint.config.js'],
    rules: {
      'no-undef': 'off', // A volte necessario in file di configurazione
      '@typescript-eslint/no-var-requires': 'off',
    },
  }
]);

*/


/*
// https://docs.expo.dev/guides/using-eslint/
const { defineConfig } = require('eslint/config');
const expoConfig = require('eslint-config-expo/flat');

module.exports = defineConfig([
  expoConfig,
  {
    ignores: ['dist/*'],
  },
]);
*/