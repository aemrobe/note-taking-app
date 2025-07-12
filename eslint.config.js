import pluginJs from "@eslint/js";
import pluginReact from "eslint-plugin-react";
import pluginJsxAlly from "eslint-plugin-jsx-a11y";
import globals from "globals";

import pluginReactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";

export default [
  { ignores: ["node_modules/", "dist/", ".vite/", "build/"] },
  {
    files: ["**/*.{js,mjs,cjs,jsx}"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      parserOptions: {
        ecmaFeatures: {
          jsx: true, // Enable JSX parsing
        },
      },
      globals: {
        ...globals.browser, // Include browser-specific global variables
        // If you also have Node.js code, you might add: ...globals.node
      },
    },
    plugins: {
      js: pluginJs,
      react: pluginReact,
      "react-hooks": pluginReactHooks,
      "react-refresh": reactRefresh,
      "jsx-a11y": pluginJsxAlly,
    },

    // Settings for plugins, particularly important for 'eslint-plugin-react'
    settings: {
      react: {
        version: "detect", // Automatically detect the React version
      },
      jsx: {
        runtime: "automatic", // Use the new JSX transform (React 17+)
      },
      "import/resolver": {
        node: {
          extensions: [".js", ".jsx", ".mjs"], // Add file extensions your project uses
        },
      },
    },

    rules: {
      ...pluginJs.configs.recommended.rules,
      ...pluginReact.configs.recommended.rules,
      ...pluginReactHooks.configs.recommended.rules,
      ...pluginJsxAlly.configs.recommended.rules,

      //Turn off urles related to the old JSX transform
      "react/react-in-jsx-scope": "off",
      "react/jsx-uses-react": "off",

      "react/prop-types": "off", // Disable the rule of prop types
      "no-unused-vars": "warn", //warn about unsued variables
      "no-undef": "error",
      "no-console": ["warn", { allow: ["warn", "error"] }],
    },
  },
];
