import {
    type DestinyHistoricalStatsPeriodGroup,
    type DestinyManifest,
    getActivityHistory,
    getDestinyManifestSlice,
    getHistoricalStatsForAccount
} from 'bungie-api-ts/destiny2';
import {bungieClient} from "./bungieClient.ts";


// convert to correct membership type
const membershipTypes: { [id: string]: number } = {
    "xb": 1,
    "ps": 2,
    "pc": 3,
    "stadia": 5,
    "egs": 6,
}

function convertMembershipType(membershipType: string | number): number {
    const err = new Error("Unknown MembershipType")

    if (membershipType in membershipTypes) {
        membershipType = membershipTypes[membershipType]
    } else if (typeof membershipType == "string") {
        try {
            membershipType = parseInt(membershipType)
        } catch (e) {
            throw err
        }
    }
    if (!(membershipType in [1, 2, 3, 5, 6])) {
        throw err
    }

    return membershipType
}

// ---

export interface PlayedActivities extends DestinyHistoricalStatsPeriodGroup {
    datetime: Date,
    completed: boolean,
    lengthSeconds: number,
    specialTags: string[]
}

export async function getActivities(destinyMembershipId: any, membershipType: any) {
    membershipType = convertMembershipType(membershipType)

    const data: DestinyHistoricalStatsPeriodGroup[] = []

    // on dev - do not run everything, use my credentials
    if (import.meta.env.DEV) {
        console.log("DEV: Running with hardcoded destiny data")
        await _getActivities("4611686018467765462", 3, "2305843009302043968", data)
        return _calcExtras(data)
    }

    // get character ids and gen functions
    // use the stats page to also get deleted chars
    const charData = await getHistoricalStatsForAccount(bungieClient, {
        membershipType: membershipType,
        destinyMembershipId: destinyMembershipId,
        groups: [0],
    })
    const funcs = []
    for (const char of charData.Response.characters) {
        funcs.push(_getActivities(destinyMembershipId, membershipType, char.characterId, data))
    }

    // call the all in parallel
    await Promise.all(funcs)

    return _calcExtras(data)
}

function _calcExtras(data: DestinyHistoricalStatsPeriodGroup[]) {
    // do the calculations we need on it
    const finalEntries: PlayedActivities[] = []
    for (const _entry of data) {
        const entry = _entry as PlayedActivities
        entry.datetime = new Date(entry.period)
        const completed = entry.values.completed.basic.value == 1 && entry.values.completionReason.basic.value == 0
        entry.completed = completed
        entry.lengthSeconds = entry.values.activityDurationSeconds.basic.value

        // special clear?
        entry.specialTags = []
        if (completed) {
            const playerCount = entry.values.playerCount.basic.value
            const flawless = entry.values.deaths.basic.value

            if (playerCount == 1 && flawless) {
                entry.specialTags.push("Solo Flawless")
            } else if (flawless) {
                entry.specialTags.push("Personal Flawless")
            } else if (playerCount == 1) {
                entry.specialTags.push("Solo")
            }

            // special behaviour for raids
            if (entry.activityDetails.mode == 4) {
                if (playerCount == 2) {
                    entry.specialTags.push("Duo")
                } else if (playerCount == 3) {
                    entry.specialTags.push("Trio")
                }
            }

            // special behaviour for dungeons
            if (entry.activityDetails.mode == 82) {
                if (playerCount == 2) {
                    entry.specialTags.push("Duo")
                }
            }
        }
        finalEntries.push(entry)
    }

    return finalEntries
}

async function _getActivities(destinyMembershipId: string, membershipType: number, characterId: string, data: DestinyHistoricalStatsPeriodGroup[]) {
    // run until there is no more entries
    let page: number = 0
    while (true) {
        const r = await getActivityHistory(bungieClient, {
            membershipType: membershipType,
            destinyMembershipId: destinyMembershipId,
            characterId: characterId,
            page: page,
            count: 250,
        })

        // break if empty, fe. when pages are over
        if (!r.Response.activities) {
            break
        }

        // add the activities to our master list
        data.push(...r.Response.activities)

        // on dev - just first page
        if (import.meta.env.DEV) {
            break
        }

        // do it all again
        page += 1
    }
}

