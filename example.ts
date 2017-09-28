import { EventEmitter } from 'events';
import Subject from '@async-generators/subject';

import fromEvents from './src';

let events = new EventEmitter();
let source = fromEvents(events, "data", "booboo", "close");

async function main() {
  let consumer = new Promise(async (r, x) => {
    try {
      for await (let item of source) {
        console.log(item);
      }
      console.log("...and we're done!")
    } catch (e) { 
      console.log("uh oh...")
      x(e)
     }
    r();
  });

  events.emit("data", 1);
  events.emit("data", 2);
  events.emit("data", 3);
  events.emit("data", 4);

  await new Promise(r=>setTimeout(r, 10));

  events.emit("booboo", new Error("mr poopie pants"));

  await consumer;
}

main().catch(console.log);