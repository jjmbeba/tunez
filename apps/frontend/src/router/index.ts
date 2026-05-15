import { createRouter, createWebHistory } from "vue-router";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      redirect: "/radio",
    },
    {
      path: "/radio",
      name: "radio",
      component: () => import("@/pages/radio/radio-page.vue"),
    },
    {
      path: "/artists",
      name: "artists",
      component: () => import("@/pages/artists/artists-page.vue"),
    },
    {
      path: "/genres",
      name: "genres",
      component: () => import("@/pages/genres/genres-page.vue"),
    },
    {
      path: "/favorites",
      name: "favories",
      component: () => import("@/pages/favorites/favorites-page.vue"),
    },
  ],
});

export default router;
