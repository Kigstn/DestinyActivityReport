import type {DestinyPostGameCarnageReportData} from "bungie-api-ts/destiny2";
import {calcSpecials, type PlayedActivities, specialTags} from "@/funcs/bungie";

export interface PgcrWeapon {
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

export interface PgcrClass {
    total: number,
    byClass: { [name: string]: number },
    instanceId?: string | undefined
}


export interface PgcrClear {
    amount: PgcrClass,
    totalTime: PgcrClass,
    fastestTime: PgcrClass,
    slowestTime: PgcrClass,
    averageTime: PgcrClass,
}

export interface PgcrStats {
    totalTime: PgcrClass,

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
    failedClears: PgcrClear,

    specialTags: { [id: string]: {instanceId: string, amount: number} },

    data: PlayedActivities[],
}

export function calcStats(pgcrs: DestinyPostGameCarnageReportData[], membershipId: string): PgcrStats {
    const stats: PgcrStats = {
        totalTime: {
            total: 0,
            byClass: {
                "Warlock": 0,
                "Hunter": 0,
                "Titan": 0,
            }
        },
        kills: {
            total: 0,
            byClass: {
                "Warlock": 0,
                "Hunter": 0,
                "Titan": 0,
            }
        },
        deaths: {
            total: 0,
            byClass: {
                "Warlock": 0,
                "Hunter": 0,
                "Titan": 0,
            }
        },
        assists: {
            total: 0,
            byClass: {
                "Warlock": 0,
                "Hunter": 0,
                "Titan": 0,
            }
        },
        kd: {
            total: 0,
            byClass: {
                "Warlock": 0,
                "Hunter": 0,
                "Titan": 0,
            }
        },
        kda: {
            total: 0,
            byClass: {
                "Warlock": 0,
                "Hunter": 0,
                "Titan": 0,
            }
        },
        score: {
            total: 0,
            byClass: {
                "Warlock": 0,
                "Hunter": 0,
                "Titan": 0,
            }
        },
        precisionKills: {
            total: 0,
            byClass: {
                "Warlock": 0,
                "Hunter": 0,
                "Titan": 0,
            }
        },
        precisionKillsPercent: {
            total: 0,
            byClass: {
                "Warlock": 0,
                "Hunter": 0,
                "Titan": 0,
            }
        },
        grenadeKills: {
            total: 0,
            byClass: {
                "Warlock": 0,
                "Hunter": 0,
                "Titan": 0,
            }
        },
        meleeKills: {
            total: 0,
            byClass: {
                "Warlock": 0,
                "Hunter": 0,
                "Titan": 0,
            }
        },
        superKills: {
            total: 0,
            byClass: {
                "Warlock": 0,
                "Hunter": 0,
                "Titan": 0,
            }
        },
        abilityKills: {
            total: 0,
            byClass: {
                "Warlock": 0,
                "Hunter": 0,
                "Titan": 0,
            }
        },

        bestKills: {
            total: 0,
            byClass: {
                "Warlock": 0,
                "Hunter": 0,
                "Titan": 0,
            }
        },
        bestDeaths: {
            total: Infinity,
            byClass: {
                "Warlock": Infinity,
                "Hunter": Infinity,
                "Titan": Infinity,
            }
        },
        bestAssists: {
            total: 0,
            byClass: {
                "Warlock": 0,
                "Hunter": 0,
                "Titan": 0,
            }
        },
        bestKd: {
            total: 0,
            byClass: {
                "Warlock": 0,
                "Hunter": 0,
                "Titan": 0,
            }
        },
        bestKda: {
            total: 0,
            byClass: {
                "Warlock": 0,
                "Hunter": 0,
                "Titan": 0,
            }
        },
        bestScore: {
            total: 0,
            byClass: {
                "Warlock": 0,
                "Hunter": 0,
                "Titan": 0,
            }
        },
        bestPrecisionKills: {
            total: 0,
            byClass: {
                "Warlock": 0,
                "Hunter": 0,
                "Titan": 0,
            }
        },
        bestPrecisionKillsPercent: {
            total: 0,
            byClass: {
                "Warlock": 0,
                "Hunter": 0,
                "Titan": 0,
            }
        },
        bestGrenadeKills: {
            total: 0,
            byClass: {
                "Warlock": 0,
                "Hunter": 0,
                "Titan": 0,
            }
        },
        bestMeleeKills: {
            total: 0,
            byClass: {
                "Warlock": 0,
                "Hunter": 0,
                "Titan": 0,
            }
        },
        bestSuperKills: {
            total: 0,
            byClass: {
                "Warlock": 0,
                "Hunter": 0,
                "Titan": 0,
            }
        },
        bestAbilityKills: {
            total: 0,
            byClass: {
                "Warlock": 0,
                "Hunter": 0,
                "Titan": 0,
            }
        },
        weaponStats: {},
        combinedClears: {
            amount: {
                total: 0,
                byClass: {
                    "Warlock": 0,
                    "Hunter": 0,
                    "Titan": 0,
                }
            },
            totalTime: {
                total: 0,
                byClass: {
                    "Warlock": 0,
                    "Hunter": 0,
                    "Titan": 0,
                }
            },
            fastestTime: {
                total: Infinity,
                byClass: {
                    "Warlock": Infinity,
                    "Hunter": Infinity,
                    "Titan": Infinity,
                }
            },
            averageTime: {
                total: 0,
                byClass: {
                    "Warlock": 0,
                    "Hunter": 0,
                    "Titan": 0,
                }
            },
            slowestTime: {
                total: 0,
                byClass: {
                    "Warlock": 0,
                    "Hunter": 0,
                    "Titan": 0,
                }
            },
        },
        fullClears: {
            amount: {
                total: 0,
                byClass: {
                    "Warlock": 0,
                    "Hunter": 0,
                    "Titan": 0,
                }
            },
            totalTime: {
                total: 0,
                byClass: {
                    "Warlock": 0,
                    "Hunter": 0,
                    "Titan": 0,
                }
            },
            fastestTime: {
                total: Infinity,
                byClass: {
                    "Warlock": Infinity,
                    "Hunter": Infinity,
                    "Titan": Infinity,
                }
            },
            averageTime: {
                total: 0,
                byClass: {
                    "Warlock": 0,
                    "Hunter": 0,
                    "Titan": 0,
                }
            },
            slowestTime: {
                total: 0,
                byClass: {
                    "Warlock": 0,
                    "Hunter": 0,
                    "Titan": 0,
                }
            },
        },
        specialFullClears: {
            amount: {
                total: 0,
                byClass: {
                    "Warlock": 0,
                    "Hunter": 0,
                    "Titan": 0,
                }
            },
            totalTime: {
                total: 0,
                byClass: {
                    "Warlock": 0,
                    "Hunter": 0,
                    "Titan": 0,
                }
            },
            fastestTime: {
                total: Infinity,
                byClass: {
                    "Warlock": Infinity,
                    "Hunter": Infinity,
                    "Titan": Infinity,
                }
            },
            averageTime: {
                total: 0,
                byClass: {
                    "Warlock": 0,
                    "Hunter": 0,
                    "Titan": 0,
                }
            },
            slowestTime: {
                total: 0,
                byClass: {
                    "Warlock": 0,
                    "Hunter": 0,
                    "Titan": 0,
                }
            },
        },
        cpClears: {
            amount: {
                total: 0,
                byClass: {
                    "Warlock": 0,
                    "Hunter": 0,
                    "Titan": 0,
                }
            },
            totalTime: {
                total: 0,
                byClass: {
                    "Warlock": 0,
                    "Hunter": 0,
                    "Titan": 0,
                }
            },
            fastestTime: {
                total: Infinity,
                byClass: {
                    "Warlock": Infinity,
                    "Hunter": Infinity,
                    "Titan": Infinity,
                }
            },
            averageTime: {
                total: 0,
                byClass: {
                    "Warlock": 0,
                    "Hunter": 0,
                    "Titan": 0,
                }
            },
            slowestTime: {
                total: 0,
                byClass: {
                    "Warlock": 0,
                    "Hunter": 0,
                    "Titan": 0,
                }
            },
        },
        failedClears: {
            amount: {
                total: 0,
                byClass: {
                    "Warlock": 0,
                    "Hunter": 0,
                    "Titan": 0,
                }
            },
            totalTime: {
                total: 0,
                byClass: {
                    "Warlock": 0,
                    "Hunter": 0,
                    "Titan": 0,
                }
            },
            fastestTime: {
                total: Infinity,
                byClass: {
                    "Warlock": Infinity,
                    "Hunter": Infinity,
                    "Titan": Infinity,
                }
            },
            averageTime: {
                total: 0,
                byClass: {
                    "Warlock": 0,
                    "Hunter": 0,
                    "Titan": 0,
                }
            },
            slowestTime: {
                total: 0,
                byClass: {
                    "Warlock": 0,
                    "Hunter": 0,
                    "Titan": 0,
                }
            },
        },

        specialTags: {},

        data: [],
    }

    // todo call pgcrs at the same time

    for (const pgcr of pgcrs) {
        const playerCounter = new Set()
        let playerDeaths = 0
        let completed = false
        let completedChar = ""
        let timePlayed = 0

        // starting phase index is only the way to go before 22/2/22, after we should use activityWasStartedFromBeginning
        let fresh = false
        let period = new Date(pgcr.period)
        if (period < new Date(2022, 2, 22)) {
            if (pgcr.startingPhaseIndex === 0) {
                fresh = true
            }
        } else {
            if (pgcr.activityWasStartedFromBeginning === true) {
                fresh = true
            }
        }

        for (const entry of pgcr.entries) {
            playerCounter.add(entry.player.destinyUserInfo.membershipId)
            playerDeaths += entry.values.deaths.basic.value

            if (entry.player.destinyUserInfo.membershipId == membershipId) {
                const character = entry.player.characterClass

                if (entry.values.completed.basic.value == 1) {
                    completed = true
                    completedChar = character
                }

                timePlayed += entry.values.timePlayedSeconds.basic.value

                _addStat(stats, character, "totalTime", entry.values.timePlayedSeconds.basic.value)

                _addStat(stats, character, "kills", entry.values.kills.basic.value)
                _addStat(stats, character, "deaths", entry.values.deaths.basic.value)
                _addStat(stats, character, "assists", entry.values.assists.basic.value)
                _addStat(stats, character, "score", entry.score.basic.value)
                _addStat(stats, character, "precisionKills", entry.extended.values.precisionKills.basic.value)
                _addStat(stats, character, "grenadeKills", entry.extended.values.weaponKillsGrenade.basic.value)
                _addStat(stats, character, "meleeKills", entry.extended.values.weaponKillsMelee.basic.value)
                _addStat(stats, character, "superKills", entry.extended.values.weaponKillsSuper.basic.value)
                _addStat(stats, character, "abilityKills", entry.extended.values.weaponKillsAbility.basic.value)


                if (completed && fresh) {
                    _addBestStat(stats, character, pgcr.activityDetails.instanceId, "bestScore", entry.score.basic.value)
                    _addBestStat(stats, character, pgcr.activityDetails.instanceId, "bestKills", entry.values.kills.basic.value)
                    _addBestStat(stats, character, pgcr.activityDetails.instanceId, "bestDeaths", entry.values.deaths.basic.value, true)
                    _addBestStat(stats, character, pgcr.activityDetails.instanceId, "bestAssists", entry.values.assists.basic.value)
                    _addBestStat(stats, character, pgcr.activityDetails.instanceId, "bestPrecisionKills", entry.extended.values.precisionKills.basic.value)
                    _addBestStat(stats, character, pgcr.activityDetails.instanceId, "bestGrenadeKills", entry.extended.values.weaponKillsGrenade.basic.value)
                    _addBestStat(stats, character, pgcr.activityDetails.instanceId, "bestMeleeKills", entry.extended.values.weaponKillsMelee.basic.value)
                    _addBestStat(stats, character, pgcr.activityDetails.instanceId, "bestSuperKills", entry.extended.values.weaponKillsSuper.basic.value)
                    _addBestStat(stats, character, pgcr.activityDetails.instanceId, "bestAbilityKills", entry.extended.values.weaponKillsAbility.basic.value)

                    _addBestPercentStat(stats, character, pgcr.activityDetails.instanceId, "bestKd", ["kills"], "deaths")
                    _addBestPercentStat(stats, character, pgcr.activityDetails.instanceId, "bestKda", ["kills", "assists"], "deaths")
                    _addBestPercentStat(stats, character, pgcr.activityDetails.instanceId, "bestPrecisionKillsPercent", ["precisionKills"], "kills")
                }

                if (entry.extended.weapons !== undefined) {
                    for (const weapon of entry.extended.weapons) {
                        const rId = weapon.referenceId.toString()

                        if (!(rId in stats)) {
                            stats.weaponStats[rId] = {
                                referenceId: rId,
                                kills: {
                                    total: 0,
                                    byClass: {
                                        "Warlock": 0,
                                        "Hunter": 0,
                                        "Titan": 0,
                                    }
                                },
                                precisionKills: {
                                    total: 0,
                                    byClass: {
                                        "Warlock": 0,
                                        "Hunter": 0,
                                        "Titan": 0,
                                    }
                                },
                                precisionKillsPercent: {
                                    total: 0,
                                    byClass: {
                                        "Warlock": 0,
                                        "Hunter": 0,
                                        "Titan": 0,
                                    }
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

        // calc special tags
        const playerCount = playerCounter.size
        let specialTags: string[] = []
        if (completed && fresh) {
            specialTags = calcSpecials(playerCount, playerDeaths, pgcr.activityDetails.mode)
        }
        for (const tag of specialTags) {
            if (!(tag in stats.specialTags)) {
                stats.specialTags[tag] = {amount: 0, instanceId: ""}
            }
            stats.specialTags[tag].amount += 1
            stats.specialTags[tag].instanceId = pgcr.activityDetails.instanceId
        }

        // @ts-ignore
        stats.data.push({
            datetime: period,
            completed: completed,
            cp: !fresh,
            lengthSeconds: timePlayed,
            specialTags: specialTags,
            instanceId: pgcr.activityDetails.instanceId,
        })

        if (completed) {
            _addTimeStat(stats, completedChar, pgcr.activityDetails.instanceId, "combinedClears", timePlayed)
            if (specialTags.length > 0) {
                _addTimeStat(stats, completedChar, pgcr.activityDetails.instanceId, "specialFullClears", timePlayed)
            } else if (fresh) {
                _addTimeStat(stats, completedChar, pgcr.activityDetails.instanceId, "fullClears", timePlayed)
            } else {
                _addTimeStat(stats, completedChar, pgcr.activityDetails.instanceId, "cpClears", timePlayed)
            }
        } else {
            _addTimeStat(stats, null, pgcr.activityDetails.instanceId, "failedClears", timePlayed)
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

    _calcAvgTime(stats, "combinedClears")
    _calcAvgTime(stats, "fullClears")
    _calcAvgTime(stats, "specialFullClears")
    _calcAvgTime(stats, "cpClears")
    _calcAvgTime(stats, "failedClears")

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
        if (lower) {
            stats[key].byClass[character] = 0
        } else {
            stats[key].byClass[character] = Infinity
        }
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

function _addTimeStat(stats: PgcrStats, character: string | null, instanceId: string, key: string, value: number) {
    stats[key].amount.total += 1
    stats[key].totalTime.total += value

    if (value < stats[key].fastestTime.total) {
        stats[key].fastestTime.total = value
        stats[key].fastestTime.instanceId = instanceId
    }
    if (value > stats[key].slowestTime.total) {
        stats[key].slowestTime.total = value
        stats[key].slowestTime.instanceId = instanceId
    }

    if (character !== null) {
        if (!(character in stats[key].amount.byClass)) {
            stats[key].amount.byClass[character] = 0
        }

        stats[key].amount.byClass[character] += 1
        stats[key].totalTime.byClass[character] += value

        if (value < stats[key].fastestTime.byClass[character]) {
            stats[key].fastestTime.byClass[character] = value
        }
        if (value > stats[key].slowestTime.byClass[character]) {
            stats[key].slowestTime.total = value
        }
    }
}

function _calcAvgTime(stats: PgcrStats, key: string) {
    let n = stats[key].amount.total
    if (n != 0) {
        stats[key].averageTime.total = stats[key].totalTime.total / n
    }

    for (const char of Object.keys(stats[key].amount.byClass)) {
        n = stats[key].amount.byClass[char]
        if (n != 0) {
            stats[key].averageTime.byClass[char] = stats[key].totalTime.byClass[char] / n
        }
    }

}