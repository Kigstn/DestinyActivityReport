export const blacklistedTimes = [
    {
        "reason": "OP weapon crafting period",
        "example_pgcr_id": "13863578720",
        "other_relevant_links": [
            "https://twitter.com/RaidReport/status/1708871802221666459",
            "https://twitter.com/BungieHelp/status/1703599535694680203",
            "https://www.gamesradar.com/bungie-patched-destiny-2s-weapon-crafting-glitch-after-a-weekend-of-game-breaking-chaos-but-players-have-already-found-new-funny-guns/"
        ],
        "mode": "full_exclude",
        "time_start": new Date("2023-09-15T18:00:00.000Z"),
        "time_end": new Date("2023-09-18T18:00:00.000Z")
    },
    {
        "reason": "Beyond Light checkpoint bug which made everything show up as a full clear",
        "example_pgcr_id": "9012417575",
        "other_relevant_links": [
            "https://github.com/Bungie-net/api/issues/1320"
        ],
        "mode": "make_everything_checkpoints",
        "time_start": new Date("2020-11-10T18:00:00.000Z"),
        "time_end": new Date("2022-02-23T18:00:00.000Z")
    }
]
