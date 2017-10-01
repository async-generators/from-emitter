import Subject from '@async-generators/subject';

export type EventEmitter = {
  addListener(event: string, listener: (...args: any[]) => void);
  removeListener(event: string, listener: (...args: any[]) => void);
}

export default function <T>(
  emitter: EventEmitter,
  onNext: string = "next",
  onError: string = "error",
  onDone: string = "done",
  selectNext: (...any) => T = (x) => x as T,
  selectError: (...any) => any = (x) => x
): AsyncIterable<T> {
  let subject = Subject<T>();
  let disposed = false;

  const nextListener = (...args) => subject.next(selectNext(...args));
  const errorListener = (...args) => {
    if (disposed) return;
    subject.error(selectError(...args));
    dispose();
  }
  const doneListener = () => {
    if (disposed) return;
    subject.done();
    dispose();
  }

  const dispose = () => {
    emitter.removeListener(onNext, nextListener);
    emitter.removeListener(onError, errorListener);
    emitter.removeListener(onDone, doneListener);
    disposed = true;;
  }

  emitter.addListener(onNext, nextListener);
  emitter.addListener(onError, errorListener);
  emitter.addListener(onDone, doneListener);

  subject.on("disposed", () => dispose());

  return subject;
}