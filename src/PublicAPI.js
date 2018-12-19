// @flow

import * as React from "react";
import ReactDOM from "react-dom";
import AppRunner from "./components/AppRunner";
import TestRunner from "./components/TestRunner";
import "./globalTestApis";
import { createRoot } from "./root";
import type { RemountCompletedCallback, Watcher } from "./types/TestRunner";

const testRunnerNode = document.createElement("div");

// TODO: Export other APIs from ReactDOM
export const render = (app: React.Node, domNode: HTMLElement) => {
  if (document.body) {
    document.body.appendChild(testRunnerNode);
  } else {
    throw new Error("No body is loaded to run the tests upon");
  }

  // The only communication they have to eachother is to unmount and remount the app when switching tests
  // This refresh variable is the function that does that cross communication
  //
  // The flow of goes like this:
  //
  // 1. Test finishes and there is another test to run,
  // 1a. TestRunner calls `requestAppRefresh` with a callback `A` to run the next test.
  // 2.  AppRunner bound itself to the refresh variable below when it constructed, so when 1a calls it the following happens:
  // 2a. AppRunner setsState to unmount: true (rendering null)
  // 2b. AppRunner setsState to unmount: false (renderin children)
  // 2c. AppRunner calls the RemountCompletedCallback callback.
  // 3.  TestRunner's RemountCompletedCallback gets invoked, and the Test starts the next test.
  //
  let refresh: Watcher;

  // Render App with runner
  const root = createRoot(domNode); // Does this create an unhealthy dependency on React 16.6?
  root.render(
    <AppRunner
      onRefreshRequest={(fn: Watcher) => {
        refresh = fn;
      }}
    >
      {app}
    </AppRunner>
  );

  // $FlowFixMe - Render TestRunner
  const testRoot = ReactDOM.createRoot(testRunnerNode);
  testRoot.render(
    <TestRunner
      requestAppRefresh={(url: string, cb: RemountCompletedCallback) =>
        refresh(url, cb)
      }
    />
  );
};
