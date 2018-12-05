// @flow

import ReactDOM from "react-dom";

let root;

export function getRoot() {
  return root;
}

export function createRoot(domNode: HTMLElement) {
  // $FlowFixMe
  root = ReactDOM.createRoot(domNode);
  return root;
}
