import { Child, MapPaths, PathType } from "./schema";

export interface SmartIteratedDataSnapshot<T> extends SmartDataSnapshot<T> {
    readonly key: string;
}

export interface SmartDataSnapshot<T> {
    child<P extends string>(path: P): SmartDataSnapshot<PathType<P, T>>;
    exists(): boolean;
    exportVal(): T;
    forEach(
        action: (a: SmartIteratedDataSnapshot<Child<T>>) => boolean | void
    ): boolean;
    getPriority(): string | number | null;
    hasChild(path: string): boolean;
    hasChildren(): boolean;
    readonly key: string | null;
    // numChildren(): number;
    ref(): SmartReference<T>;
    toJSON(): Object | null;
    val(): T;
}

export type EventType =
    | "value"
    | "child_added"
    | "child_changed"
    | "child_moved"
    | "child_removed";

export type Unsubscribe = () => void;

export interface SmartQuery<T> {
    endBefore(
        value: number | string | boolean | null,
        key?: string
    ): SmartQuery<T>;
    endAt(value: number | string | boolean | null, key?: string): SmartQuery<T>;
    equalTo(
        value: number | string | boolean | null,
        key?: string
    ): SmartQuery<T>;
    // isEqual(other: CommonQuery | null): boolean;
    limitToFirst(limit: number): SmartQuery<T>;
    limitToLast(limit: number): SmartQuery<T>;
    // off(
    //     eventType?: EventType,
    //     callback?: (a: CommonDataSnapshot, b?: string | null) => any,
    //     context?: Object | null
    // ): void;
    get(): Promise<SmartDataSnapshot<T>>;
    on<E extends EventType>(
        eventType: E,
        callback: (
            a: SmartDataSnapshot<E extends "value" ? T : Child<T>>,
            b?: string | null
        ) => any,
        cancelCallbackOrContext?: (a: Error) => any
    ): Unsubscribe;
    // once(
    //     eventType: EventType,
    //     successCallback?: (a: CommonDataSnapshot, b?: string | null) => any,
    //     failureCallbackOrContext?: ((a: Error) => void) | Object | null,
    //     context?: Object | null
    // ): Promise<CommonDataSnapshot>;
    orderByChild(path: string): SmartQuery<T>;
    orderByKey(): SmartQuery<T>;
    orderByPriority(): SmartQuery<T>;
    orderByValue(): SmartQuery<T>;
    ref(): SmartReference<T>;
    startAt(
        value: number | string | boolean | null,
        key?: string
    ): SmartQuery<T>;
    startAfter(
        value: number | string | boolean | null,
        key?: string
    ): SmartQuery<T>;
    toJSON(): Object;
    toString(): string;
}

export interface SmartReference<T> extends SmartQuery<T> {
    child<P extends string>(path: P): SmartReference<PathType<P, T>>;
    readonly key: string | null;
    // onDisconnect(): OnDisconnect;
    // parent(): SmartReference | null;
    push(value?: Child<T>): SmartThenableReference<Child<T>>;
    remove(): Promise<void>;
    // root(): SmartReference;
    set(value: T): Promise<void>;
    setPriority(priority: string | number | null): Promise<void>;
    setWithPriority(
        newVal: T,
        newPriority: string | number | null
    ): Promise<void>;
    transaction(
        transactionUpdate: (a: T) => T,
        applyLocally?: boolean
    ): Promise<SmartTransactionResult<T>>;
    update<P extends Record<string, any>>(map: {
        [K in keyof P]: PathType<K & string, T>;
    }): Promise<void>;
}
export interface SmartTransactionResult<T> {
    committed: boolean;
    snapshot: SmartDataSnapshot<T>;
}

export interface SmartThenableReference<T>
    extends SmartReference<T>,
        Pick<Promise<SmartReference<T>>, "then" | "catch"> {}

export interface SmartDatabase<Sch> {
    // app: FirebaseApp;
    // useEmulator(
    //   host: string,
    //   port: number,
    //   options?: {
    //     mockUserToken?: EmulatorMockTokenOptions | string;
    //   }
    // ): void;
    goOffline(): void;
    goOnline(): void;
    ref<P extends string>(path?: P): SmartReference<PathType<P, Sch>>;
    // refFromURL(url: string): SmartReference;
}
