# Changelog

## [0.1.7] - 2026-03-30
### Added
- Quick preset buttons for common LaTeX snippets:
  - fraction
  - exponent
  - square root
  - integral
  - summation
  - Greek letters
  - matrix
- Preset buttons insert snippets directly into the input area for faster editing and experimentation.

## [0.1.6] - 2026-03-05
### Fixed
- Multi-line LaTeX now preserves line breaks in **inline mode** as well (previously only display mode split lines).

## [0.1.5] - 2026-03-05
### Changed
- README wording updated (removed explicit KaTeX mention from feature bullet).

### Added
- Screenshot section in README (`assets/screenshot.jpg`).

## [0.1.4] - 2026-03-05
### Added
- Output-side utility actions next to the output box:
  - Copy Text
  - Copy HTML
  - Download PNG
  - Download SVG

### Changed
- Moved copy/download actions from header area to output panel for easier workflow.

## [0.1.3] - 2026-03-05
### Added
- `Copy Output` button for quick clipboard copy (copies current input LaTeX, falls back to output text).

## [0.1.2] - 2026-03-05
### Changed
- Made the top banner clickable (scroll-to-top behavior).
- Updated favicon link to a relative path (`favicon.svg`) so it works correctly on GitHub Pages subpaths.

### Docs
- Updated README features accordingly.

## [0.1.1] - 2026-03-05
### Changed
- Switched UI language to English.
- Replaced footer text with repository link and year.

### Added
- MIT `LICENSE` file.
- README license section.

## [0.1.0] - 2026-03-05
### Added
- Initial release of **latex-converter**.
- Dark UI with input/output split.
- KaTeX rendering with display mode toggle.
- Auto render and local preference persistence.
- Sample and clear actions.
