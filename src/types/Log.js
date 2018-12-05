// @flow - The Log type structure for what gets printed to the test console

type LogDepth = 1 | 2 | 3;

export type Log = {
  belongsTo: string, // name of test (1st arg from `it` calls)
  depth: LogDepth,
  message: string
};
