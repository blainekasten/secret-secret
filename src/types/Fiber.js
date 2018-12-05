// @flow - A port of Reacts internal Fiber types

export type Fiber = {
  child: ?Fiber,
  sibling: ?Fiber,
  stateNode: HTMLElement,
  type: string
};
