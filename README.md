# from-emitter
[![logo](https://avatars1.githubusercontent.com/u/31987273?v=4&s=100)][async-url]

inform an iterable when it is prematurely terminated by the consumer. 

[![NPM version][npm-image]][npm-url]
[![Travis Status][travis-image]][travis-url]
[![Travis Status][codecov-image]][codecov-url]

## Usage

_package requires a system that supports async-iteration, either natively or via down-compiling_

### Install
```
yarn add @async-generators/from-emitter
```

This package's `main` entry points to a `commonjs` distribution. 

Additionally, the `module` entry points to a `es2015` distribution, which can be used by build systems, such as webpack, to directly use es2015 modules. 

## Api

### from-emitter(emitter, onNext, onError, onDone [,selectNext][,selectError])

<code>from-emitter()</code> subscribes to `onNext`, `onError` and `onDone` and returns a (one-time) iterable-sequence of captured events. When the event listeners are called, the arguments are passed to `selectNext(...args)` and `selectError(...args)` to pick a value (defaults to the first argument). If the sequence completes (`onDone`), or the consumer terminates early, the event listeners are detached from the emitter and the iterable becomes disposed and cannot be iterated again.  

source must be a node-js compliment event emitter, with the `addListener ` and `removeListener` methods. 

## Example

example.js
```js
import fromEmitter from '@async-generators/from-emitter';
import { EventEmitter } from 'events';

async function main() {
  let events = new EventEmitter();
  let source = fromEmitter(events, "data", "error", "close");
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
...and we're done!
```
## Typescript

This library is fully typed and can be imported using: 

```ts
import fromEmitter from '@async-generators/from-emitter');
```

It is also possible to directly execute your [properly configured](https://stackoverflow.com/a/43694282/1657476) typescript with [ts-node](https://www.npmjs.com/package/ts-node):

```
ts-node --harmony_async_iteration example.ts
```

[npm-url]: https://npmjs.org/package/@async-generators/from-emitter
[npm-image]: https://img.shields.io/npm/v/@async-generators/from-emitter.svg
[npm-downloads]: https://img.shields.io/npm/dm/@async-generators/from-emitter.svg
[travis-url]: https://travis-ci.org/async-generators/from-emitter
[travis-image]: https://img.shields.io/travis/async-generators/from-emitter/master.svg
[codecov-url]: https://codecov.io/gh/async-generators/from-emitter
[codecov-image]: https://codecov.io/gh/async-generators/from-emitter/branch/master/graph/badge.svg
[async-url]: https://github.com/async-generators