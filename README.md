# almi-visibility-data — the products' own data, outside the engine

**Owner ruling, 14 September 2026 (Option A — the subject registry leaves the engine repository).** Row 1 of the frozen
AlmiVisibility checklist says: *"Connect/declare an AlmiWorld product; keep each product's data, evidence, costs and
learning ISOLATED."* A product's own data inside the engine repository was never what it said; that arrangement was a
build-time decision never put to the owner, and it is reversed.

| | |
|---|---|
| source repository | `smnasiruz016-blip/almi-visibility` (`C:\Projects\almi-visibility`) |
| source commit | `0e3bbd042abe30860ddf9e2ab900cc56a6ca0308` |
| moved | `products/almi-oet/**` → `almi-oet/**` — 16 files, 186730 bytes, written from the committed blobs and verified per file (sha256 and git object id) before removal from the source |
| moved on | 2026-09-14 |

🔴 **File history did not follow.** The files' earlier history lives in the source repository at the commit above
(`git log -- products/almi-oet` there). This repository's history starts at the move.

- One folder per product: `<id>/product.mjs`. AlmiVisibility finds it through its subject roots
  (`config/subject-roots.mjs`, overridable by `ALMIVISIBILITY_SUBJECT_ROOTS`).
- The files still import the engine by relative path (`../../src/...`). The engine resolves those into its own `src/`
  through a resolution hook and refuses any other escape; the files are not edited.
- AlmiVisibility does not write into this repository. Nothing generated lands here.
- `.gitattributes` keeps text LF in the repository, as the source did.
