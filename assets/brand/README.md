# Brand assets

Generated from the reference mockups in `joko-screens/` for the Phase 0 build.

| File | Size | Source |
|---|---|---|
| `popcorn.png` | 276×276 | Extracted from the existing plum app icon |
| `wordmark.png` | 504×144 | Typeset fallback (Plus Jakarta Sans ExtraBold) |
| `wordmark-small.png` | 288×84 | Downsample of `wordmark.png` |

The popcorn mark is faithful to the reference. The wordmark is a **temporary
fallback**: the reference splash exports are 375×667, too small for a crisp 3×
asset. Replace `wordmark.png` and `wordmark-small.png` with the final brand
export when it is available; keep the same canvas sizes so the splash contract
in `src/theme/splash.ts` does not change.

The native splash composite `assets/splash.png` is generated from these two
files at 660×900 (3× of the 220×300 lockup). Regenerate it if either asset
changes.
