// @flow

import Wrapper from "./wrapper";
import { FAIL_TEST, CALLSTACK_TOO_DEEP } from "./effects";
import type { Fiber } from "./types/Fiber";
import { getRoot } from "./root";

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

        if (attempt === 5) {
          reject(FAIL_TEST);
          return;
        }

        setTimeout(runTask, 1000);
      }
    }

    runTask();
  });
};

function internalFind(selector: string, current: Fiber): Fiber {
  let found: ?Fiber;
  let currentFiber = current;
  let depth = 0;

  // OPTIMIZE: we flip back and forth on siblings if there is no further depth to go
  // the only way we get out of it is bailng on depth. But thats probably error prone too.

  while (!found && currentFiber) {
    depth++;
    if (depth > 100) {
      // console.log(CALLSTACK_TOO_DEEP, { currentFiber });
      throw new Error(CALLSTACK_TOO_DEEP);
    }

    if (currentFiber.type === selector) {
      found = currentFiber;
      continue;
    }

    if (currentFiber.sibling) {
      const maybeFoundNode = internalFind(selector, currentFiber.sibling);

      if (maybeFoundNode) {
        found = maybeFoundNode;
        continue;
      }
    } else {
      currentFiber = currentFiber.child;
    }
  }

  if (!found) {
    // This path should never get hit.
    throw new Error("Make flow happy.");
  }

  return found;
}

export function find(selector: string) {
  return queueTask(["find", selector], () => {
    const fiber = internalFind(selector, getRoot()._internalRoot.current);
    return new Wrapper(fiber);
  });
}
