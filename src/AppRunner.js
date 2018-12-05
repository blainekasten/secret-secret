// @flow
import * as React from "react";
import type { RemountCompletedCallback } from "./types/TestRunner";

type Props = {
  children: React.Node,
  onRefreshRequest(cb: RemountCompletedCallback): void
};

type State = {
  unmount: boolean
};

export default class AppRunner extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    // When we start a new test, we need to unmount the entire app, and remount it.
    // This ensures state is in a pure place.
    // This sort of test will also ensure that our application is Pure. f(s) => v.
    props.onRefreshRequest((url, remountCompletedCallback) => {
      this.setState({ unmount: true }, () => {
        window.history.replaceState({}, "", url === "" ? "/" : url);
        this.setState({ unmount: false }, remountCompletedCallback);
      });
    });

    this.state = {
      unmount: false
    };
  }

  render() {
    // resets the application state between every test
    return this.state.unmount ? null : this.props.children;
  }
}
