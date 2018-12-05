// @flow

import type { Fiber } from "./types/Fiber";

export default class Wrapper {
  fiber: Fiber;

  constructor(fiber: Fiber) {
    this.fiber = fiber;
  }

  get innerHTML() {
    return this.fiber.stateNode.innerHTML;
  }

  click() {
    this.fiber.stateNode.click();
  }
}
