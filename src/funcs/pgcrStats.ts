import type {DestinyPostGameCarnageReportData} from "bungie-api-ts/destiny2";
import type {PlayedActivities} from "@/funcs/bungie";

interface PgcrWeapon {
    referenceId: string,
    name: string,
    iconUrl: string,
    seasonIconWatermark: string,
    slot: any,
    itemType: any,
    ammoType: any,
    rarity: any,
    damageType: any,

    kills: PgcrClass,
    precisionKills: PgcrClass,
    precisionKillsPercent: PgcrClass,
}

interface PgcrClass {
    total: number,
    warlock: number,
    titan: number,
    hunter: number,
}

interface PgcrClear {
    amount: PgcrClass,
    fastestTime: PgcrClass,
    averageTime: PgcrClass,
    maxTime: PgcrClass,
}

export interface PgcrStats {
    kills: PgcrClass,
    deaths: PgcrClass,
    assists: PgcrClass,
    kd: PgcrClass,
    kda: PgcrClass,
    score: PgcrClass,
    precisionKills: PgcrClass,
    precisionKillsPercent: PgcrClass,
    grenadeKills: PgcrClass,
    meleeKills: PgcrClass,
    superKills: PgcrClass,
    abilityKills: PgcrClass,

    bestKills: PgcrClass,
    bestDeaths: PgcrClass,
    bestAssists: PgcrClass,
    bestKd: PgcrClass,
    bestKda: PgcrClass,
    bestScore: PgcrClass,
    bestPrecisionKills: PgcrClass,
    bestPrecisionKillsPercent: PgcrClass,
    bestGrenadeKills: PgcrClass,
    bestMeleeKills: PgcrClass,
    bestSuperKills: PgcrClass,
    bestAbilityKills: PgcrClass,

    weaponStats: PgcrWeapon[],

    fullClears: PgcrClear,
    specialFullClears: PgcrClear,
    cpClears: PgcrClear,

    specialTags: { [id: string]: number },

    data: PlayedActivities[],
}

export function calcStats(pgcrs: DestinyPostGameCarnageReportData[], membershipId: string): PgcrStats {
    const stats: PgcrStats = {
        kills: {
            total: 0,
            warlock: 0,
            titan: 0,
            hunter: 0,
        },
        deaths: {
            total: 0,
            warlock: 0,
            titan: 0,
            hunter: 0,
        },
        assists: {
            total: 0,
            warlock: 0,
            titan: 0,
            hunter: 0,
        },
        kd: {
            total: 0,
            warlock: 0,
            titan: 0,
            hunter: 0,
        },
        kda: {
            total: 0,
            warlock: 0,
            titan: 0,
            hunter: 0,
        },
        score: {
            total: 0,
            warlock: 0,
            titan: 0,
            hunter: 0,
        },
        precisionKills: {
            total: 0,
            warlock: 0,
            titan: 0,
            hunter: 0,
        },
        precisionKillsPercent: {
            total: 0,
            warlock: 0,
            titan: 0,
            hunter: 0,
        },
        grenadeKills: {
            total: 0,
            warlock: 0,
            titan: 0,
            hunter: 0,
        },
        meleeKills: {
            total: 0,
            warlock: 0,
            titan: 0,
            hunter: 0,
        },
        superKills: {
            total: 0,
            warlock: 0,
            titan: 0,
            hunter: 0,
        },
        abilityKills: {
            total: 0,
            warlock: 0,
            titan: 0,
            hunter: 0,
        },

        bestKills: {
            total: 0,
            warlock: 0,
            titan: 0,
            hunter: 0,
        },
        bestDeaths: {
            total: 0,
            warlock: 0,
            titan: 0,
            hunter: 0,
        },
        bestAssists: {
            total: 0,
            warlock: 0,
            titan: 0,
            hunter: 0,
        },
        bestKd: {
            total: 0,
            warlock: 0,
            titan: 0,
            hunter: 0,
        },
        bestKda: {
            total: 0,
            warlock: 0,
            titan: 0,
            hunter: 0,
        },
        bestScore: {
            total: 0,
            warlock: 0,
            titan: 0,
            hunter: 0,
        },
        bestPrecisionKills: {
            total: 0,
            warlock: 0,
            titan: 0,
            hunter: 0,
        },
        bestPrecisionKillsPercent: {
            total: 0,
            warlock: 0,
            titan: 0,
            hunter: 0,
        },
        bestGrenadeKills: {
            total: 0,
            warlock: 0,
            titan: 0,
            hunter: 0,
        },
        bestMeleeKills: {
            total: 0,
            warlock: 0,
            titan: 0,
            hunter: 0,
        },
        bestSuperKills: {
            total: 0,
            warlock: 0,
            titan: 0,
            hunter: 0,
        },
        bestAbilityKills: {
            total: 0,
            warlock: 0,
            titan: 0,
            hunter: 0,
        },
        weaponStats: [],
        fullClears: {
            amount: {
                total: 0,
                warlock: 0,
                titan: 0,
                hunter: 0,
            },
            fastestTime: {
                total: 0,
                warlock: 0,
                titan: 0,
                hunter: 0,
            },
            averageTime: {
                total: 0,
                warlock: 0,
                titan: 0,
                hunter: 0,
            },
            maxTime: {
                total: 0,
                warlock: 0,
                titan: 0,
                hunter: 0,
            },
        },
        specialFullClears: {
            amount: {
                total: 0,
                warlock: 0,
                titan: 0,
                hunter: 0,
            },
            fastestTime: {
                total: 0,
                warlock: 0,
                titan: 0,
                hunter: 0,
            },
            averageTime: {
                total: 0,
                warlock: 0,
                titan: 0,
                hunter: 0,
            },
            maxTime: {
                total: 0,
                warlock: 0,
                titan: 0,
                hunter: 0,
            },
        },
        cpClears: {
            amount: {
                total: 0,
                warlock: 0,
                titan: 0,
                hunter: 0,
            },
            fastestTime: {
                total: 0,
                warlock: 0,
                titan: 0,
                hunter: 0,
            },
            averageTime: {
                total: 0,
                warlock: 0,
                titan: 0,
                hunter: 0,
            },
            maxTime: {
                total: 0,
                warlock: 0,
                titan: 0,
                hunter: 0,
            },
        },

        specialTags: {},

        data: [],
    }

    // todo weapon stats

    for (const pgcr in pgcrs) {

    }


    return stats
}