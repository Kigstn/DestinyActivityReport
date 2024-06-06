import {type Ref, ref} from 'vue'
import type {ManifestActivity, PlayerProfile} from "@/funcs/bungie";
import {defineStore} from "pinia";
import {useLocalStorage} from "@vueuse/core";
import {getDestinyManifest} from "bungie-api-ts/destiny2";
import {bungieClient} from "@/funcs/bungieClient";
import {getManifestActivities} from "@/funcs/bungie";
import {resolve} from "chart.js/helpers";


export const useDestinyManifestStore = defineStore('destinyManifest', () => {
    // get the manifest data for the activities
    // make sure to check if the version changed - else do not re-download
    const manifest = useLocalStorage("destinyManifest", {
        version: "empty",
        activities: [["emptyKey", {}]],
        modes: ["empty"],
        tags: ["empty"],
        maxPlayers: 0,
    })

    async function updateManifest() {
        const data = await getDestinyManifest(bungieClient)
        if (data.Response.version != manifest.value.version) {
            const {activities, modes, tags, maxPlayers} = await getManifestActivities(data.Response)
            // @ts-ignore
            manifest.value.tags = tags
            manifest.value.activities = activities
            manifest.value.modes = modes
            manifest.value.maxPlayers = maxPlayers

            manifest.value.version = data.Response.version
        }
    }

    updateManifest().then(() => {
        return {manifest, updateManifest}
    })
})

export const useFilterStore = defineStore('filter', () => {
    const destinyManifest = useDestinyManifestStore()

    // todo share the state. maybe solved when we do hot reloading

    // filters
    const activityNameFilter: Ref<string> = ref("")
    const activityModeFilter: Ref<string[]> = ref([])
    const activityTagsFilter: Ref<string[]> = ref([])
    const achievementTagsFilter: Ref<string[]> = ref([])
    const activityMaxPlayerCountFilter: Ref<number> = ref(destinyManifest.manifest.maxPlayers)

    function resetFilters() {
        activityNameFilter.value = ""
        activityModeFilter.value = []
        activityTagsFilter.value = []
        achievementTagsFilter.value = []
        activityMaxPlayerCountFilter.value = destinyManifest.manifest.maxPlayers
    }

    return {
        resetFilters,
        activityNameFilter,
        activityModeFilter,
        activityTagsFilter,
        achievementTagsFilter,
        activityMaxPlayerCountFilter
    }
})
export const useSortingStore = defineStore('sorting', () => {
    const activitySortingOptions = {
        "Activity Info": [
            "Activity Mode",
            "Activity Name"
        ]
    }
    const activitySortingType: Ref<"Activity Name" | "Activity Mode"> = ref("Activity Mode")
    const activitySortingMode: Ref<"Asc." | "Desc."> = ref("Asc.")

    function resetSorting() {
        activitySortingType.value = "Activity Mode"
        activitySortingMode.value = "Asc."
    }

    return {
        resetSorting,
        activitySortingOptions,
        activitySortingType,
        activitySortingMode
    }
})

export const useSharedData = defineStore('pinnedActivities', () => {
    const destinyManifest = useDestinyManifestStore()

    // @ts-ignore
    const currentAccount: Ref<PlayerProfile> = ref(null)

    const firstSiteVisit = useLocalStorage("firstVisit", true)
    const pinnedActivities = useLocalStorage("pinnedActivities", new Set())

    // pin some default activities on first site visit
    if (firstSiteVisit.value && pinnedActivities.value.size == 0) {
        for (const entry of destinyManifest.manifest.activities) {
            const data: ManifestActivity | any = entry[1]
            if (data.name.includes("All - ")) {
                pinnedActivities.value.add(data.name)
            }
        }
        firstSiteVisit.value = false
    }
    return {pinnedActivities, currentAccount}
})