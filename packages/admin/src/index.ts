import {
    SmartDatabase,
    SmartDataSnapshot,
    SmartIteratedDataSnapshot,
    SmartQuery,
    SmartReference,
    Child,
} from "@smart-firebase/common-types";
import * as firebase from "@firebase/database-types";

const convertIteratedDataSnapshot = <T>(
    snapshot: firebase.IteratedDataSnapshot
): SmartIteratedDataSnapshot<T> => {
    return {
        ...convertDataSnapshot(snapshot),
        key: snapshot.key,
    };
};
const convertDataSnapshot = <T>(
    snapshot: firebase.DataSnapshot
): SmartDataSnapshot<T> => {
    return {
        child(path) {
            return convertDataSnapshot(snapshot.child(path));
        },
        exists() {
            return snapshot.exists();
        },
        exportVal() {
            return snapshot.exportVal();
        },
        forEach(action) {
            return snapshot.forEach(c =>
                action(convertIteratedDataSnapshot(c))
            );
        },
        getPriority() {
            return snapshot.getPriority();
        },
        hasChild(path) {
            return snapshot.hasChild(path);
        },
        hasChildren() {
            return snapshot.hasChildren();
        },
        key: snapshot.key,
        ref() {
            return convertReference(snapshot.ref);
        },
        toJSON() {
            return snapshot.toJSON();
        },
        val() {
            return snapshot.val();
        },
    };
};

const convertQuery = <T>(q: firebase.Query): SmartQuery<T> => {
    return {
        endBefore(value, key) {
            return convertQuery(q.endBefore(value, key));
        },
        endAt(value, key) {
            return convertQuery(q.endAt(value, key));
        },
        equalTo(value, key) {
            return convertQuery(q.equalTo(value, key));
        },
        limitToFirst(limit) {
            return convertQuery(q.limitToFirst(limit));
        },
        limitToLast(limit) {
            return convertQuery(q.limitToLast(limit));
        },
        async get() {
            return convertDataSnapshot(await q.get());
        },
        on(eventType, callback, cancelCallback) {
            let cb = q.on(
                eventType,
                s => callback(convertDataSnapshot(s)),
                cancelCallback
            );

            return () => q.off(eventType, cb);
        },
        orderByChild(path) {
            return convertQuery(q.orderByChild(path));
        },
        orderByKey() {
            return convertQuery(q.orderByKey());
        },
        orderByPriority() {
            return convertQuery(q.orderByPriority());
        },
        orderByValue() {
            return convertQuery(q.orderByValue());
        },
        ref() {
            return convertReference(q.ref);
        },
        startAt(value, key) {
            return convertQuery(q.startAt(value, key));
        },
        startAfter(value, key) {
            return convertQuery(q.startAfter(value, key));
        },
        toJSON() {
            return q.toJSON();
        },
        toString() {
            return q.toString();
        },
    };
};

const convertReference = <T>(ref: firebase.Reference): SmartReference<T> => {
    return {
        child(path) {
            return convertReference(ref.child(path));
        },
        key: ref.key,
        push(value) {
            let t = ref.push(value);
            let mapped = t.then(v => convertReference<Child<T>>(v));
            return {
                ...convertReference(t),
                then: mapped.then.bind(mapped),
                catch: mapped.catch.bind(mapped),
            };
        },
        remove() {
            return ref.remove();
        },
        set(value) {
            return ref.set(value);
        },
        setPriority(priority) {
            return ref.setPriority(priority, () => {});
        },
        setWithPriority(newVal, newPriority) {
            return ref.setWithPriority(newVal, newPriority, () => {});
        },
        async transaction(transactionUpdate, applyLocally) {
            const r = await ref.transaction(
                transactionUpdate,
                () => {},
                applyLocally
            );
            return {
                committed: r.committed,
                snapshot: convertDataSnapshot(r.snapshot),
            };
        },
        update(values) {
            return ref.update(values);
        },
        ...convertQuery(ref),
    };
};

export const convertDatabase = <T>(db: firebase.Database): SmartDatabase<T> => {
    return {
        goOffline() {
            db.goOffline();
        },
        goOnline() {
            db.goOnline();
        },
        ref(path) {
            return convertReference(db.ref(path));
        },
    };
};

export * from "@smart-firebase/common-types";
