// @flow

import Wrapper from "./wrapper";
import { FAIL_TEST } from "./effects";
import { getRoot } from "./root";
import internalFind from "./querying";

// tasks and such
const queueTask = (
  descr: string | Array<string>,
  task: Function
): Promise<Wrapper> => {
  let attempt = 0;

  return new Promise((resolve, reject) => {
    function runTask() {
      try {
        resolve(task());
      } catch (e) {
        attempt++;

        // TODO: Should this be configurable? or maybe by each call?
        if (attempt === 5) {
          reject(FAIL_TEST);
          return;
        }

        // Time to wait before trying again
        setTimeout(runTask, 1000);
      }
    }

    runTask();
  });
};

export function find(selector: string) {
  return queueTask(["find", selector], () => {
    const fibers = internalFind(selector, getRoot()._internalRoot.current);
    return fibers.map(fiber => new Wrapper(fiber));
  });
}
