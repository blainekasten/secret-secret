// @flow

export const SelectorType = {
  COMPONENT: "COMPONENT",
  CLASS: "CLASS",
  ELEMENT: "ELEMENT",
  PROPS: "PROPS",
  PROPSKEY: "PROPSKEY",
  TYPE: "TYPE"
};

export type Selector = string;
export type SingleSelector = string;
export type ParsedSelector = {
  type: $Keys<typeof SelectorType>,
  query: string | [string, string]
};
