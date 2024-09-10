import { EventType, SmartDataSnapshot } from "./interfaces";

export type Child<T> = Record<never, never> extends T
    ? NonNullable<T>[keyof T]
    : never;

type StripLeading<T> = T extends `/${infer P}` ? P : T;

export type PathType<
    P extends string,
    Sch
> = StripLeading<P> extends `${infer A}/${infer B}`
    ? A extends keyof NonNullable<Sch>
        ? PathType<
              B,
              undefined extends Sch
                  ? NonNullable<Sch>[A] | undefined
                  : Record<never, never> extends Sch
                  ? NonNullable<Sch>[A] | undefined
                  : NonNullable<Sch>[A]
          >
        : never
    : P extends keyof NonNullable<Sch>
    ? undefined extends Sch
        ? NonNullable<Sch>[P] | undefined
        : Record<never, never> extends Sch
        ? NonNullable<Sch>[P] | undefined
        : NonNullable<Sch>[P]
    : never;

export type MapPaths<
    T extends string[],
    D,
    Out extends any[] = []
> = T extends []
    ? Out
    : T extends [infer A, ...infer B]
    ? A extends string
        ? B extends string[]
            ? MapPaths<B, D, [...Out, PathType<A, D>]>
            : never
        : never
    : never;
