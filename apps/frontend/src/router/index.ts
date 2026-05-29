import { createRouter, createWebHistory } from "vue-router";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: () => import("@/pages/home/home-page.vue"),
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
      path: "/artists/:name/discography",
      name: "artist-discography",
      component: () => import("@/pages/artists/artist-discography-page.vue"),
    },
    {
      path: "/artists/:name",
      name: "artists-detail",
      component: () => import("@/pages/artists/artists-detail.vue"),
    },
    {
      path: "/radio/:id",
      name: "station-detail",
      component: () => import("@/pages/radio/station-detail.vue"),
    },
    {
      path: "/genres",
      name: "genres",
      component: () => import("@/pages/genres/genres-page.vue"),
    },
    {
      path: "/favorites",
      name: "favorites",
      component: () => import("@/pages/favorites/favorites-page.vue"),
    },
    {
      path: "/profile",
      name: "profile",
      component: () => import("@/pages/profile/profile-page.vue"),
    },
  ],
});

export default router;
