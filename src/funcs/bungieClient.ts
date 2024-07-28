import {type HttpClient, type HttpClientConfig, PlatformErrorCodes, type ServerResponse} from "bungie-api-ts/destiny2";
import Semaphore from "semaphore-async-await";


// copied from https://github.com/DestinyItemManager/DIM -> thanks a ton!
export class BungieError extends Error {
    code?: PlatformErrorCodes;
    status?: string;
    endpoint: string;

    constructor(
        response: Partial<Pick<ServerResponse<unknown>, 'Message' | 'ErrorCode' | 'ErrorStatus'>>,
        request: Request,
    ) {
        super(response.Message ?? 'Unknown Bungie Error');
        this.name = 'BungieError';
        this.code = response.ErrorCode;
        this.status = response.ErrorStatus;
        this.endpoint = request.url;
    }
}

// copied from https://github.com/DestinyItemManager/DIM -> thanks a ton!
export class HttpStatusError extends Error {
    status: number;
    responseBody?: string;

    constructor(response: Response, responseBody?: string) {
        super(responseBody ?? response.statusText);
        this.status = response.status;
        this.responseBody = responseBody;
    }
}

// copied from https://github.com/DestinyItemManager/DIM -> thanks a ton!
function convertToError(e: unknown): Error {
    if (e instanceof Error) {
        return e;
    }
    return new Error(JSON.stringify(e));
}

// copied from https://github.com/DestinyItemManager/DIM -> thanks a ton!
async function toHttpStatusError(response: Response) {
    try {
        const responseBody = await response.text();
        return new HttpStatusError(response, responseBody);
    } catch (e) {
        return new HttpStatusError(response);
    }
}

// copied from https://github.com/DestinyItemManager/DIM -> thanks a ton!
async function throwHttpError(response: Response) {
    if (response.status < 200 || response.status >= 400) {
        throw await toHttpStatusError(response);
    }
}

// copied from https://github.com/DestinyItemManager/DIM -> thanks a ton!
function throwBungieError<T>(serverResponse: T | undefined, request: Request) {
    if (!serverResponse || typeof serverResponse !== 'object') {
        return serverResponse;
    }

    // There's an alternate error response that can be returned during maintenance
    const eMessage =
        'error' in serverResponse &&
        'error_description' in serverResponse &&
        (serverResponse.error_description as string);
    if (eMessage) {
        throw new BungieError(
            {
                Message: eMessage,
                ErrorCode: PlatformErrorCodes.DestinyUnexpectedError,
                ErrorStatus: eMessage,
            },
            request,
        );
    }

    if ('ErrorCode' in serverResponse && serverResponse.ErrorCode !== PlatformErrorCodes.Success) {
        throw new BungieError(serverResponse as Partial<ServerResponse<unknown>>, request);
    }

    return serverResponse;
}

// copied from https://github.com/DestinyItemManager/DIM -> thanks a ton!
function delay(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

// copied from https://github.com/DestinyItemManager/DIM -> thanks a ton!
function createFetchWithNonStoppingTimeout(
    fetchFunction: typeof fetch,
    timeout: number,
    onTimeout: (startTime: number, timeout: number) => void,
): typeof fetch {
    return async (...[input, init]: Parameters<typeof fetch>) => {
        const startTime = Date.now();
        const timer = setTimeout(() => onTimeout(startTime, timeout), timeout);

        try {
            return await fetchFunction(input, init);
        } finally {
            if (timer !== undefined) {
                clearTimeout(timer);
            }
        }
    };
}

const lock = new Semaphore(50)

// copied from https://github.com/DestinyItemManager/DIM -> thanks a ton!
function createHttpClient(fetchFunction: typeof fetch, apiKey: string): HttpClient {
    return async <T>(config: HttpClientConfig) => {
        let url = config.url;
        if (config.params) {
            url = `${url}?${new URLSearchParams(config.params).toString()}`;
        }

        const fetchOptions = new Request(url, {
            method: config.method,
            body: config.body ? JSON.stringify(config.body) : undefined,
            headers: {
                'X-API-Key': apiKey,
                ...(config.body ? {'Content-Type': 'application/json'} : undefined),
            },
            credentials: 'omit',
        });

        // make sure to not call everything at once
        await lock.acquire()
        const response = await fetchFunction(fetchOptions);
        lock.release()

        let data: T | undefined;
        let parseError: Error | undefined;
        try {
            data = (await response.json()) as T;
        } catch (e) {
            parseError = convertToError(e);
        }

        // try throwing bungie errors, which have more information, first
        throwBungieError(data, fetchOptions);
        // then throw errors on generic http error codes
        await throwHttpError(response);
        if (parseError) {
            throw parseError;
        }
        return data!; // At this point it's not undefined, there would've been a parse error
    };
}

// copied from https://github.com/DestinyItemManager/DIM -> thanks a ton!
function responsivelyThrottleHttpClient(
    httpClient: HttpClient,
    onThrottle: (timesThrottled: number, waitTime: number, url: string) => void,
): HttpClient {
    return async <T>(config: HttpClientConfig): Promise<T> => {
        if (timesThrottled > 0) {
            // Double the wait time, starting with 1 second, until we reach 5 minutes.
            const waitTime = Math.min(5 * 60 * 1000, Math.pow(2, timesThrottled) * 500);
            onThrottle(timesThrottled, waitTime, config.url);
            await delay(waitTime);
        }

        try {
            const result = await httpClient<T>(config);
            // Quickly heal from being throttled
            timesThrottled = Math.floor(timesThrottled / 2);

            return result;
        } catch (e) {
            if (e instanceof BungieError) {
                switch (e.code) {
                    case PlatformErrorCodes.ThrottleLimitExceededMinutes:
                    case PlatformErrorCodes.ThrottleLimitExceededMomentarily:
                    case PlatformErrorCodes.ThrottleLimitExceededSeconds:
                    case PlatformErrorCodes.DestinyThrottledByGameServer:
                    case PlatformErrorCodes.PerApplicationThrottleExceeded:
                    case PlatformErrorCodes.PerApplicationAnonymousThrottleExceeded:
                    case PlatformErrorCodes.PerApplicationAuthenticatedThrottleExceeded:
                    case PlatformErrorCodes.PerUserThrottleExceeded:
                        timesThrottled++;
                        break;
                    default:
                        break;
                }
            }
            throw e;
        }
    };
}


// create http client and export it
let timesThrottled = 0
const TIMEOUT = 15000;
let API_KEY = "6958c5006ab74908a9dcd71524923df5"

if (import.meta.env.DEV) {
    API_KEY = "a9d3903bbba14bad9a6e4cf3b714b4f9"
}

function notifyTimeout() {
    console.log("Timeout, waiting...")
}

function logThrottle(timesThrottled: number, waitTime: number, url: string) {
    console.log(
        'bungie api',
        'Throttled',
        timesThrottled,
        'times, waiting',
        waitTime,
        'ms before calling',
        url,
    )
}


export const bungieClient = responsivelyThrottleHttpClient(
    createHttpClient(createFetchWithNonStoppingTimeout(fetch, TIMEOUT, notifyTimeout), API_KEY),
    logThrottle,
)
