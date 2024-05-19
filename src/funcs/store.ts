import {reactive} from 'vue'
import type {PlayerProfile} from "@/funcs/bungie";

// @ts-ignore
export const store: {[id: string]: PlayerProfile} = reactive({currentAccount: null})

