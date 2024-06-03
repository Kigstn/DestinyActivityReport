import type {DestinyPostGameCarnageReportData} from "bungie-api-ts/destiny2";
import type {PlayedActivities} from "@/funcs/bungie";

interface PgcrWeapon {
    referenceId: string,
    // name: string,
    // iconUrl: string,
    // seasonIconWatermark: string,
    // slot: any,
    // itemType: any,
    // ammoType: any,
    // rarity: any,
    // damageType: any,

    kills: PgcrClass,
    precisionKills: PgcrClass,
    precisionKillsPercent: PgcrClass,
}

interface PgcrClass {
    total: number,
    byClass: { [name: string]: number },
    instanceId?: string | undefined
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

    weaponStats: { [referenceId: string]: PgcrWeapon },

    combinedClears: PgcrClear,
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
            byClass: {}
        },
        deaths: {
            total: 0,
            byClass: {}
        },
        assists: {
            total: 0,
            byClass: {}
        },
        kd: {
            total: 0,
            byClass: {}
        },
        kda: {
            total: 0,
            byClass: {}
        },
        score: {
            total: 0,
            byClass: {}
        },
        precisionKills: {
            total: 0,
            byClass: {}
        },
        precisionKillsPercent: {
            total: 0,
            byClass: {}
        },
        grenadeKills: {
            total: 0,
            byClass: {}
        },
        meleeKills: {
            total: 0,
            byClass: {}
        },
        superKills: {
            total: 0,
            byClass: {}
        },
        abilityKills: {
            total: 0,
            byClass: {}
        },

        bestKills: {
            total: 0,
            byClass: {}
        },
        bestDeaths: {
            total: 0,
            byClass: {}
        },
        bestAssists: {
            total: 0,
            byClass: {}
        },
        bestKd: {
            total: 0,
            byClass: {}
        },
        bestKda: {
            total: 0,
            byClass: {}
        },
        bestScore: {
            total: 0,
            byClass: {}
        },
        bestPrecisionKills: {
            total: 0,
            byClass: {}
        },
        bestPrecisionKillsPercent: {
            total: 0,
            byClass: {}
        },
        bestGrenadeKills: {
            total: 0,
            byClass: {}
        },
        bestMeleeKills: {
            total: 0,
            byClass: {}
        },
        bestSuperKills: {
            total: 0,
            byClass: {}
        },
        bestAbilityKills: {
            total: 0,
            byClass: {}
        },
        weaponStats: {},
        combinedClears: {
            amount: {
                total: 0,
                byClass: {}
            },
            fastestTime: {
                total: 0,
                byClass: {}
            },
            averageTime: {
                total: 0,
                byClass: {}
            },
            maxTime: {
                total: 0,
                byClass: {}
            },
        },
        fullClears: {
            amount: {
                total: 0,
                byClass: {}
            },
            fastestTime: {
                total: 0,
                byClass: {}
            },
            averageTime: {
                total: 0,
                byClass: {}
            },
            maxTime: {
                total: 0,
                byClass: {}
            },
        },
        specialFullClears: {
            amount: {
                total: 0,
                byClass: {}
            },
            fastestTime: {
                total: 0,
                byClass: {}
            },
            averageTime: {
                total: 0,
                byClass: {}
            },
            maxTime: {
                total: 0,
                byClass: {}
            },
        },
        cpClears: {
            amount: {
                total: 0,
                byClass: {}
            },
            fastestTime: {
                total: 0,
                byClass: {}
            },
            averageTime: {
                total: 0,
                byClass: {}
            },
            maxTime: {
                total: 0,
                byClass: {}
            },
        },

        specialTags: {},

        data: [],
    }

    // todo call pgcrs at the same time

    for (const pgcr of pgcrs) {
        for (const entry of pgcr.entries) {
            if (entry.player.destinyUserInfo.membershipId == membershipId) {
                const character = entry.player.characterClass

                _addStat(stats, character, "kills", entry.values.kills.basic.value)
                _addBestStat(stats, character, pgcr.activityDetails.instanceId, "bestKills", entry.values.kills.basic.value)

                _addStat(stats, character, "deaths", entry.values.deaths.basic.value)
                _addBestStat(stats, character, pgcr.activityDetails.instanceId, "bestDeaths", entry.values.deaths.basic.value, true)

                _addStat(stats, character, "assists", entry.values.assists.basic.value)
                _addBestStat(stats, character, pgcr.activityDetails.instanceId, "bestAssists", entry.values.assists.basic.value)

                _addStat(stats, character, "score", entry.score.basic.value)
                _addBestStat(stats, character, pgcr.activityDetails.instanceId, "bestScore", entry.score.basic.value)

                _addStat(stats, character, "precisionKills", entry.extended.values.precisionKills.basic.value)
                _addBestStat(stats, character, pgcr.activityDetails.instanceId, "bestPrecisionKills", entry.extended.values.precisionKills.basic.value)

                _addStat(stats, character, "grenadeKills", entry.extended.values.weaponKillsGrenade.basic.value)
                _addBestStat(stats, character, pgcr.activityDetails.instanceId, "bestGrenadeKills", entry.extended.values.weaponKillsGrenade.basic.value)

                _addStat(stats, character, "meleeKills", entry.extended.values.weaponKillsMelee.basic.value)
                _addBestStat(stats, character, pgcr.activityDetails.instanceId, "bestMeleeKills", entry.extended.values.weaponKillsMelee.basic.value)

                _addStat(stats, character, "superKills", entry.extended.values.weaponKillsSuper.basic.value)
                _addBestStat(stats, character, pgcr.activityDetails.instanceId, "bestSuperKills", entry.extended.values.weaponKillsSuper.basic.value)

                _addStat(stats, character, "abilityKills", entry.extended.values.weaponKillsAbility.basic.value)
                _addBestStat(stats, character, pgcr.activityDetails.instanceId, "bestAbilityKills", entry.extended.values.weaponKillsAbility.basic.value)

                _addBestPercentStat(stats, character, pgcr.activityDetails.instanceId, "bestKd", ["kills"], "deaths")
                _addBestPercentStat(stats, character, pgcr.activityDetails.instanceId, "bestKda", ["kills", "assists"], "deaths")
                _addBestPercentStat(stats, character, pgcr.activityDetails.instanceId, "bestPrecisionKillsPercent", ["precisionKills"], "kills")

                if (entry.extended.weapons !== undefined) {
                    for (const weapon of entry.extended.weapons) {
                        const rId = weapon.referenceId.toString()

                        if (!(rId in stats)) {
                            stats.weaponStats[rId] = {
                                referenceId: rId,
                                kills: {
                                    total: 0,
                                    byClass: {}
                                },
                                precisionKills: {
                                    total: 0,
                                    byClass: {}
                                },
                                precisionKillsPercent: {
                                    total: 0,
                                    byClass: {}
                                },
                            }
                        }

                        stats.weaponStats[rId].kills.total += weapon.values.uniqueWeaponKills.basic.value
                        if (!(character in stats.weaponStats[rId].kills.byClass)) {
                            stats.weaponStats[rId].kills.byClass[character] += 0
                        }
                        stats.weaponStats[rId].kills.byClass[character] += weapon.values.uniqueWeaponKills.basic.value

                        stats.weaponStats[rId].precisionKills.total += weapon.values.uniqueWeaponPrecisionKills.basic.value
                        if (!(character in stats.weaponStats[rId].precisionKills.byClass)) {
                            stats.weaponStats[rId].precisionKills.byClass[character] += 0
                        }
                        stats.weaponStats[rId].precisionKills.byClass[character] += weapon.values.uniqueWeaponPrecisionKills.basic.value
                    }
                }
            }
        }
    }

    _addPercentStat(stats, "kd", ["kills"], "deaths")
    _addPercentStat(stats, "kda", ["kills", "assists"], "deaths")
    _addPercentStat(stats, "precisionKillsPercent", ["precisionKills"], "kills")

    for (const [hash, weapon] of Object.entries(stats.weaponStats)) {
        let r = 0
        let v = weapon.precisionKills.total
        let d = weapon.kills.total

        if (d !== 0) {
            r = v / d
        }
        weapon.precisionKillsPercent.total = r

        for (const character of Object.keys(weapon.kills.byClass)) {
            r = 0
            v = weapon.precisionKills.byClass[character]
            d = weapon.kills.byClass[character]

            if (d !== 0) {
                r = v / d
            }
            weapon.precisionKillsPercent.byClass[character] = r
        }
    }

    return stats
}

