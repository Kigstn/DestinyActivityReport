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


export async function getManifestActivities(destinyManifest: DestinyManifest) {
    const url = 'https://www.bungie.net' + destinyManifest.jsonWorldComponentContentPaths["en"]["DestinyActivityDefinition"]
    const r = await fetch(url)
    const res = await r.json()

    // only return the relevant data - otherwise it is too big
    const data: {
        [id: string]: {
            name: string,
            description: string,
            destination: string,
            imageUrl: string,
            isPlaylist: boolean,
            requirements: string[],
            isMatchmade: boolean,
            maxPlayers: number,
            activityModeHashes: string,
            activityModeTypes: string,
            isPvp: boolean,
            redacted: boolean,
            blaclisted: boolean,
        }
    } = {}
    for (const [key, value] of Object.entries(res)) {
        if (typeof value === "object" && value !== null) {
            const requirements: string[] = []
            if (value.requirements) {
                for (const [k, v] of Object.entries(value.requirements.leaderRequirementLabels)) {
                    if (typeof v === "string") {
                        requirements.push(v)
                    }
                }
            }
            let isMatchmade = false
            let maxPlayers = -1
            if (value.matchmaking) {
                isMatchmade = value.matchmaking.isMatchmade
                maxPlayers = value.matchmaking.maxPlayers
            }
            
            data[key] = {
                name: value.displayProperties.name,
                description: value.displayProperties.description,
                destination: value.destinationHash.toString(),
                imageUrl: "https://www.bungie.net" + value.pgcrImage,
                isPlaylist: value.isPlaylist,
                requirements: requirements,
                isMatchmade: isMatchmade,
                maxPlayers: maxPlayers,
                activityModeHashes: value.activityModeHashes,
                activityModeTypes: value.activityModeTypes,
                isPvp: value.isPvp,
                redacted: value.redacted,
                blaclisted: value.blaclisted,
            }
        }
    }
    return data

    // const manifestTables = await getDestinyManifestSlice(bungieClient, {
    //   destinyManifest: destinyManifest,
    //   tableNames: ["DestinyActivityDefinition"],
    //   language: "en",
    // })
    //
    // // manifestTables is an object with properties DestinyActivityDefinition
    // return manifestTables.DestinyActivityDefinition
}




