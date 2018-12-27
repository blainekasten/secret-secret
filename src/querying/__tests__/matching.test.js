import { isFiberMatchingSelector } from "../match";

function createFiber({ type, props }) {
  return {
    type,
    pendingProps: props
  };
}

function selectorItTest(selector, fiber, only) {
  let test = it;

  if (only) {
    test = fit;
  }

  test(selector, () => {
    expect(isFiberMatchingSelector(fiber, selector)).toBeTruthy();
  });
}

describe("selecting a react fiber supports", () => {
  // type + id
  selectorItTest(
    "span#foo",
    createFiber({ type: "span", props: { id: "foo" } })
  );

  // id
  selectorItTest("#foo", createFiber({ type: "span", props: { id: "foo" } }));

  // type + attr
  selectorItTest(
    'a[href="/foo"]',
    createFiber({ type: "a", props: { href: "/foo" } })
  );

  // attr compound
  selectorItTest(
    '[href="/foo"][target="_blank"]',
    createFiber({
      type: "a",
      props: { href: "/foo", target: "_blank" }
    })
  );

  // type + class
  selectorItTest(
    "div.baz-bax-buz",
    createFiber({
      type: "div",
      props: { className: "baz-bax-buz" }
    })
  );

  // class
  selectorItTest(
    ".baz",
    createFiber({
      type: "div",
      props: { className: "baz" }
    })
  );

  // class + attr + id
  selectorItTest(
    ".baz[hidden]#foo",
    createFiber({
      type: "div",
      props: { className: "baz", id: "foo", hidden: true }
    })
  );

  // Component (as function)
  selectorItTest(
    "FunctionComponent",
    createFiber({
      type: function FunctionComponent() {},
      props: { className: "baz", id: "foo", hidden: true }
    })
  );

  // Component (as class)

  class ClassComponent {}

  selectorItTest(
    "ClassComponent",
    createFiber({
      type: ClassComponent,
      props: { className: "baz", id: "foo", hidden: true }
    })
  );
});
