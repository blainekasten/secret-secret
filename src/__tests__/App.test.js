it("renders a span", "/foo/bar", async ({ find }) => {
  const button = await find("button");
  button.click();

  const p = await find("span");

  expect(p.innerHTML).toBe("HIIIII");
});

it("deletes the p tag", "", async ({ find, click }) => {
  const button = await find("button");
  button.click();

  const p = await find("p");

  expect(p.innerHTML).toBe("Clicked: true");
});
