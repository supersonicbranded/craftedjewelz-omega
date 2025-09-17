// Sample Plugin: Hello World
module.exports = {
  name: "HelloWorld",
  description: "A sample plugin that displays a Hello World message.",
  category: "General",
  run(ctx) {
    ctx.notify("Hello, world! This is a sample plugin.");
  }
};