export interface ManifestActivity {
    hash: string[],
    name: string,
    description: string,
    destination: string,
    imageUrl: string,
    isPlaylist: boolean,
    isMatchmade: boolean,
    maxPlayers: number,
    activityMode: string,
    isPvp: boolean,
    redacted: boolean,
    blacklisted: boolean,
}

export async function getManifestActivities(destinyManifest: DestinyManifest) {
    // get the activity mode + type defintions - we need them for tags
    let url = 'https://www.bungie.net' + destinyManifest.jsonWorldComponentContentPaths["en"]["DestinyActivityTypeDefinition"]
    let r = await fetch(url)
    const manifestActivityTypes = await r.json()

    url = 'https://www.bungie.net' + destinyManifest.jsonWorldComponentContentPaths["en"]["DestinyActivityModeDefinition"]
    r = await fetch(url)
    const manifestActivityModes = await r.json()

    // get the activities
    url = 'https://www.bungie.net' + destinyManifest.jsonWorldComponentContentPaths["en"]["DestinyActivityDefinition"]
    r = await fetch(url)
    const res = await r.json()

    // only return the relevant data - otherwise it is too big
    const data: { [name: string]: ManifestActivity } = {}
    const dataModes = new Set()
    let dataMaxPlayers = 0
    for (const [key, value] of Object.entries(res)) {
        if (typeof value === "object" && value !== null) {
            // get the correct name - this is a bit tricky, since we want to group some activities
            // also for some activities, the display name sucks hard (looking at you deep dives)
            let name = value.displayProperties.name
            if (value.selectionScreenDisplayProperties) {
                if (value.selectionScreenDisplayProperties.name.includes(value.originalDisplayProperties.name)) {
                    name = value.selectionScreenDisplayProperties.name
                }
            }
            if (name == "") {
                continue
            }

            let isMatchmade = false
            let maxPlayers = 0
            if (value.matchmaking) {
                isMatchmade = value.matchmaking.isMatchmade
                maxPlayers = value.matchmaking.maxPlayers
            }
            let activityMode = "REDACTED"
            if (value.activityTypeHash) {
                activityMode = manifestActivityTypes[value.activityTypeHash].displayProperties.name
            }
            if (activityMode == "") {
                activityMode = manifestActivityModes[value.directActivityModeHash].displayProperties.name
            }

            if (name in data) {
                data[name].hash.push(key)
            } else {
                data[name] = {
                    hash: [key],
                    name: name,
                    description: value.displayProperties.description,
                    destination: value.destinationHash.toString(),
                    imageUrl: "https://www.bungie.net" + value.pgcrImage,
                    isPlaylist: value.isPlaylist,
                    isMatchmade: isMatchmade,
                    maxPlayers: maxPlayers,
                    activityMode: activityMode,
                    isPvp: value.isPvP,
                    redacted: value.redacted,
                    blacklisted: value.blacklisted,
                }
            }

            dataModes.add(activityMode)
            if (maxPlayers > dataMaxPlayers) {
                dataMaxPlayers = maxPlayers
            }
        }
    }

    // sort them by mode and then by name
    const partlySorted = Object.entries(data).sort((a, b) => {
            if (a[1].activityMode > b[1].activityMode) {
                return 1
            } else if (a[1].activityMode == b[1].activityMode) {
                return 0
            } else {
                return -1
            }
        }
    )
    // if mode is same check name
    return {
        activities: partlySorted.sort((a, b) => {
            // check mode - if same check name
            if (a[1].activityMode == b[1].activityMode) {
                if (a[1].activityMode > b[1].activityMode) {
                    return 1
                } else if (a[1].activityMode == b[1].activityMode) {
                    return 0
                } else {
                    return -1
                }
            } else {
                return -1
            }
        }),
        modes: [...dataModes],
        maxPlayers: dataMaxPlayers,
    }
}




