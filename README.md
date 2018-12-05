## Principles

1. We shouldn't have to attach extra node attributes to be able to query them for E2E tests.
2. Running E2E tests should be really really simple.
3. I should be able to inspect component state and props during my e2e tests to ensure data is as expected.

## Examples

```js
it("Adds an item to the cart", "/foo/bar", async ({ find }) => {
  const [item] = await find("Item");

  item.click();

  const [cart] = await find("Cart");
  const [addedItem] = await find("Cart div.cartItem");

  // assumes we spread item's props into cart.state. Flaky test, just an example
  expect(cart.state.items).toContain(item.props);
  expect(addedItem).toBeDefined();
});
```
