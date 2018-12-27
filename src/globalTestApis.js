// @flow

import { nameEffect, effect } from "./effects";
import type { TestBlock, TestFunction } from "./types/TestRunner";

type PushToTestHook = TestBlock => void;

export function exposeGlobalsForTestRequire(pushToTestsFn: PushToTestHook) {
  window.it = (name: string, url: string, test: TestFunction) => {
    const testBlock: TestBlock = {
      name,
      test,
      url
    };

    pushToTestsFn(testBlock);
  };
}

window.expect = val => {
  return {
    toBe(val2) {
      if (val !== val2) {
        throw new nameEffect(new Error(`${val} !== ${val2}`), effect.FAIL_TEST);
      }

      throw nameEffect(new Error(), effect.SUCCESS);
    }
  };
};

export function clearGlobals() {
  delete window.it;
}
