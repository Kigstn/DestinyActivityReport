import {
    DestinyComponentType,
    type DestinyDefinition,
    type DestinyHistoricalStatsPeriodGroup,
    type DestinyManifest,
    type DestinyPostGameCarnageReportData,
    getActivityHistory,
    getDestinyEntityDefinition,
    getDestinyManifestSlice,
    getHistoricalStatsForAccount,
    getPostGameCarnageReport,
    getProfile, PlatformErrorCodes,
    searchDestinyPlayerByBungieName,
} from 'bungie-api-ts/destiny2';
import {bungieClient} from "@/funcs/bungieClient";
import {counter} from "@/funcs/utils";
import {searchByGlobalNamePost, type UserInfoCard, type UserSearchResponseDetail} from "bungie-api-ts/user";
import type {PgcrWeapon} from "@/funcs/pgcrStats";
import {LRUCache} from "lru-cache";
import {blacklistedTimes} from "@/data/blacklisted_timeframes";


export function getPlatformIcon(membershipTypeStr: string) {
    const iconByPlatform: { [id: string]: string } = {
        "pc": "https://www.bungie.net/img/theme/bungienet/icons/steamLogo.png",
        "xb": "https://www.bungie.net/img/theme/bungienet/icons/xboxLiveLogo.png",
        "ps": "https://www.bungie.net/img/theme/bungienet/icons/psnLogo.png",
        "epic": "https://www.bungie.net/img/theme/destiny/icons/icon_egs.png",
        "stadia": "https://www.bungie.net/img/theme/bungienet/icons/stadiaLogo.png",
    }
    let platformIcon: string = "https://www.bungie.net/img/misc/missing_icon_d2.png"
    if (membershipTypeStr in iconByPlatform) {
        platformIcon = iconByPlatform[membershipTypeStr]
    }
    return platformIcon
}

// convert to correct membership type
const membershipTypes: { [id: string]: number } = {
    "xb": 1,
    "ps": 2,
    "pc": 3,
    "stadia": 5,
    "epic": 6,
}
const _swap = obj => Object.fromEntries(Object.entries(obj).map(a => a.reverse()))
const membershipTypesByInt = _swap(membershipTypes)

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
    if (!(membershipType in [...Object.keys(membershipTypesByInt)])) {
        throw err
    }

    return membershipType
}

export function convertMembershipTypeToStr(membershipType: number | string): string {
    const err = new Error("Unknown MembershipType")

    if (membershipType in membershipTypesByInt) {
        return membershipTypesByInt[membershipType]
    } else if (typeof membershipType == "string") {
        try {
            return convertMembershipTypeToStr(parseInt(membershipType))
        } catch (e) {
            throw err
        }
    }
    throw err
}

// ---

export interface PlayedActivities extends DestinyHistoricalStatsPeriodGroup {
    datetime: Date,
    instanceId: string,
    completed: boolean,
    cp: boolean,
    lengthSeconds: number,
    specialTags: string[],
}

export interface ActivityStats {
    clears: number
    specialClears: number
    failedClears: number
    specialTags: { [id: string]: { instanceId: string, amount: number } }
    kills: number
    assists: number
    deaths: number
    timeSum: number
    timeMax: number | null
    timeMin: number | null
    timeAvg: number | null

    data: PlayedActivities[]
}

export async function getActivities(destinyMembershipId: any, membershipType: any, mode: number = 0) {
    membershipType = convertMembershipType(membershipType)

    const data: DestinyHistoricalStatsPeriodGroup[] = []

    // on dev - do not run everything, use my credentials
    if (import.meta.env.DEV) {
        console.log("DEV: Running with hardcoded destiny data")
        await _getActivities("4611686018467765462", 3, "2305843009302043968", data, mode)
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
        funcs.push(_getActivities(destinyMembershipId, membershipType, char.characterId, data, mode))
    }

    // call the api in parallel
    await Promise.all(funcs)

    return _calcExtras(data)
}

export const specialTags = {
    "General": [
        "Personal Flawless",
        "Solo",
        "Solo Flawless",
    ],
    "Raid": [
        "Trio",
        "Trio Flawless",
    ],
    "Raid / Dungeon": [
        "Duo",
        "Duo Flawless",
    ],
}

