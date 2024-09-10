import {
    SmartDatabase,
    SmartDataSnapshot,
    SmartIteratedDataSnapshot,
    SmartQuery,
    SmartReference,
    Child,
} from "@smart-firebase/common-types";
import * as firebase from "firebase/database";

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
            return snapshot.priority;
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
            return convertQuery(
                firebase.query(q, firebase.endBefore(value, key))
            );
        },
        endAt(value, key) {
            return convertQuery(firebase.query(q, firebase.endAt(value, key)));
        },
        equalTo(value, key) {
            return convertQuery(
                firebase.query(q, firebase.equalTo(value, key))
            );
        },
        limitToFirst(limit) {
            return convertQuery(
                firebase.query(q, firebase.limitToFirst(limit))
            );
        },
        limitToLast(limit) {
            return convertQuery(firebase.query(q, firebase.limitToLast(limit)));
        },
        async get() {
            return convertDataSnapshot(await firebase.get(q));
        },
        on(eventType, callback, cancelCallback) {
            let f = {
                value: firebase.onValue,
                child_added: firebase.onChildAdded,
                child_changed: firebase.onChildChanged,
                child_moved: firebase.onChildMoved,
                child_removed: firebase.onChildRemoved,
            }[eventType];

            return f(
                q,
                s => callback(convertDataSnapshot(s)),
                e =>
                    cancelCallback == undefined ? undefined : cancelCallback(e)
            );
        },
        orderByChild(path) {
            return convertQuery(firebase.query(q, firebase.orderByChild(path)));
        },
        orderByKey() {
            return convertQuery(firebase.query(q, firebase.orderByKey()));
        },
        orderByPriority() {
            return convertQuery(firebase.query(q, firebase.orderByPriority()));
        },
        orderByValue() {
            return convertQuery(firebase.query(q, firebase.orderByValue()));
        },
        ref() {
            return convertReference(q.ref);
        },
        startAt(value, key) {
            return convertQuery(
                firebase.query(q, firebase.startAt(value, key))
            );
        },
        startAfter(value, key) {
            return convertQuery(
                firebase.query(q, firebase.startAfter(value, key))
            );
        },
        toJSON() {
            return q.toJSON();
        },
        toString() {
            return q.toString();
        },
    };
};

const convertReference = <T>(
    ref: firebase.DatabaseReference
): SmartReference<T> => {
    return {
        child(path) {
            return convertReference(firebase.child(ref, path));
        },
        key: ref.key,
        push(value) {
            let t = firebase.push(ref, value);
            let mapped = t.then(v => convertReference<Child<T>>(v));
            return {
                ...convertReference(t),
                then: mapped.then,
                catch: mapped.catch,
            };
        },
        remove() {
            return firebase.remove(ref);
        },
        set(value) {
            return firebase.set(ref, value);
        },
        setPriority(priority) {
            return firebase.setPriority(ref, priority);
        },
        setWithPriority(newVal, newPriority) {
            return firebase.setWithPriority(ref, newVal, newPriority);
        },
        async transaction(transactionUpdate, applyLocally) {
            const r = await firebase.runTransaction(ref, transactionUpdate, {
                applyLocally: applyLocally!,
            });
            return {
                committed: r.committed,
                snapshot: convertDataSnapshot(r.snapshot),
            };
        },
        update(values) {
            return firebase.update(ref, values);
        },
        ...convertQuery(ref),
    };
};

export const convertDatabase = <Sch>(
    db: firebase.Database
): SmartDatabase<Sch> => {
    return {
        goOffline() {
            firebase.goOffline(db);
        },
        goOnline() {
            firebase.goOnline(db);
        },
        ref(path) {
            return convertReference(firebase.ref(db, path));
        },
    };
};

export * from "@smart-firebase/common-types";
