import {customRef} from "vue";

export function formatTime(x: number | null) {
    if (x == 0 || x == null || x === Infinity) {
        return "0s"
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

export function counter(array: string[]) {
    let count: { [id: string]: number } = {}
    array.forEach(val => count[val] = (count[val] || 0) + 1)
    return count
}


export function useDebouncedRef(value: any, callback?: CallableFunction | undefined, timeout: number = 500) {
    return customRef((track, trigger) => {
        return {
            get() {
                track()
                return value
            },
            set(newValue) {
                clearTimeout(timeout)
                value = newValue
                trigger()

                if (callback !== undefined) {
                    timeout = setTimeout(() => {
                        callback()
                    }, 500)
                }
            },
        }
    })
}

export function formatPercent(value: number) {
    if (value == 0) {
        return null
    }

    return `${Math.round(value * 100 * 100) / 100}%`
}
