# ClawSkills -- OpenClaw MCP Skills

MCP-based skills for OpenClaw agent framework.

## What It Is
ClawSkills = OpenClaw's skill system using MCP (Model Context Protocol). Skills are loaded as MCP servers that agents can call.

## Setup
```bash
# Load a ClawSkill via MCP
openclaw skills add github:openclaw/skills

# List available skills
openclaw skills list

# Available skill categories
openclaw skills search --category desktop
openclaw skills search --category developer
openclaw skills search --category web
```

## Key Skills
| Skill | What It Does |
|-------|-------------|
| `desktop/click` | Click UI elements |
| `desktop/type` | Type into fields |
| `desktop/screenshot` | Capture screen |
| `developer/git` | Git operations |
| `developer/code` | Code generation |
| `web/browse` | Browse websites |
| `web/search` | Search the web |

## Setup Button
https://github.com/openclaw
