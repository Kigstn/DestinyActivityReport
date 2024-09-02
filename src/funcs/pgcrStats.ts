import type {DestinyPostGameCarnageReportData} from "bungie-api-ts/destiny2";
import {calcSpecials, type PlayedActivities, specialTags} from "@/funcs/bungie";
import {formatPercent} from "@/funcs/utils";

export interface PgcrWeapon {
    referenceId: string,
    kills: PgcrClass,
    precisionKills: PgcrClass,
    precisionKillsPercent: PgcrClass,
    precisionKillsWithPercent: PgcrClass,
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

export interface PgcrTeammate {
    membershipType: string,
    membershipId: string,

    fullClears: number,
    cpClears: number,
    failedClears: number,

    totalTime: number,
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
    percentageClears: PgcrClass,

    weaponStats: { [referenceId: string]: PgcrWeapon },

    combinedClears: PgcrClear,
    fullClears: PgcrClear,
    specialFullClears: PgcrClear,
    cpClears: PgcrClear,
    failedClears: PgcrClear,

    specialTags: { [id: string]: { instanceId: string, amount: number } },

    teammates: { [referenceId: string]: PgcrTeammate },

    data: PlayedActivities[],
}

export function isFresh(period: Date, pgcr: DestinyPostGameCarnageReportData) {
    let fresh = false

    if (period < new Date(2022, 2, 22)) {
        if (pgcr.startingPhaseIndex === 0) {
            fresh = true
        }
    } else {
        if (pgcr.activityWasStartedFromBeginning === true) {
            fresh = true
        }
    }
    return fresh

}

export function calcStats(pgcrs: DestinyPostGameCarnageReportData[], membershipId: string): PgcrStats {
    const stats: PgcrStats = {
        teammates: {},
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
        percentageClears: {
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

    for (const pgcr of pgcrs) {
        const playerCounter = new Set()
        let playerDeaths = 0
        let completed = false
        let completedChar = ""
        let timeStarted = []
        let timePlayed = []
        let activityTime = pgcr.entries[0].values.activityDurationSeconds.basic.value

        // starting phase index is only the way to go before 22/2/22, after we should use activityWasStartedFromBeginning
        let period = new Date(pgcr.period)
        const fresh = isFresh(period, pgcr)

        for (const entry of pgcr.entries) {
            if (entry.player.destinyUserInfo.membershipId == membershipId) {
                playerCounter.add(entry.player.destinyUserInfo.membershipId)
                playerDeaths += entry.values.deaths.basic.value

                const character = entry.player.characterClass

                if (entry.values.completed.basic.value == 1) {
                    completed = true
                    completedChar = character
                }

                timePlayed.push(entry.values.timePlayedSeconds.basic.value)
                timeStarted.push(entry.values.startSeconds.basic.value)

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

                if (entry.extended.weapons !== undefined && character != undefined) {
                    for (const weapon of entry.extended.weapons) {
                        const rId = weapon.referenceId.toString()

                        if (!(rId in stats.weaponStats)) {
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
                                precisionKillsWithPercent: {
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
                        stats.weaponStats[rId].kills.byClass[character] += weapon.values.uniqueWeaponKills.basic.value

                        stats.weaponStats[rId].precisionKills.total += weapon.values.uniqueWeaponPrecisionKills.basic.value
                        stats.weaponStats[rId].precisionKills.byClass[character] += weapon.values.uniqueWeaponPrecisionKills.basic.value
                    }
                }
            }
        }
        // loop again, but this time for the teammates
        // we need the wanted player data first
        for (const entry of pgcr.entries) {
            let fullClears = 0
            let cpClears = 0
            let failedClears = 0

            if (entry.player.destinyUserInfo.membershipId != membershipId) {
                playerCounter.add(entry.player.destinyUserInfo.membershipId)
                playerDeaths += entry.values.deaths.basic.value

                if (entry.values.completed.basic.value == 1) {
                    completed = true
                }

                // make sure activities are not counted multiple times (swapped characters)
                if (completed) {
                    if (fresh) {
                        fullClears = 1
                    } else {
                        cpClears = 1
                    }
                } else {
                    failedClears = 1
                }

                // todo 4611686018526359277 should not be unknown. Potentially fixed, but cached wrongly. Loads fine for raid stats -> http://localhost:5173/3/4611686018467765462/All%20-%20Dungeon
                // calc the time played together
                let playedTogether = 0
                let teammateStarted = entry.values.startSeconds.basic.value
                let teammatePlayed = entry.values.timePlayedSeconds.basic.value
                for (const i in [...Array(timePlayed.length).keys()]) {
                    let mainPlayerStarted = timeStarted[i]
                    let mainPlayerPlayed = timePlayed[i]

                    if (teammateStarted < mainPlayerStarted) {
                        teammatePlayed = teammatePlayed - (mainPlayerStarted - teammateStarted)
                        teammateStarted = mainPlayerStarted
                    }
                    if ((teammateStarted + teammatePlayed) > (mainPlayerStarted + mainPlayerPlayed)) {
                        teammatePlayed = mainPlayerPlayed
                    }
                    if (teammatePlayed > 0) {
                        playedTogether += teammatePlayed
                    }
                }

                if (playedTogether != 0) {
                    if (!(entry.player.destinyUserInfo.membershipId in stats.teammates)) {
                        stats.teammates[entry.player.destinyUserInfo.membershipId] = {
                            membershipType: entry.player.destinyUserInfo.membershipType.toString(),
                            membershipId: entry.player.destinyUserInfo.membershipId,
                            fullClears: fullClears,
                            cpClears: cpClears,
                            failedClears: failedClears,
                            totalTime: playedTogether,
                        }
                    } else {
                        stats.teammates[entry.player.destinyUserInfo.membershipId].fullClears += fullClears
                        stats.teammates[entry.player.destinyUserInfo.membershipId].cpClears += cpClears
                        stats.teammates[entry.player.destinyUserInfo.membershipId].failedClears += failedClears
                        stats.teammates[entry.player.destinyUserInfo.membershipId].totalTime += playedTogether
                    }
                }
            }
        }

        // calc special tags
        const playerCount = playerCounter.size
        let specialTags: string[] = []
        if (completed) {
            specialTags = calcSpecials(playerCount, playerDeaths, pgcr.activityDetails.mode, new Date(pgcr.period), pgcr.entries[0].values.activityDurationSeconds.basic.value, true, fresh)
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
            lengthSeconds: timePlayed.reduce((a, b) => a + b),
            specialTags: specialTags,
            instanceId: pgcr.activityDetails.instanceId,
        })

        if (completed) {
            _addTimeStat(stats, completedChar, pgcr.activityDetails.instanceId, "combinedClears", activityTime)
            if (specialTags.length > 0) {
                _addTimeStat(stats, completedChar, pgcr.activityDetails.instanceId, "specialFullClears", activityTime)
            } else if (fresh) {
                _addTimeStat(stats, completedChar, pgcr.activityDetails.instanceId, "fullClears", activityTime)
            } else {
                _addTimeStat(stats, completedChar, pgcr.activityDetails.instanceId, "cpClears", activityTime)
            }
        } else {
            _addTimeStat(stats, null, pgcr.activityDetails.instanceId, "failedClears", activityTime)
        }
    }

    _addPercentStat(stats, "kd", ["kills"], ["deaths"])
    _addPercentStat(stats, "kda", ["kills", "assists"], ["deaths"])
    _addPercentStat(stats, "precisionKillsPercent", ["precisionKills"], ["kills"])

    for (const [hash, weapon] of Object.entries(stats.weaponStats)) {
        let r = 0
        let rd = weapon.precisionKills.total
        let v = weapon.precisionKills.total
        let d = weapon.kills.total

        if (d !== 0) {
            r = v / d
        }
        if (v !== 0) {
            rd = `${v} (${formatPercent(r)})`
        }
        weapon.precisionKillsPercent.total = r
        weapon.precisionKillsWithPercent.total = rd

        for (const character of Object.keys(weapon.kills.byClass)) {
            r = 0
            rd = weapon.precisionKills.byClass[character]
            v = weapon.precisionKills.byClass[character]
            d = weapon.kills.byClass[character]

            if (d !== 0) {
                r = v / d
            }
            if (v !== 0) {
                rd = `${v} (${formatPercent(r)})`
            }
            weapon.precisionKillsPercent.byClass[character] = r
            weapon.precisionKillsWithPercent.byClass[character] = rd
        }
    }

    _calcAvgTime(stats, "combinedClears")
    _calcAvgTime(stats, "fullClears")
    _calcAvgTime(stats, "specialFullClears")
    _calcAvgTime(stats, "cpClears")
    _calcAvgTime(stats, "failedClears")
    _addPercentStat(stats, "percentageClears", ["combinedClears.amount"], ["combinedClears.amount", "failedClears.amount"])

    // sort the pgcrs
    stats.data = stats.data.sort((a: PlayedActivities, b: PlayedActivities) => {
            if (a.datetime < b.datetime) {
                return 1
            } else if (a.datetime == b.datetime) {
                return 0
            } else {
                return -1
            }
        }
    )

    return stats
}

function _addStat(stats: PgcrStats, character: string, key: string, value: number) {
    if (!character) {
        return
    }

    stats[key].total += value
    if (!(character in stats[key].byClass)) {
        stats[key].byClass[character] = 0
    }
    stats[key].byClass[character] += value
}

function _addBestStat(stats: PgcrStats, character: string, instanceId: string, key: string, value: number, lower = false) {
    if (!character) {
        return
    }

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

function _getDeepStat(stats: PgcrStats, key: string): PgcrClass {
    let statDivideBy = stats
    for (const part of key.split(".")) {
        statDivideBy = statDivideBy[part]
    }
    return statDivideBy

}

function _addPercentStat(stats: PgcrStats, key: string, toDivide: string[], divideBy: string[]) {
    let r = 0
    let v = 0
    let d = 0

    for (const k of divideBy) {
        const statDivideBy = _getDeepStat(stats, k)
        d += statDivideBy.total
    }

    if (d !== 0) {
        for (const k of toDivide) {
            const statToDivide = _getDeepStat(stats, k)
            v += statToDivide.total

        }
        r = v / d

    }
    stats[key].total = r

    for (const character of Object.keys(_getDeepStat(stats, divideBy[0]).byClass)) {
        r = 0
        v = 0
        d = 0

        for (const k of divideBy) {
            const statDivideBy = _getDeepStat(stats, k)
            d += statDivideBy.byClass[character]
        }

        if (d !== 0) {
            for (const k of toDivide) {
                const statToDivide = _getDeepStat(stats, k)
                v += statToDivide.byClass[character]
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
    if (!character) {
        return
    }

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
            stats[key].slowestTime.byClass[character] = value
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