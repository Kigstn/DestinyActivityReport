import {customRef} from "vue";

export function formatTime(x: number | null) {
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

export function hasIntersection(arr1: string[], arr2: string[]) {
    return Boolean(arr1.filter(element => arr2.includes(element)))
}

export function useDebouncedRef(value: any, callback: CallableFunction | undefined) {
    let timeout: number | undefined
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
