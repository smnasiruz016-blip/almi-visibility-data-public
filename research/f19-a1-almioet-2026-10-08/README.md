# f19-a1-almioet-2026-10-08

RR-228 (owner GREEN, 8 Oct 2026, _handoffs 8997f4a): F19 Acceptance Amendment 1's real population for the owner's own site.

- sitemaps.jsonl — ONE live re-collect of the site's sitemap (index + children), stored whole (bin/crawl.mjs --sitemaps).
- seeds.txt — the /speech-pathology URLs of that listing, at most 199 (199 pages + robots.txt = 200 requests to the host).
- crawl.jsonl, ledger.jsonl, bodies.jsonl — ONE live crawl of those seeds; bodies stored in this batch.
