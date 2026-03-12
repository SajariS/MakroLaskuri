

export type NumberKeys<T> = {
    [K in keyof T]: T[K] extends number ? K : never
}[keyof T]

export type NumberEntries<T> = {
    [K in NumberKeys<T>]: [K, T[K]]
}[NumberKeys<T>][]