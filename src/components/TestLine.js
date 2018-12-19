// @flow
import React from "react";
import type { Log } from "../types/Log";

type Props = {
  disabled: boolean,
  name: string,
  running: boolean,
  logs: Array<Log>,
  runTest(): void
};

type State = {
  autoOpened: boolean,
  open: boolean
};

const LogContainer = {
  margin: "1rem",
  borderBottom: "1px solid gray",
  color: "white"
};

const Line = {
  display: "flex",
  justifyContent: "space-between",
  fontSize: "1rem"
};

const Logs = {
  fontSize: "0.75rem",
  paddingLeft: "1rem"
};

export default class TestLine extends React.PureComponent<Props, State> {
  state = {
    autoOpened: false,
    open: false
  };

  static getDerivedStateFromProps(props: Props, state: State) {
    const newState = {};

    if (state.autoOpened === false && props.running) {
      newState.autoOpened = true;
      newState.open = true;
    }

    return newState;
  }

  handleToggle = () => {
    this.setState(s => ({ open: !s.open }));
  };

  render() {
    let logs;

    if (this.state.open) {
      logs = (
        <div style={Logs}>
          <div>Logs:</div>
          {this.props.logs.map((log, i) => (
            <div key={"log" + log.message + i}>{log.message}</div>
          ))}
        </div>
      );
    }

    return (
      <div style={LogContainer}>
        <div style={Line} onClick={this.handleToggle}>
          <p>{this.props.name}</p>
          <button onClick={this.props.runTest} disabled={this.props.disabled}>
            Run Test
          </button>
        </div>
        {logs}
      </div>
    );
  }
}
