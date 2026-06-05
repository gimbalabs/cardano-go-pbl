# Updating Course Content

`content/cardano-go-pbl/` is the canonical, human-authored source. This guide covers pushing edits from there to the **live Andamio course** using the `andamio` CLI — text changes, new lessons, and images.

> The safe path for any edit to a published module is the **export → edit → import** round-trip described below. It preserves the exact on-platform text, so re-importing only applies your change.

## 1. Install the CLI

**macOS / Linux (Homebrew):**

```bash
brew install andamio-platform/tap/andamio-cli
andamio --version
```

Or download a binary from [andamio-cli releases](https://github.com/Andamio-Platform/andamio-cli/releases).

## 2. Authenticate

Two credential types — you need **both** for content edits:

| Command | Grants | Needed for |
|---------|--------|-----------|
| `andamio auth login --api-key <key>` | Read-only API access | Queries (`course get`, `slts`, `lesson`) |
| `andamio user login` | Wallet JWT (browser signing) | **Writes** (`course export`, `course import`) |

Check status with `andamio user status`. If a write fails with `not authenticated`, your JWT expired — run `andamio user login` again.

### Pick the network

```bash
andamio config show                                    # see current base URL
andamio config set-url https://api.andamio.io          # mainnet (bare host)
andamio config set-url https://preprod.api.andamio.io  # preprod
```

> Mainnet is the **bare** host `api.andamio.io`; preprod is `preprod.api.andamio.io`. Always confirm before importing — there is no "undo."

## 3. How content maps to Andamio

- **Source** — `content/cardano-go-pbl/lessons/module-XXX/` holds the authored markdown (arbitrary filenames, may include extra/overlapping drafts).
- **Andamio** stores **one lesson per SLT**. A module with N SLTs has N lessons (`lesson-1` … `lesson-N`), in SLT order. SLT definitions live in `content/cardano-go-pbl/01-slts.md`.
- **`compiled/<slug>/<module>/`** is the CLI's import/export format: `outline.md`, `lesson-N.md`, optional `introduction.md` / `assignment.md`, and `assets/` with `.image-manifest.json`. This directory is **gitignored** — treat any local copy as stale and re-export.
- **Module status** gates what you can change:
  - `DRAFT` — SLTs and lessons are editable.
  - `APPROVED` / `ON_CHAIN` — **SLTs are locked**; you can only update lesson/intro/assignment content. These updates do **not** trigger an on-chain transaction.

## 4. The round-trip: export → edit → import

```bash
COURSE_ID=<course-id>     # see reference table below
MODULE=201

# 1. Export current platform state (creates compiled/<slug>/<module>/)
andamio course export $COURSE_ID $MODULE --force

# 2. Edit the exported lesson-N.md (NOT the content/ source).
#    Keep the leading "# H1" — it becomes the lesson title in the app.

# 3. Dry-run: preview the change and any image uploads, send nothing
andamio course import compiled/<slug>/$MODULE --course-id $COURSE_ID --dry-run

# 4. Import for real
andamio course import compiled/<slug>/$MODULE --course-id $COURSE_ID

# 5. Verify
andamio course lesson $COURSE_ID $MODULE 1     # spot-check content
```

**Why edit the export, not `content/`:** the export is the exact current platform text. Editing it means re-import is a no-op for everything except your change. After a successful import, mirror the same edit back into `content/` so the repo stays canonical.

File-format rules the importer enforces:

- `lesson-N.md` — **must** start with a `# H1` (the lesson title).
- `outline.md` — **no** `# H1`; the title comes from the YAML `title:` field.
- `introduction.md` / `assignment.md` — `# H1` becomes the title, the rest is body.

## 5. Adding or fixing images

Images live in the module's `assets/` directory and are referenced from a lesson with a **relative path**:

```markdown
![Alt text](assets/my-screenshot.png)
```

- Supported: PNG, JPEG, GIF, WebP, **≤ 5 MB** each. Use web-safe filenames (no spaces).
- **New** images (not in `.image-manifest.json`) are uploaded to the CDN on import. Existing manifest entries are preserved — re-imports don't re-upload.
- Dry-run reports `N new image(s) would be uploaded`; the real import prints `Uploaded N image(s)`.

**Gotcha — repairing a broken image.** A lesson whose image failed to upload exports as a plain-text placeholder:

```
[Image: Alt text]
```

To fix it: replace the placeholder with `![Alt text](assets/name.png)`, drop the real file into `assets/`, and re-import. Verify by re-exporting — the reference should now be a real CDN URL (`storage.googleapis.com/andamio-v2-<network>-uploads/…`), and `curl -I <url>` should return `200`.

## 6. Reference

**Course IDs**

| Network | Course ID | Export slug |
|---------|-----------|-------------|
| mainnet | `b7795c1b9080507786be4de6cf798de780e0d5cba3244ad1a286f210` | `cardano-go-project-based-learning` |

(Add preprod here when in use.)

**Common errors**

| Message | Cause | Fix |
|---------|-------|-----|
| `not authenticated` on export/import | No / expired wallet JWT | `andamio user login` |
| `module 'X' not found in course` | Module doesn't exist on the platform | Import with `--create`, or create it first |
| `SLT_LOCKED` | Editing SLTs on an APPROVED/ON_CHAIN module | Only lesson content can change; leave SLTs as-is |
| `lessons_created: 0` after import | No SLT slots to attach lessons to | Create SLTs first (DRAFT modules only) |

For the full CLI command surface, run `andamio course --help` or see the [andamio-cli repo](https://github.com/Andamio-Platform/andamio-cli).
