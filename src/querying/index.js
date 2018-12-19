import { CALLSTACK_TOO_DEEP } from "../effects";
import type { Fiber } from "../types/Fiber";
import type { Selector, SingleSelector } from "../types/Querying";
import { isFiberMatchingSelector } from "./match";

export default function find(selector: Selector, current: Fiber): Array<Fiber> {
  let results = [];

  // This splits multipart selectors so we can navigate one part at a time.
  // This is by no means the most efficient. Should consider a refactor later, but since
  // This is just a POC, I want to see it work.
  // Product span.foobar => ['Product', 'span.foobar'];
  const parts: Array<SingleSelector> = selector.split(" ");

  const fibers = [internalFindByOneSelector(parts[0] || "", current)];

  fibers.forEach(fiber => {
    const nextFibers = [internalFindByOneSelector(parts[1], fiber)];
    results.push(...nextFibers);
  });

  return results;
}

function internalFindByOneSelector(selector: string, current: Fiber): Fiber {
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

    // See if this node is one we want to capture.
    if (isFiberMatchingSelector(currentFiber, selector)) {
      found = currentFiber;
      continue;
    }

    if (currentFiber.sibling) {
      const maybeFoundNode = internalFindByOneSelector(
        selector,
        currentFiber.sibling
      );

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
