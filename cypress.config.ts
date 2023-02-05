import { defineConfig } from "cypress";
import path from 'path';

export default defineConfig({
  viewportWidth: 1024,
  viewportHeight: 768,
  env: {
    path: path.join(process.cwd(), "/"),
  },
  e2e: {
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
    
  },
});
