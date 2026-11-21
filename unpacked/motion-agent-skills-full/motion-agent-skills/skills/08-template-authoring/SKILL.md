---
name: template-authoring
description: Create parametrized reusable motion templates with variants, design tokens and tests.
---
# Template authoring

Each template requires: `id`, goal, visual hierarchy, duration range, supported aspect ratios, required assets, semantic props, motion primitives, fallback mode, reduced-motion option and reference frames.

Templates should separate data, layout and animation. Create at least 3 variants that differ structurally (not merely palette). Build with configurable density and maximum text length. Avoid hidden font downloads and external network calls during render.

A template is production-ready only after automated render tests in all advertised aspect ratios, at minimum with short/long text, empty optional fields and scene-boundary checks.

Use `templates/CATALOG.md` for the initial template taxonomy.
