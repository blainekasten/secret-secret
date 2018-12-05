// @flow
import React from "react";
import TestLine from "./TestLine";
import { clearGlobals, exposeGlobalsForTestRequire } from "./globalTestApis";
import { SUCCESS } from "./effects";
import type { Log } from "./types/Log";
import type { RemountCompletedCallback, TestBlock } from "./types/TestRunner";
import * as TestAPIs from "./testAPI";

type Props = {
  requestAppRefresh(url: string, cb: RemountCompletedCallback): void
};

const TestStyles = {
  position: "absolute",
  borderTop: "1px solid gray",
  overflow: "scroll",
  bottom: 0,
  width: "100%",
  height: "25%",
  background: "black",
  opacity: 0.7,
  color: "white"
};

type State = {
  currentTestIndex: number,
  printLog: Array<Log>,
  running: boolean,
  startedAutorun: boolean,
  tests: Array<TestBlock>
};

export default class TestRunner extends React.Component<Props, State> {
  state = {
    currentTestIndex: -1,
    printLog: [],
    running: false,
    startedAutorun: false,
    tests: []
  };

  async componentDidMount() {
    // this.props.startTestSuite();

    exposeGlobalsForTestRequire(testDetails => {
      this.setState(s => ({ tests: s.tests.concat([testDetails]) }));
    });

    // TODO: Figure out how were going to auto find and run all tests
    require("./__tests__/App.test.js");
    clearGlobals();
  }

  componentDidUpdate() {
    if (
      this.state.running === false &&
      this.state.tests.length > 0 &&
      this.state.startedAutorun === false
    ) {
      this.setState(
        { running: true, startedAutorun: true },
        this.incrementNextTestIfExists()
      );
    }
  }

  log(...messages: Array<string>) {
    const logMessages = messages.map(message => ({
      message,
      belongsTo: this.getTest().name,
      depth: 1
    }));

    this.setState(s => ({ printLog: s.printLog.concat(logMessages) }));
  }

  getTest(index: number = this.state.currentTestIndex) {
    return this.state.tests[index];
  }

  runTest() {
    const { test } = this.getTest();

    test(TestAPIs).catch(e => {
      if (e.message === SUCCESS) {
        this.log(`Success!`);
        this.incrementNextTestIfExists();
        return;
      }

      this.log("Fail!");
      this.log(e.message);
      this.log(e.stack);

      this.incrementNextTestIfExists();
    });
  }

  incrementNextTestIfExists() {
    const test = this.getTest(this.state.currentTestIndex + 1);

    if (!!test) {
      this.props.requestAppRefresh(test.url, () => {
        this.setState(
          s => ({ currentTestIndex: s.currentTestIndex + 1 }),
          this.runTest
        );
      });
    } else {
      this.setState({ running: false });
    }
  }

  render() {
    const test = this.getTest();
    const currentTest = test ? test.name : "";

    return (
      <div style={TestStyles}>
        {this.state.tests.map(({ name }, i) => (
          <TestLine
            key={name + i}
            name={name}
            disabled={this.state.running}
            running={this.state.running && currentTest === name}
            logs={this.state.printLog.filter(log => log.belongsTo === name)}
            runTest={() => {
              // Bug: If this is ran while another test is running, need to kill tests
              this.setState(
                { currentTestIndex: i - 1 },
                this.incrementNextTestIfExists
              );
            }}
          />
        ))}
      </div>
    );
  }
}
