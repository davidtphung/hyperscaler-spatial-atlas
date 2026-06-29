# Hyperscaler Atlas

An immersive, accessible spatial explorer of global cloud infrastructure — combining map-style pan/zoom navigation with editorial typography and data-rich detail panels.

**Live site:** [https://davidtphung.github.io/hyperscaler-spatial-atlas/](https://davidtphung.github.io/hyperscaler-spatial-atlas/)

## Features

- Interactive spatial canvas with pan, zoom, hover, and click/tap on infrastructure nodes
- Search, category filters, quick-jump navigation, and deep-linkable detail panels
- Responsive layout: persistent sidebar (desktop), bottom sheet (mobile)
- Full keyboard and screen reader support with reduced-motion respect
- Sample dataset of 20 global hyperscaler regions across AWS, Azure, GCP, Oracle, Meta, and CoreWeave

## Development

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173).

## Build

```bash
npm run build        # local preview build
npm run build:pages  # GitHub Pages build (base path set)
```

## Keyboard shortcuts

| Key | Action |
|-----|--------|
| `/` | Focus search |
| `↑↓←→` | Pan map |
| `+` / `-` | Zoom in/out |
| `0` | Reset view |
| `Esc` | Close detail panel |
| `Tab` | Navigate nodes |

## Stack

- Vite + React 19 + TypeScript
- Tailwind CSS v4
- SVG spatial layer (no heavy map library)
- GitHub Pages deployment via Actions