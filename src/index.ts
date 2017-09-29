import { EventEmitter } from 'events';
import Subject from '@async-generators/subject';

export default function <T>(
  emitter: EventEmitter,
  onNext: string = "next",
  onError: string = "error",
  onDone: string = "done",
  selectNext: (...any) => T = (x) => x as T,
  selectError = (x) => x
): AsyncIterable<T> {
  let subject = Subject<T>();

  const nextListener = (x) => subject.next(selectNext(x));
  const errorListener = (x?) => {
    subject.error(selectError(x));
    if (dispose) dispose();
  }
  const doneListener = () => {
    subject.done();
    if (dispose) dispose();
  }

  const dispose = () => {
    emitter.removeListener(onNext, nextListener);
    emitter.removeListener(onError, errorListener);
    emitter.removeListener(onDone, doneListener);
  }

  emitter.addListener(onNext, nextListener);
  emitter.addListener(onError, errorListener);
  emitter.addListener(onDone, doneListener);

  subject.on("disposed", () => dispose());

  return subject;
}