export function calcSpecials(playerCount: number, deaths: number, mode: number, period: Date, duration_seconds: number, pgcr: boolean = false, fresh: boolean = false) {
    const specialTags: string[] = []

    // is this any special timeframe we need to keep in mind?
    for (const entry of blacklistedTimes) {
        if ((entry.time_start < period) && (period < entry.time_end)) {
            // matches, now how do we exclude it
            switch (entry.mode) {
                case "full_exclude":
                    return specialTags
                case "make_everything_checkpoints":
                    fresh = false
                    break
                default:
                    console.log("Unknown mode: ", entry)
                    throw Error
            }
        }
    }

    // if the duration is too low - no returning anything either
    if (duration_seconds < 60 * 3) {
        return specialTags
    }

    if (playerCount == 1 && deaths == 0) {
        if (pgcr) {
            if (fresh) {
                specialTags.push("Solo Flawless (Fresh)")
            } else {
                specialTags.push("Solo Flawless (CP)")
            }
        } else {
            specialTags.push("Solo Flawless")
        }
    } else if (deaths == 0) {
        if (pgcr) {
            if (fresh) {
                specialTags.push("Flawless (Fresh)")
            } else {
                specialTags.push("Flawless (CP)")
            }
        } else {
            specialTags.push("Personal Flawless")
        }
    } else if (playerCount == 1) {
        if (pgcr) {
            if (fresh) {
                specialTags.push("Solo (Fresh)")
            } else {
                specialTags.push("Solo (CP)")
            }
        } else {
            specialTags.push("Solo")
        }
    }

    // special behaviour for raids
    if (mode == 4) {
        if (playerCount == 2) {
            if (deaths == 0) {
                if (pgcr) {
                    if (fresh) {
                        specialTags.push("Duo Flawless (Fresh)")
                    } else {
                        specialTags.push("Duo Flawless (CP)")
                    }
                } else {
                    specialTags.push("Duo Flawless")
                }
            } else {
                if (pgcr) {
                    if (fresh) {
                        specialTags.push("Duo (Fresh)")
                    } else {
                        specialTags.push("Duo (CP)")
                    }
                } else {
                    specialTags.push("Duo")
                }
            }
        } else if (playerCount == 3) {
            if (deaths == 0) {
                if (pgcr) {
                    if (fresh) {
                        specialTags.push("Trio Flawless (Fresh)")
                    } else {
                        specialTags.push("Trio Flawless (CP)")
                    }
                } else {
                    specialTags.push("Trio Flawless")
                }
            } else {
                if (pgcr) {
                    if (fresh) {
                        specialTags.push("Trio (Fresh)")
                    } else {
                        specialTags.push("Trio (CP)")
                    }
                } else {
                    specialTags.push("Trio")
                }
            }
        }
    }

    // special behaviour for dungeons
    if (mode == 82) {
        if (playerCount == 2) {
            if (deaths == 0) {
                if (pgcr) {
                    if (fresh) {
                        specialTags.push("Duo Flawless (Fresh)")
                    } else {
                        specialTags.push("Duo Flawless (CP)")
                    }
                } else {
                    specialTags.push("Duo Flawless")
                }
            } else {
                if (pgcr) {
                    if (fresh) {
                        specialTags.push("Duo (Fresh)")
                    } else {
                        specialTags.push("Duo (CP)")
                    }
                } else {
                    specialTags.push("Duo")
                }
            }
        }
    }
    return specialTags
}

function _calcExtras(data: DestinyHistoricalStatsPeriodGroup[]) {
    // do the calculations we need on it
    const finalEntries: PlayedActivities[] = []
    for (const _entry of data) {
        const entry = _entry as PlayedActivities
        entry.datetime = new Date(entry.period)
        const completed = entry.values.completed.basic.value == 1 && entry.values.completionReason.basic.value == 0
        entry.completed = completed
        entry.cp = true
        entry.lengthSeconds = entry.values.activityDurationSeconds.basic.value
        entry.instanceId = entry.activityDetails.instanceId

        // special clear?
        entry.specialTags = []
        if (completed) {
            entry.specialTags = calcSpecials(entry.values.playerCount.basic.value, entry.values.deaths.basic.value, entry.activityDetails.mode, new Date(entry.period), entry.lengthSeconds)
        }

        finalEntries.push(entry)
    }

    return finalEntries
}

