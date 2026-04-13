# Progress Schema

Location: `./progress.json` (repo root) or `${CLAUDE_PLUGIN_DATA}/progress.json` (plugin mode)

## Schema (version 1)

```json
{
  "version": 1,
  "course": "cardano-go-pbl",
  "modules": {
    "099": {
      "status": "unlocked",
      "lessons": {
        "1": { "status": "not_started" },
        "2": { "status": "not_started" },
        "3": { "status": "not_started" },
        "4": { "status": "not_started" }
      },
      "assignment": { "status": "not_submitted" }
    },
    "100": { "status": "locked", "lessons": { ... }, "assignment": { ... } },
    "101": { "status": "locked", ... },
    "102": { "status": "locked", ... },
    "201": { "status": "locked", ... },
    "202": { "status": "locked", ... },
    "203": { "status": "locked", ... },
    "204": { "status": "locked", ... },
    "301": { "status": "locked", ... },
    "302": { "status": "locked", ... }
  }
}
```

## Statuses

**Module**: `locked` | `unlocked` | `in_progress` | `completed`
**Lesson**: `not_started` | `in_progress` | `completed`
**Assignment**: `not_submitted` | `submitted` | `revision_requested` | `accepted`

## Gating rules

- Module 099 initializes as `unlocked`
- Modules 100–302 initialize as `locked`
- A module unlocks when the previous module's assignment status is `accepted`
- Module transitions to `in_progress` when any lesson starts
- Module transitions to `completed` when assignment is `accepted`
