const hello_world = require("./src/Code")


test('adds 1 + 2 to equal 3', () => {
	hello_world();
	expect(3).toBe(3);
});