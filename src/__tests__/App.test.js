it("renders a span", "/", async ({ find }) => {
  const [button] = await find("Product span.card-footer-item");
  console.log(button);
  button.click();

  const [cartLink] = await find('a[href="/checkout"]');
  cartLink.click();

  // might need a wait?
  expect(window.location.pathname).toBe("/checkout");
});

// it("deletes the p tag", "/", async ({ find, click }) => {
//   const button = await find("button");
//   button.click();
//
//   const p = await find("p");
//
//   expect(p.innerHTML).toBe("Clicked: true");
// });
