import find from "../";

const createFiber = (type, child, sibling, pendingProps) => ({
  pendingProps,
  type,
  child,
  sibling
});

const tree = createFiber(
  "a",
  createFiber(
    "b",
    createFiber("d"),
    createFiber("e", null, createFiber("g", null, null, { className: "foo" }))
  ),
  createFiber("c")
);

describe("querying a tree", () => {
  it("can find deep shit", () => {
    const fiber = find("a g.foo", tree);

    expect(fiber).toBeDefined();
  });
});
