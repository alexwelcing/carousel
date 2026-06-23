# HyperFrames Integration Guide

This repository is now configured to generate videos with HyperFrames and GitHub Copilot skills.

## What is installed

- HyperFrames skill pack installed locally at `.agents/skills/`
- HyperFrames docs index saved at `docs/hyperframes/llms.txt`
- Starter HyperFrames project scaffolded at `hyperframes-studio/`
- Verified starter render output at `output/hyperframes-starter.mp4`

## Prerequisites

The environment should satisfy:

- Node.js 22+
- FFmpeg + FFprobe on PATH
- Chrome runtime provisioned by HyperFrames

Verify anytime:

```bash
npm run hf:doctor
```

## Repo commands

Run from repository root:

```bash
npm run hf:skills
npm run hf:dev
npm run hf:check
npm run hf:render
npm run hf:render:docker
```

Notes:

- `hf:dev` starts HyperFrames Studio preview from `hyperframes-studio/`.
- `hf:check` includes increased protocol/player timeouts for low-memory container stability.
- `hf:render` uses a low-memory profile tuned for this container.
- `hf:render:docker` uses Docker-based rendering for deterministic builds.

## Copilot CLI + skills workflow

From repo root:

```bash
copilot
```

In Copilot CLI, use explicit skill invocation for best reliability:

```text
/hyperframes Create a 15-second dark-themed product intro with hype-style captions and a flash transition to the CTA.
```

Then iterate:

```text
Make the title 2x bigger and add a lower third at 0:03.
```

```text
Swap the transition to a whip pan.
```

Render from terminal:

```bash
npm run hf:render
```

Or via skill:

```text
/hyperframes-cli Render this composition to output/hyperframes.mp4 at high quality.
```

## Recommended prompt patterns

Use `/hyperframes` first to route correctly, then branch by task:

- `/hyperframes-animation` for timeline and motion changes
- `/hyperframes-core` for composition structure/data attributes
- `/hyperframes-cli` for render/publish command help
- `/hyperframes-registry` for installing transition/effect blocks

## Useful extras

Install a block and wire it in prompts:

```bash
cd hyperframes-studio
npx hyperframes add flash-through-white
```

Lint before final render:

```bash
cd hyperframes-studio
npx hyperframes lint
```

## Troubleshooting

- If `validate` times out in low-memory containers, use the root `hf:render` command (includes conservative timeouts and low-memory mode).
- If Docker shared memory is small (`/dev/shm`), prefer local low-memory render or run Docker with larger shm size (`--shm-size=512m`).
- If skills do not appear in an active Copilot CLI session, run `/skills` in the CLI and restart the session if needed.
