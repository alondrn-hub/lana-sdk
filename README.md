# Lana SDK — Enterprise AI Engineering Kit

Lana SDK is a cross-platform AI engineering kit containing a multi-agent engine, multi-event system, plugin loader, runtime, CLI, API layer, and starter templates — designed for enterprise strength but free and simple for developers.

## Quick Start

```bash
# Clone and install
git clone https://github.com/lana-sdk/lana-sdk.git
cd lana-sdk
npm install

# Run CLI
npx lana --help

# Start Local Runtime
npm run dev
```

## Architecture Overview
- **Core**: Multi-agent engine, event bus, state manager, task queue, memory, runtime sandbox.
- **Plugins**: Dynamic plugin loader, registry, hooks.
- **API**: REST endpoints & WebSocket event streams.
- **CLI**: Developer CLI tool for scaffolding and deploying.
- **Platforms**: Node.js, Python bindings, Web browser runtime.