function _addStat(stats: PgcrStats, character: string, key: string, value: number) {
    stats[key].total += value
    if (!(character in stats[key].byClass)) {
        stats[key].byClass[character] = 0
    }
    stats[key].byClass[character] += value
}

function _addBestStat(stats: PgcrStats, character: string, instanceId: string, key: string, value: number, lower = false) {
    if (!(character in stats[key].byClass)) {
        stats[key].byClass[character] = 0
    }

    if (lower) {
        if (value < stats[key].total) {
            stats[key].instanceId = instanceId
            stats[key].total = value
        }
        if (value < stats[key].byClass[character]) {
            stats[key].byClass[character] = value
        }
    } else {
        if (value > stats[key].total) {
            stats[key].instanceId = instanceId
            stats[key].total = value
        }
        if (value > stats[key].byClass[character]) {
            stats[key].byClass[character] = value
        }
    }
}

function _addPercentStat(stats: PgcrStats, key: string, toDivide: string[], divideBy: string) {
    let r = 0
    let v = 0
    let d = stats[divideBy].total

    if (d !== 0) {
        for (const k of toDivide) {
            v += stats[k].total
        }
        r = v / d
    }
    stats[key].total = r

    for (const character of Object.keys(stats[divideBy].byClass)) {
        r = 0
        v = 0
        d = stats[divideBy].byClass[character]

        if (d !== 0) {
            for (const k of toDivide) {
                v += stats[k].byClass[character]
            }
            r = v / d
        }
        stats[key].byClass[character] = r
    }
}

function _addBestPercentStat(stats: PgcrStats, character: string, instanceId: string, key: string, toDivide: string[], divideBy: string) {
    if (!(character in stats[key].byClass)) {
        stats[key].byClass[character] = 0
    }

    let r = 0
    let v = 0
    let d = stats[divideBy].total

    if (d !== 0) {
        for (const k of toDivide) {
            v += stats[k].total
        }
        r = v / d
    }

    if (r > stats[key].total) {
        stats[key].instanceId = instanceId
        stats[key].total = r
    }
    if (r > stats[key].byClass[character]) {
        stats[key].byClass[character] = r
    }
}