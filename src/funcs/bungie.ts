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

export async function getActivities(destinyMembershipId: any, membershipType: any) {
    membershipType = convertMembershipType(membershipType)

    const data: DestinyHistoricalStatsPeriodGroup[] = []

    // on dev - do not run everything, use my credentials
    if (import.meta.env.DEV) {
        console.log("DEV: Running with hardcoded destiny data")
        await _getActivities("4611686018467765462", 3, "2305843009302043968", data)
        return data
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

    return data
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
    // get the activity mode defintions - we need them for tags
    let url = 'https://www.bungie.net' + destinyManifest.jsonWorldComponentContentPaths["en"]["DestinyActivityTypeDefinition"]
    let r = await fetch(url)
    const manifestActivityTypes = await r.json()

    // get the activities
    url = 'https://www.bungie.net' + destinyManifest.jsonWorldComponentContentPaths["en"]["DestinyActivityDefinition"]
    r = await fetch(url)
    const res = await r.json()

    // only return the relevant data - otherwise it is too big
    const data: { [id: string]: ManifestActivity } = {}
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

            data[key] = {
                name: name,
                description: value.displayProperties.description,
                destination: value.destinationHash.toString(),
                imageUrl: "https://www.bungie.net" + value.pgcrImage,
                isPlaylist: value.isPlaylist,
                isMatchmade: isMatchmade,
                maxPlayers: maxPlayers,
                activityMode: activityMode,
                isPvp: value.isPvp,
                redacted: value.redacted,
                blacklisted: value.blaclisted,
            }
        }
    }
    return data
}




