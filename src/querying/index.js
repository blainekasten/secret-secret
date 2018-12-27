import { effect, nameEffect } from "../effects";
import type { Fiber } from "../types/Fiber";
import type { Selector, SingleSelector } from "../types/Querying";
import { isFiberMatchingSelector } from "./match";

global.find = find;

export default function find(selector: Selector, current: Fiber): Array<Fiber> {
  // This splits multipart selectors so we can navigate one part at a time.
  // This is by no means the most efficient. Should consider a refactor later, but since
  // This is just a POC, I want to see it work.
  // Product span.foobar => ['Product', 'span.foobar'];
  const parts: Array<SingleSelector> = selector.split(" ");
  let fibers = [current];

  // this lets us search through children, not sure how we'll do sibling selectors
  for (let i = 0; i < parts.length; i++) {
    const currentSelectorPart = parts[i];
    const currentFibers = [...fibers];

    // reset fibers to push in new ones
    fibers = [];

    for (let j = 0; j < currentFibers.length; j++) {
      const results = internalFindByOneSelector(
        currentSelectorPart,
        currentFibers[j]
      );

      fibers.push(...results);
    }
  }

  if (fibers.length === 0) {
    throw nameEffect(
      new Error(`Could not find anything with the selector: ${selector}`),
      effect.UNMATCHED_SELECTOR
    );
  }

  return fibers;
}

window.touches = "";

function internalFindByOneSelector(
  selector: string,
  current: Fiber
): Array<Fiber> {
  let foundFibers: Array<Fiber> = [];
  let currentFiber = current;
  let depth = 0;

  // OPTIMIZE: we flip back and forth on siblings if there is no further depth to go
  // the only way we get out of it is bailng on depth. But thats probably error prone too.

  while (currentFiber) {
    window.touches += " " + currentFiber.type;

    depth++;
    if (depth > 100) {
      // console.log(CALLSTACK_TOO_DEEP, { currentFiber });
      throw nameEffect(new Error(), effect.CALLSTACK_TOO_DEEP);
    }

    if (window.debug) {
      console.log(currentFiber.type, currentFiber.pendingProps);
    }

    // See if this node is one we want to capture.
    if (isFiberMatchingSelector(currentFiber, selector)) {
      foundFibers.push(currentFiber);
    }

    if (currentFiber.sibling) {
      const nodes = internalFindByOneSelector(selector, currentFiber.sibling);

      foundFibers.push(...nodes);
    }

    currentFiber = currentFiber.child;
  }

  return foundFibers;
}
