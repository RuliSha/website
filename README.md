# Rivera Studio – YAML-Driven Portfolio

Single-page React + TypeScript experience scaffolded with Vite. Sections, copy, and theming are fully data-driven from YAML files so the site stays easy to evolve while remaining compliant with SOLID design principles.

## ✨ Highlights

- **Section auto-discovery** – folders under `content/sections/**/section.yaml` are parsed at build time, ordered by `order`, and rendered lazily as you scroll.
- **Theme configuration via YAML** – typography, colors, spacing, and layout tokens are centralized in `content/theme.yaml`. Updates propagate instantly through CSS variables.
- **Light / dark / system modes** – theme preference persists to `localStorage` with a three-state toggle and system sync.
- **Responsive + accessible** – fluid grid, adaptive navigation, reduced-motion support, and ARIA attributes for keyboard users.
- **SOLID architecture** – repositories encapsulate data access, dedicated section renderers focus on presentation, and theming is provided via a context boundary.
- **GitHub Pages ready** – build command plus `npm run deploy` publish the compiled site to `<username>.github.io/<repo>`.

## 🗂️ Project structure

- `content/theme.yaml` – global design tokens (color palettes, spacing scale, typography, layout metrics).
- `content/sections/<slug>/section.yaml` – section metadata, display order, and content blocks. Start with `about` and `publications`.
- `src/lib` – strongly typed repositories and shared domain types.
- `src/sections` – lazily loaded section components keyed by `component` in each YAML file.
- `src/theme` – Theme context, provider, and hook that translate YAML tokens into runtime CSS variables.
- `src/components` – navigation, theme toggle, and utility UI building blocks.

## ➕ Adding a new section

1. Create a folder under `content/sections`, e.g. `content/sections/projects`.
2. Add a `section.yaml` with the required fields:

    ```yaml
    slug: projects
    title: Projects
    order: 3
    component: rich-text
    content:
      lead: Recent highlights
      blocks:
        - type: paragraph
          text: ...
    ```

3. If you need a new layout, build a renderer in `src/sections/<name>/<Component>.tsx` and register it inside `src/sections/registry.ts`.

On rebuild the repository will pick up the folder automatically, sort by `order`, and the navigation will refresh itself.

## 🎨 Theming

- Update `content/theme.yaml` to tweak color palettes, typography, or spacing.
- Every token is converted to a CSS custom property (e.g. `spacing.md` → `--space-md`) inside `ThemeProvider`.
- Add new shadow names, radii, or layout settings to the YAML file and consume them directly in CSS.

## 🧱 Development

```bash
npm install
npm run dev
```

Open <http://localhost:5173/> to view the live-reloading app.

### Linting & type checks

```bash
npm run lint
npm run build   # includes TypeScript project references + Vite build
```

### Deploying to GitHub Pages

1. Set the base path when your site lives under a repo (e.g. `USERNAME.github.io/project`):

   ```bash
   npm run build -- --base=/project/
   ```

   or export `VITE_BASE_PATH=/project/` before building.
2. Publish the compiled `dist/` directory:

   ```bash
   npm run deploy
   ```

`npm run deploy` runs a fresh Vite build and pushes `dist/` to the `gh-pages` branch via `gh-pages`.

## 🔄 Customization checklist

- Extend `ThemeRepository` and `theme.yaml` when you introduce new design tokens.
- Register additional section renderers through `src/sections/registry.ts`.
- Add content cards by dropping new YAML blocks—no React edits required.
- Update `NavigationBar` branding copy inside `src/components/Navigation/NavigationBar.tsx`.

Enjoy building! The architecture is deliberately modular so you can iterate quickly without tangling content, presentation, and configuration.
