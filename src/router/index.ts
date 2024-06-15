import {createRouter, createWebHistory} from 'vue-router'
import HomeView from '../views/HomeView.vue'
import UserView from "@/views/UserView.vue";
import UserActivityView from "@/views/UserActivityView.vue";

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/',
            name: 'home',
            component: HomeView,
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
