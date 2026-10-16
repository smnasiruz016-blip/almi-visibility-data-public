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

- One folder per product: `<id>/product.mjs`. **Since F03 (25 September 2026) a folder is a product only because
  `roots.json` declares it**, and AlmiVisibility never lists this repository to find products. The engine locates this
  repository through its subject roots (`config/subject-roots.mjs`, overridable by `ALMIVISIBILITY_SUBJECT_ROOTS`).
- `roots.json` (F03, the root registry) declares:
  - the stores inside this repository: `declarations/`, `observations/`, `captures/` and `research/`;
  - each product's folder;
  - the F02 resources each product consists of;
  - the connectors the engine may construct on its behalf. Each connector names the F02 resources it reaches and, where
    it needs one, its credential BY NAME (an environment variable). It never holds a credential's value.

  The file names no tenant. Which tenant a product or a connector belongs to is decided only by `tenancy/`, through the
  engine's one F02 decision.
- The files still import the engine by relative path (`../../src/...`). The engine resolves those into its own `src/`
  through a resolution hook and refuses any other escape; the files are not edited.
- AlmiVisibility does not write into this repository. Nothing generated lands here. **One exception, by the
  owner's F01 command of 24 September 2026 (§7):** `bin/project-intake.mjs --submit --confirm` writes accepted project
  declarations under `declarations/`, and only through the engine's governed-write boundary. See
  `declarations/README.md`. Those declarations are what a submitter declared; nothing in them is generated.
- `.gitattributes` keeps text LF in the repository, as the source did.

## Public since 16 October 2026 (owner decision RR-274)

This repository is public. Its history was cleaned before release: it holds no secret, no page text of another organisation, no
browser capture or client file, and no personal data. A stored source read keeps its URL, read date and sha256 with `text: null` and
`textAt: "PRIVATE_SOURCES"`; the full text is kept in a private repository the engine reads (the engine's `config/private-sources.mjs`).
A fact keeps its short verbatim quotation.
