// @flow

export const effect = {
  CALLSTACK_TOO_DEEP: "CALLSTACK_TOO_DEEP",
  FAIL_TEST: "FAIL_TEST",
  SUCCESS: "SUCCESS"
};

export type ErrorEffect = Error & {
  __reason: $Keys<effect>
};

export function nameEffect(error: Error, __effect: $Keys<effect>) {
  error.__reason = __effect;
  return error;
}
