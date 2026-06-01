import { VueQueryPlugin } from "@tanstack/vue-query";
import { createPinia } from "pinia";
import { createApp } from "vue";
import "./shared/styles/main.scss";

import App from "./App.vue";
import { ensureAnonymousSession } from "./lib/auth-client";
import router from "./router";

const app = createApp(App);
const pinia = createPinia();

void ensureAnonymousSession().catch((error) => {
  if (import.meta.env.DEV) {
    console.error("Failed to bootstrap anonymous session.", error);
  }
});

app.use(pinia);
app.use(router);
app.use(VueQueryPlugin);

app.mount("#app");
