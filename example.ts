
import fromEvents from './src';
import { EventEmitter } from 'events';

async function main() {
  let events = new EventEmitter();
  let source = fromEvents(events, "data", "error", "close");
  let consumer = new Promise(async done => {
    for await (let item of source) {
      console.log(item);
    }
    console.log("...and we're done!")
    done();
  });

  events.emit("data", 1);
  events.emit("data", 2);
  events.emit("data", 3);
  events.emit("data", 4);
  events.emit("close");

  await consumer;
}

main().catch(console.log);