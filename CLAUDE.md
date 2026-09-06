# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

A single-page Todo app built with plain HTML/CSS/JavaScript — no build step, no framework, no dependencies.

## Running

Open `index.html` directly in a browser, or serve it locally:

```bash
python3 -m http.server 8000
# then visit http://localhost:8000
```

There is no build, lint, or test tooling in this project.

## Architecture

- `index.html` — page structure: add-form, todo list container, filter/footer controls.
- `styles.css` — all styling, including a dark-mode variant via `prefers-color-scheme`.
- `app.js` — all app logic in one file:
  - Todos are stored as `{ id, text, completed }` objects in the `todos` array, persisted to `localStorage` under the key `todos` on every mutation.
  - `render()` re-derives the entire visible list from `todos` + `currentFilter` (`all` / `active` / `completed`) and redraws it — there is no partial DOM diffing.
  - Editing a todo is done in place by swapping the `<span>` for an `<input>` (see `startEditing`); committing on blur/Enter, discarding on Escape, deleting the todo if left empty.
