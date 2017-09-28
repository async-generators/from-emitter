# from-events
[![logo](https://avatars1.githubusercontent.com/u/31987273?v=4&s=100)][async-url]

inform an iterable when it is prematurely terminated by the consumer. 

[![NPM version][npm-image]][npm-url]
[![Travis Status][travis-image]][travis-url]
[![Travis Status][codecov-image]][codecov-url]

## Usage

_package requires a system that supports async-iteration, either natively or via down-compiling_

### Install
```
yarn add @async-generators/from-events
```

This package's `main` entry points to a `commonjs` distribution. 

Additionally, the `module` entry points to a `es2015` distribution, which can be used by build systems, such as webpack, to directly use es2015 modules. 

## Api

### from-events(emitter, onNext, onError, onDone )

<code>from-events()</code> returns an iterable sequence of captured events. If emitter emits `onError`, the output iterable will rethrow the error. both `onError` and `onDone` terminate the iterable and detaches the event listeners from the `emitter`. 

source must be a node-js compliment event emitter, with the `addListener ` and `removeListener` methods. 

## Example

example.js
```js
import { EventEmitter } from 'events';
import fromEvents from '@async-generators/from-events';

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
```

Execute with the latest node.js: 

```
node --harmony-async-iteration example.js
```

output:
```
1
2
3
4
uh oh...
Error: mr poopie pants
    at main (D:\Code\async-generators\from-event-handler\example.ts:30:25)
    at <anonymous>
```
## Typescript

This library is fully typed and can be imported using: 

```ts
import fromEvents from '@async-generators/from-events');
```

It is also possible to directly execute your [properly configured](https://stackoverflow.com/a/43694282/1657476) typescript with [ts-node](https://www.npmjs.com/package/ts-node):

```
ts-node --harmony_async_iteration example.ts
```

[npm-url]: https://npmjs.org/package/@async-generators/from-events
[npm-image]: https://img.shields.io/npm/v/@async-generators/from-events.svg
[npm-downloads]: https://img.shields.io/npm/dm/@async-generators/from-events.svg
[travis-url]: https://travis-ci.org/async-generators/from-events
[travis-image]: https://img.shields.io/travis/async-generators/from-events/master.svg
[codecov-url]: https://codecov.io/gh/async-generators/from-events
[codecov-image]: https://codecov.io/gh/async-generators/from-events/branch/master/graph/badge.svg
[async-url]: https://github.com/async-generators