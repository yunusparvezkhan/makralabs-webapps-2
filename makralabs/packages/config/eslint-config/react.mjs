import { defineConfig } from "eslint/config";

export default defineConfig([
  {
    files: ["**/*.{ts,tsx,js,jsx}"],
    rules: {
      "no-unused-vars": "warn"
    }
  }
]);
