import {createRouter, createWebHistory} from 'vue-router'
import HomeView from '../views/HomeView.vue'
import UserView from "@/views/UserView.vue";
import UserActivityView from "@/views/UserActivityView.vue";
import PgcrView from "@/views/PgcrView.vue";

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/',
            name: 'home',
            component: HomeView,
        },
        {
            path: '/pgcr/:pgcrId:',
            name: 'Pgcr View',
            component: PgcrView,
        },
        {
            path: '/:membershipType/:membershipId',
            meta: {canPinUser: true},
            children: [
                {
                    path: '',
                    name: "User View",
                    component: UserView,
                },
                {
                    path: ':activityName',
                    name: "User Activity View",
                    component: UserActivityView,
                },
            ]
        },
    ]
})

export default router
