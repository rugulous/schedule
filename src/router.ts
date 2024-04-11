import { createRouter, createWebHistory } from "vue-router";

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [{
        name: "schedule",
        path: "/",
        component: () => import('./views/Schedule.vue')
    }]
});

export default router;