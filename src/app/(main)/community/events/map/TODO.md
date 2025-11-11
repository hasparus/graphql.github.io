- [ ] We need some tests, but they're gonna be hard to write. Maybe invariants available only in `process.env.NODE_ENV === "development"`.
  - What invariants would those be?
- [ ] Panning should not recompute squares.
  - [ ] But zoom works perfectly currently. It's hard to fix panning while making the zoom glitchy & flickery.
- [ ] Markers still sometimes dissapear when zooming. We should ensure we render all of them at all zoom levels.
- [ ] Zooming no sometimes dissapears the squares and then pops them up again what results in flickering. I'd expect that if we zoom we only gain squares and if we zoom out we only lose squares.
- [ ] Devtool lat/lon conversion is still off: clicking London reports ~50°N and clicking Paris reports ~52°N even though the markers render in the correct spots. Need to align `screenToUV`/`handleDebugClick` with `lonLatToUV` so clicks match the displayed locations.

---

# Plan

Build a pure viewport/tile controller (state + helpers) extracted from src/app/(main)/community/events/map/engine.ts (lines 247-420) so pan/zoom math is testable and shared by pointer + wheel handlers.

Precompute a zoom-agnostic marker atlas from the existing markerPoints in engine.ts (lines 137-166); store UV bins + marker types so shaders stop looping through all markers per fragment.

Update dotsFrag (src/app/(main)/community/events/map/shaders.ts (lines 41-112)) to sample the atlas (texture/SSBO/uniform buffer) instead of iterating markers, keeping the on-screen cell grid (CELL_SIZE/SQUARE_SIZE) exactly as-is.

Add a dev-only diagnostics hook (inside engine.ts (lines 423-487)) that logs marker counts, tile coverage, and invariant failures (e.g., zoomed-out frame must report 19 markers visible).

Once the atlas + diagnostics work, clean up the TODO list and document how to tweak the atlas resolution vs. visual cell size.

If you’re good with that list, we can start with the viewport/tile controller extraction and walk through it together.
