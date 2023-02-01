import { defineConfig } from "cypress";

export default defineConfig({
  viewportWidth: 1024,
  viewportHeight: 768,
  e2e: {
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
    
  },
});
