if(Symbol["asyncIterator"] === undefined) ((<any>Symbol)["asyncIterator"]) = Symbol.for("asyncIterator");

import Subject from '@async-generators/subject';

export type EventEmitter = {
  addListener(event: string, listener: (...args: any[]) => void);
  removeListener(event: string, listener: (...args: any[]) => void);
}

export default function <T>(
  emitter: EventEmitter,
  opts?: {
    onNext?: string
    onError?: string,
    onDone?: string,
    selectNext?: (...any) => T,
    selectError?: (...any) => any,
    dispose?: () => void,
  }
): AsyncIterable<T> {

  let _opts = Object.assign({
    onNext: "next",
    onError: "error",
    onDone: "done",
    selectNext: (x) => x as T,
    selectError: (x) => x,
    dispose: () => { }
  }, opts);

  let subject = Subject<T>();
  let disposed = false;

  const nextListener = (...args) => subject.next(_opts.selectNext(...args));
  const errorListener = (...args) => {
    if (disposed) return;
    subject.error(_opts.selectError(...args));
    dispose();
  }
  const doneListener = () => {
    if (disposed) return;
    subject.done();
    dispose();
  }

  const dispose = () => {
    emitter.removeListener(_opts.onNext, nextListener);
    emitter.removeListener(_opts.onError, errorListener);
    emitter.removeListener(_opts.onDone, doneListener);
    _opts.dispose();    
    disposed = true;;
  }

  emitter.addListener(_opts.onNext, nextListener);
  emitter.addListener(_opts.onError, errorListener);
  emitter.addListener(_opts.onDone, doneListener);

  subject.on("disposed", () => dispose());

  return subject;
}