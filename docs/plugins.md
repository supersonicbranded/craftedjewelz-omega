# CraftedJewelz Plugin Development Guide

Welcome to the CraftedJewelz plugin ecosystem! This guide covers everything you need to build, test, and publish plugins for the platform.

## Getting Started
- Plugins are simple JavaScript modules exporting a config and a `run` function.
- Place your plugin in `apps/plugins/`.
- Example:

```js
module.exports = {
  name: "HelloWorld",
  description: "A sample plugin that displays a Hello World message.",
  category: "General",
  run(ctx) {
    ctx.notify("Hello, world! This is a sample plugin.");
  }
};
```

## Plugin API Reference
- `ctx.notify(message)`: Show a notification to the user.
- `ctx.getCurrentSVG()`: Get the current design as SVG.
- `ctx.download(data, filename)`: Download a file.
- `ctx.addLayer(name)`, `ctx.renameLayer(old, new)`, `ctx.removeLayer(name)`: Layer management.
- `ctx.fitDiamonds(region, size, gridType)`: Advanced grid fitting.
- `ctx.renderDiamonds(data)`: Render diamonds on canvas.
- `ctx.aiSuggestPrice(params)`: Get AI price suggestion.
- ...and more!

## Best Practices
- Validate input and handle errors gracefully.
- Use categories for discoverability.
- Document your plugin and provide usage examples.

## Submitting Plugins
- Use the marketplace submission form or submit a pull request.
- Include a clear description, category, and repository/download URL.

## Troubleshooting
- Check the browser console for errors.
- Use `ctx.notify()` for debugging output.
- See sample plugins in `apps/plugins/` for reference.

## Resources
- [Plugin Marketplace](../apps/web/src/components/PluginMarketplacePanel.tsx)
- [Sample Plugins](../apps/plugins/)
- [Community Forum](https://github.com/craftedjewelz/craftedjewelz/discussions)

Happy coding!
