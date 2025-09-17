# Plugin Testing & Security

To ensure quality and safety, all plugins should be tested and reviewed before publication.

## Automated Testing
- Use provided test harnesses to validate plugin behavior.
- Check for errors, performance issues, and compatibility.
- Example:

```js
const plugin = require('./sample-hello-world-plugin');
const ctx = { notify: console.log };
plugin.run(ctx);
```

## Security Guidelines
- Avoid unsafe code (e.g., `eval`, direct DOM manipulation).
- Validate all user input.
- Use only trusted dependencies.
- Plugins may be scanned for vulnerabilities before approval.

## Certification
- Verified plugins receive a badge in the marketplace.
- Submit your plugin for review to get certified.

## Troubleshooting
- Use `ctx.notify()` for debug output.
- Check the browser console for errors.

## Resources
- [Plugin Docs](./plugins.md)
- [Community Forum](https://github.com/craftedjewelz/craftedjewelz/discussions)

Build safe, reliable plugins for the CraftedJewelz ecosystem!
