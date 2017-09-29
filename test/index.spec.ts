import equal from '@async-generators/equal';
import fromEmitter from '../src';
import { expect } from 'chai';
import { EventEmitter } from 'events';

describe("@async-generator/from-emitter", () => {
  it("should ", async () => {

    let source = new EventEmitter();

    let iterable = fromEmitter<number>(source, "moo", "booboo", "fin");

    for await (let item of iterable){      
    }

    expect(error.message).to.be.eq("source is not iterable!");
  })
})
