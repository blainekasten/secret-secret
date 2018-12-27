// @flow

import type { Fiber } from "./types/Fiber";

export default class Wrapper {
  selector: string;
  fiber: Fiber;

  constructor(selector: string, fiber: Fiber) {
    this.selector = selector;
    this.fiber = fiber;
  }

  get innerHTML() {
    return this.fiber.stateNode.innerHTML;
  }

  click() {
    this.fiber.stateNode.click();
  }
}
