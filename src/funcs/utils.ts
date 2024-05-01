export function formatTime(x: number) {
    if (x == 0 || x == null) {
        return null
    }

    let days: number = Math.floor(x / (3600 * 24));
    let hours: number = Math.floor((x - (days * 3600 * 24)) / 3600);
    let minutes: number = Math.floor((x - (hours * 3600)) / 60);
    let seconds: number = x - (hours * 3600) - (minutes * 60);
    seconds = Math.round(seconds)

    if (days != 0) {
        return days + "d " + hours + "h"
    } else if (hours != 0) {
        return hours + "h " + minutes + "m"
    } else {
        return minutes + "m " + seconds + "s"
    }
}