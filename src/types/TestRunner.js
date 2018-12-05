// @flow

export type RemountCompletedCallback = () => void;
export type Watcher = (url: string, cb: RemountCompletedCallback) => void;

// TODO: Document Client
export type TestFunction = (client: Object) => Promise<void>;

export type TestBlock = {
  name: string,
  url: string,
  test: TestFunction
};