async function _getActivities(destinyMembershipId: string, membershipType: number, characterId: string, data: DestinyHistoricalStatsPeriodGroup[], mode: number = 0) {
    // run until there is no more entries
    let page: number = 0
    while (true) {
        const r = await getActivityHistory(bungieClient, {
            membershipType: membershipType,
            destinyMembershipId: destinyMembershipId,
            characterId: characterId,
            page: page,
            count: 250,
            mode: mode,
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
    modeIconUrl: string,
    isPlaylist: boolean,
    isMatchmade: boolean,
    maxPlayers: number,
    activityMode: string,
    activityModeBungie: number,
    isPvp: boolean,
    redacted: boolean,
    blacklisted: boolean,
    tags: string[],

    _activityTypeHash: string,
    _directActivityModeHash: string,
}

export async function getManifestActivities(destinyManifest: DestinyManifest) {
    // get the activity mode + type defintions - we need them for tags
    let url = 'https://www.bungie.net' + destinyManifest.jsonWorldComponentContentPaths["en"]["DestinyActivityTypeDefinition"]
    let r = await fetch(url)
    const manifestActivityTypes = await r.json()

    url = 'https://www.bungie.net' + destinyManifest.jsonWorldComponentContentPaths["en"]["DestinyActivityModeDefinition"]
    r = await fetch(url)
    const manifestActivityModes = await r.json()
    const manifestActivityModesByName: { [id: string]: any } = {}
    for (const [key, value] of Object.entries(manifestActivityModes)) {
        manifestActivityModesByName[value.displayProperties.name] = value
    }

    // get the activities
    url = 'https://www.bungie.net' + destinyManifest.jsonWorldComponentContentPaths["en"]["DestinyActivityDefinition"]
    r = await fetch(url)
    const res = await r.json()

    // only return the relevant data - otherwise it is too big
    let data: { [name: string]: ManifestActivity } = {}
    const dataModes = []
    const dataTags = new Set()

    let dataMaxPlayers = 0
    const placeholderImageUrl = "https://www.bungie.net/img/theme/destiny/bgs/pgcrs/placeholder.jpg"
    const placeholderModeImageUrl = "https://www.bungie.net/img/misc/missing_icon_d2.png"
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
            let imageUrl = placeholderImageUrl
            if (value.pgcrImage) {
                imageUrl = "https://www.bungie.net" + value.pgcrImage
            }
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

            let modeIconUrl = placeholderModeImageUrl
            if (activityMode in manifestActivityModesByName) {
                modeIconUrl = "https://www.bungie.net" + manifestActivityModesByName[activityMode].displayProperties.icon
            } else if (value.directActivityModeHash) {
                if (manifestActivityModes[value.directActivityModeHash].displayProperties.icon) {
                    modeIconUrl = "https://www.bungie.net" + manifestActivityModes[value.directActivityModeHash].displayProperties.icon
                }
            }

            let activityModeBungie = 0
            if (value.directActivityModeType) {
                activityModeBungie = value.directActivityModeType
            }

            // tags
            const tags = []
            if (value.isPvP) {
                tags.push("PvP")
                dataTags.add("PvP")
            }
            if (value.isPlaylist) {
                tags.push("Playlist")
                dataTags.add("Playlist")
            }
            if (isMatchmade) {
                tags.push("Matchmade")
                dataTags.add("Matchmade")
            }

            if (name in data) {
                data[name].hash.push(key)
                if (imageUrl != placeholderImageUrl && data[name].imageUrl == placeholderImageUrl) {
                    data[name].imageUrl = imageUrl
                }
            } else {
                data[name] = {
                    hash: [key],
                    name: name,
                    description: value.displayProperties.description,
                    destination: value.destinationHash.toString(),
                    imageUrl: imageUrl,
                    modeIconUrl: modeIconUrl,
                    isPlaylist: value.isPlaylist,
                    isMatchmade: isMatchmade,
                    maxPlayers: maxPlayers,
                    activityMode: activityMode,
                    activityModeBungie: activityModeBungie,
                    isPvp: value.isPvP,
                    redacted: value.redacted,
                    blacklisted: value.blacklisted,
                    tags: tags,
                    _activityTypeHash: value.activityTypeHash,
                    _directActivityModeHash: value.directActivityModeHash,
                }
                dataModes.push(activityMode)
            }

            if (maxPlayers > dataMaxPlayers) {
                dataMaxPlayers = maxPlayers
            }
        }
    }

    // create "All MODE" activities for all activities with the same mode
    // mode needs to have 3 distinct activities, otherwise this will not be done
    const dataAdds: { [id: string]: ManifestActivity } = {}
    const frequentModes = []
    for (const [mode, n] of Object.entries(counter(dataModes))) {
        if (n >= 3) frequentModes.push(mode)
    }
    for (const [oldName, entry] of Object.entries(data)) {
        if (frequentModes.includes(entry.activityMode)) {
            const name = `All - ${entry.activityMode}`

            if (name in dataAdds) {
                dataAdds[name].hash = [...entry.hash, ...dataAdds[name].hash]
            } else {
                let imageUrl = placeholderImageUrl
                if (entry._directActivityModeHash) {
                    imageUrl = "https://www.bungie.net" + manifestActivityModes[entry._directActivityModeHash].pgcrImage
                }

                dataAdds[name] = {
                    hash: entry.hash,
                    name: name,
                    description: name,
                    destination: "Multiple Places",
                    imageUrl: imageUrl,
                    modeIconUrl: entry.modeIconUrl,
                    isPlaylist: entry.isPlaylist,
                    isMatchmade: entry.isMatchmade,
                    maxPlayers: entry.maxPlayers,
                    activityMode: entry.activityMode,
                    isPvp: entry.isPvp,
                    redacted: entry.redacted,
                    blacklisted: entry.blacklisted,
                    tags: entry.tags,
                    _activityTypeHash: entry._activityTypeHash,
                    _directActivityModeHash: entry._directActivityModeHash,
                }
            }
        }
    }
    data = {
        ...data,
        ...dataAdds,
    }

    return {
        activities: Object.entries(data),
        modes: [...new Set(dataModes)],
        tags: [...dataTags],
        maxPlayers: dataMaxPlayers,
    }
}

export interface PlayerProfile {
    membershipType: string
    membershipTypes: string[]
    membershipId: string
    iconUrl: string
    emblemUrl: string
    name: string
    code: string
    lastPlayed: Date,
    light: number,
    totalMinutesPlayed: number
}

const playerCache = new LRUCache({max: 1000})

export async function getPlayerInfo(destinyMembershipId: any, membershipType: any): Promise<PlayerProfile> {
    membershipType = convertMembershipType(membershipType)

    const cacheQuery = [destinyMembershipId, membershipType].toString()
    const cacheItem = playerCache.get(cacheQuery)
    if (cacheItem != undefined) {
        return cacheItem
    }

    const profileData = await getProfile(bungieClient, {
        components: [100, 200],
        membershipType: membershipType,
        destinyMembershipId: destinyMembershipId,
    })

    membershipType = profileData.Response.profile.data?.userInfo.membershipType.toString()
    if (profileData.Response.profile.data?.userInfo.crossSaveOverride) {
        membershipType = profileData.Response.profile.data?.userInfo.crossSaveOverride
    }
    let displayName = profileData.Response.profile.data?.userInfo.displayName
    if (profileData.Response.profile.data?.userInfo.bungieGlobalDisplayName) {
        displayName = profileData.Response.profile.data?.userInfo.bungieGlobalDisplayName
    }
    let code = "0000"
    if (profileData.Response.profile.data?.userInfo.bungieGlobalDisplayNameCode) {
        code = profileData.Response.profile.data?.userInfo.bungieGlobalDisplayNameCode.toString().padStart(4, '0')
    }

    const membershipTypes = []
    for (const e of profileData.Response.profile.data?.userInfo.applicableMembershipTypes) {
        membershipTypes.push(e.toString())
    }

    let iconUrl
    let emblemUrl
    let lastPlayed
    let light = 0
    let totalMinutesPlayed = 0
    if (Object.keys(profileData.Response.characters.data).length == 0) {
        throw Error("This user does not have any characters")
    }
    for (const [key, data] of Object.entries(profileData.Response.characters.data)) {
        const lp = new Date(data.dateLastPlayed)
        if (lastPlayed == undefined) {
            lastPlayed = lp
            iconUrl = "https://www.bungie.net" + data.emblemPath
            emblemUrl = "https://www.bungie.net" + data.emblemBackgroundPath
        }
        if (lp > lastPlayed) {
            lastPlayed = lp
        }
        if (data.light > light) {
            light = data.light
        }
        totalMinutesPlayed += parseInt(data.minutesPlayedTotal)
    }

    const res = {
        membershipType: membershipType,
        membershipTypes: membershipTypes,
        membershipId: profileData.Response.profile.data?.userInfo.membershipId,
        name: displayName,
        code: code,
        iconUrl: iconUrl,
        emblemUrl: emblemUrl,
        lastPlayed: lastPlayed,
        light: light,
        totalMinutesPlayed: totalMinutesPlayed
    }
    playerCache.set(cacheQuery, res)
    return res
}

export interface BungieUserSearchResult {
    mainMembershipType: number
    mainMembershipId: string
    bungieGlobalDisplayName: string
    bungieGlobalDisplayNameCode: string
    allMembershipTypes: number[]
}

async function _searchDirectDestinyPlayer(name: string, code: number) {
    const data = await searchDestinyPlayerByBungieName(bungieClient, {
        membershipType: -1 // all
    }, {
        displayName: name,
        displayNameCode: code
    })

    return _parseUserMembershipsSearchResults(data.Response)
}

const userRegex = new RegExp("#\\d{4}$")

export async function searchBungieUser(query: string, page: number = 0) {
    // can we search directly?
    if (page == 0) {
        if (userRegex.test(query)) {
            // found match, so call different function
            try {
                const parts = query.split("#")
                const name = parts.slice(0, -1).join("#")
                const code = parseInt(parts.slice(-1)[0])
                const res = await _searchDirectDestinyPlayer(name, code)

                if (res != null) {
                    return [res]
                }
            } catch (e) {
                // run as normally, we don't want to break anything
            }
        }
    }


    const data = await searchByGlobalNamePost(bungieClient, {
        page: 0
    }, {
        displayNamePrefix: query
    })

    const res = _parseUserSearchResults(data.Response.searchResults)
    if (data.Response.hasMore) {
        if (page < 1) {
            res.push(...await searchBungieUser(query, page + 1))
        }
    }

    return res
}

function _parseUserSearchResults(data: UserSearchResponseDetail[]) {
    const res = []
    for (const r of data) {
        const result = _parseUserMembershipsSearchResults(r.destinyMemberships)

        if (result != null) {
            res.push(result)
        }
    }
    return res
}

function _parseUserMembershipsSearchResults(data: UserInfoCard[]): null | BungieUserSearchResult {
    if (data.length == 0) {
        return null
    }

    let mainMembershipType = data[0].membershipType
    let mainMembershipId = data[0].membershipId
    let mainBungieGlobalDisplayName = data[0].bungieGlobalDisplayName
    let mainBungieGlobalDisplayCode = data[0].bungieGlobalDisplayNameCode
    const allMembershipTypes = []

    for (const m of data) {
        allMembershipTypes.push(m.membershipType)
        if (m.crossSaveOverride == m.membershipType) {
            mainMembershipType = m.membershipType
            mainMembershipId = m.membershipId
            mainBungieGlobalDisplayName = m.bungieGlobalDisplayName
            mainBungieGlobalDisplayCode = m.bungieGlobalDisplayNameCode
            break
        }
    }

    return {
        mainMembershipType: mainMembershipType,
        mainMembershipId: mainMembershipId,
        bungieGlobalDisplayName: mainBungieGlobalDisplayName,
        bungieGlobalDisplayNameCode: mainBungieGlobalDisplayCode.toString().padStart(4, '0'),
        allMembershipTypes: allMembershipTypes,
    }
}

export async function getSinglePgcr(hash: string) {
    const pgcrData = await getPostGameCarnageReport(bungieClient, {
        activityId: hash,
    })
    return pgcrData.Response
}


export async function getPGCRs(activity: ManifestActivity, destinyMembershipId: any, membershipType: any) {
    // get the activity overview first - we need the reference IDs of the activities and can't make sure that they are passed
    // for example, what if the url is shared to a friend?
    // so just get them again
    const instanceIds = []
    const activities = await getActivities(destinyMembershipId, membershipType, activity.activityModeBungie)
    for (const played of activities) {
        if (activity.hash.includes(played.activityDetails.referenceId.toString())) {
            instanceIds.push(played.activityDetails.instanceId.toString())
        }
    }

    async function _getPGCR(hash: string, data: DestinyPostGameCarnageReportData[]) {
        const pgcrData = await getSinglePgcr(hash)
        data.push(pgcrData)
    }

    // get the PGCRs with the collected info
    const pgcrs: DestinyPostGameCarnageReportData[] = []
    const funcs = []
    for (const hash of instanceIds) {
        funcs.push(_getPGCR(hash, pgcrs))
    }

    // call the api in parallel
    await Promise.all(funcs)

    return pgcrs
}

const weaponCache = new LRUCache({max: 1000})

export async function getManifestWeapon(hash: string): Promise<DestinyDefinition> {
    const cacheItem = weaponCache.get(hash)
    if (cacheItem != undefined) {
        return cacheItem
    }

    const res = await getDestinyEntityDefinition(bungieClient, {
        entityType: "DestinyInventoryItemDefinition",
        hashIdentifier: hash,
    })
    const r = res.Response

    weaponCache.set(hash, r)
    return r
}




