// @flow - A port of Reacts internal Fiber types

type React$ForwardRef = {
  $$typeof: Symbol,
  render: Function
};

type React$ComponentType = Function;

export type Fiber = {
  child: ?Fiber,
  sibling: ?Fiber,
  stateNode: HTMLElement | React$ComponentType,
  type: string | React$ForwardRef | React$ComponentType
};
