function inertObservable() {
    return {
        subscribe() {
            return { closed: true, unsubscribe() { } };
        },
    };
}
export class EventSystemBase {
    _completed = false;
    get isCompleted() {
        return this._completed;
    }
    observe(event) {
        if (this._completed)
            return inertObservable();
        return this.subjectOf(event);
    }
    events$() {
        if (this._completed)
            return inertObservable();
        return this.envelopeBus();
    }
    on(event, handler) {
        return this.observe(event).subscribe(handler);
    }
    once(event, handler) {
        if (this._completed) {
            return { closed: true, unsubscribe() { } };
        }
        let sub;
        sub = this.observe(event).subscribe((v) => {
            try {
                handler(v);
            }
            finally {
                sub?.unsubscribe();
            }
        });
        return sub;
    }
    emit(event, payload) {
        if (this._completed)
            return; // no-op after complete
        this.subjectOf(event).next(payload);
        this.envelopeBus().next({ type: event, payload });
    }
    complete() {
        if (this._completed)
            return;
        this._completed = true;
        this.onComplete();
    }
}
