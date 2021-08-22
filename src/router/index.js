import { createWebHistory, createRouter } from "vue-router";
import Home from "../views/Home.vue";
import About from "../views/About.vue";
import Profile from "../views/Profile.vue";
import Callback from '../views/Callback.vue'
import ErrorPage from '../views/Error.vue'

import { routeGuard } from '../auth'

const routes = [
    {
        path: "/",
        name: "Home",
        component: Home,
    },
     {
        path: "/about",
        name: "about",
        component: About,
    },
    {
        path: "/profile",
        name: "Profile",
        component: Profile,
        beforeEnter: routeGuard
    },
    {
        path: '/callback',
        name: 'Callback',
        component: Callback
    },
    {
        path: '/error',
        name: 'Error',
        component: ErrorPage,
    }
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

export default router;