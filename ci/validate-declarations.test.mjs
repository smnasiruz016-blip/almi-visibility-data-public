/**
 * The data check can FAIL: each rule is shown rejecting a bad declaration, a valid world is shown accepted, and so is this repository.
 *   node --test ci/
 */
import test from "node:test";
import assert from "node:assert/strict";
import { mkdtempSync, mkdirSync, writeFileSync, rmSync } from "node:fs";
import { join, resolve } from "node:path";
import { tmpdir } from "node:os";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

import { validateDataRoot } from "./validate-declarations.mjs";

const HERE = fileURLToPath(new URL(".", import.meta.url));
const REPO = resolve(HERE, "..");
const T1 = `tenant:${"1".repeat(32)}`, T2 = `tenant:${"2".repeat(32)}`;
const ORIGIN = "https://site-one.invalid", ORIGIN2 = "https://site-two.invalid";
const att = (resourceKind, resourceRef, tenantId = T1) => ({ schemaVersion: 1, resourceKind, resourceRef, tenantId, declaredOn: "2026-10-02", declarationBasis: "TEST" });

/** A minimal VALID world: two tenants, one subject per tenant, one batch with seeds on its own tenant's site. */
function validWorld() {
  return {
    roots: { schemaVersion: 1, kind: "ROOT_REGISTRY", stores: [{ store: "RESEARCH", path: "research" }], subjects: [
      { subjectId: "one", path: "one", members: [{ resourceKind: "SITE_ORIGIN", resourceRef: ORIGIN }, { resourceKind: "RESEARCH_BATCH", resourceRef: "batch-one" }],
        connectors: [{ connectorId: "site", kind: "PUBLIC_SITE", credential: null, reaches: [{ resourceKind: "SITE_ORIGIN", resourceRef: ORIGIN }] },
          { connectorId: "search", kind: "SEARCH_CONSOLE_API", credential: { mechanism: "ENV_REFERENCE", name: "A_KEY_FILE" }, reaches: [{ resourceKind: "SITE_ORIGIN", resourceRef: ORIGIN }] }] },
      { subjectId: "two", path: "two", members: [{ resourceKind: "SITE_ORIGIN", resourceRef: ORIGIN2 }], connectors: [] },
    ] },
    tenants: { schemaVersion: 1, tenants: [T1, T2].map((tenantId) => ({ schemaVersion: 1, tenantId, status: "ACTIVE", declaredOn: "2026-10-02", declarationBasis: "TEST", label: "test" })) },
    attachments: { schemaVersion: 1, attachments: [att("SITE_ORIGIN", ORIGIN), att("RESEARCH_BATCH", "batch-one"), att("SITE_ORIGIN", ORIGIN2, T2)] },
    seeds: { "batch-one": `# test\n${ORIGIN}/a\n${ORIGIN}/b\n` },
    recrawl: { schemaVersion: 1, settings: [{ subjectId: "one", everyHours: 24, declaredOn: "2026-10-03", basis: "TEST" }] },
  };
}
function materialise(w) {
  const root = mkdtempSync(join(tmpdir(), "data-ci-"));
  for (const d of ["research", "one", "two", "tenancy"]) mkdirSync(join(root, d), { recursive: true });
  writeFileSync(join(root, "roots.json"), typeof w.roots === "string" ? w.roots : JSON.stringify(w.roots));
  writeFileSync(join(root, "tenancy", "tenants.json"), JSON.stringify(w.tenants));
  writeFileSync(join(root, "tenancy", "attachments.json"), JSON.stringify(w.attachments));
  for (const [b, s] of Object.entries(w.seeds)) { mkdirSync(join(root, "research", b), { recursive: true }); writeFileSync(join(root, "research", b, "seeds.txt"), s); }
  if (w.recrawl !== undefined) writeFileSync(join(root, "tenancy", "recrawl-settings.json"), typeof w.recrawl === "string" ? w.recrawl : JSON.stringify(w.recrawl));
  return root;
}
function check(mutate) {
  const w = validWorld();
  mutate?.(w);
  const root = materialise(w);
  try { return validateDataRoot(root); } finally { rmSync(root, { recursive: true, force: true }); }
}
const rules = (r) => r.violations.map((x) => x.rule).sort();

test("ACCEPTS a valid world", () => {
  const r = check();
  assert.deepEqual(r.violations, []);
  assert.equal(r.counts.seeds, 2);
});

test("ACCEPTS this repository's own declarations", () => {
  const r = validateDataRoot(REPO);
  assert.deepEqual(r.violations, []);
  assert.ok(r.counts.tenants > 0 && r.counts.attachments > 0 && r.counts.subjects > 0, "an empty population is not a pass");
});

const BAD = [
  ["an attachment to a tenant nobody declared", "ATTACHMENT_TO_UNDECLARED_TENANT", (w) => { w.attachments.attachments[0].tenantId = `tenant:${"9".repeat(32)}`; }],
  ["one resource attached twice", "RESOURCE_ATTACHED_TWICE", (w) => { w.attachments.attachments.push(att("SITE_ORIGIN", ORIGIN, T2)); }],
  ["a subject member nobody attached", "SUBJECT_RESOURCE_NOT_ATTACHED", (w) => { w.roots.subjects[0].members.push({ resourceKind: "FACT_REGISTRY", resourceRef: "one/facts" }); }],
  ["a subject whose resources span two tenants", "SUBJECT_SPANS_TENANTS", (w) => { w.roots.subjects[0].members.push({ resourceKind: "SITE_ORIGIN", resourceRef: ORIGIN2 }); }],
  ["a credential that carries more than a name", "CREDENTIAL_NOT_A_NAME", (w) => { w.roots.subjects[0].connectors[1].credential = { mechanism: "ENV_REFERENCE", name: "A_KEY_FILE", value: "x" }; }],
  ["a seed on another tenant's site", "SEED_OUTSIDE_THE_BATCH_TENANTS_SITE", (w) => { w.seeds["batch-one"] += `${ORIGIN2}/c\n`; }],
  ["a seed that is not a URL", "SEED_NOT_A_URL", (w) => { w.seeds["batch-one"] += "not a url\n"; }],
  ["a batch with no seed", "BATCH_SEEDS_EMPTY", (w) => { w.seeds["batch-one"] = "# nothing\n"; }],
  ["an attached batch with no directory", "BATCH_DIRECTORY_ABSENT", (w) => { w.attachments.attachments.push(att("RESEARCH_BATCH", "batch-missing")); }],
  ["a subject directory that does not exist", "SUBJECT_DIRECTORY_ABSENT", (w) => { w.roots.subjects[1].path = "nowhere"; }],
  ["a site origin that is not an https origin", "SITE_ORIGIN_NOT_AN_HTTPS_ORIGIN", (w) => { w.attachments.attachments[0].resourceRef = "http://site-one.invalid/path"; w.roots.subjects[0].members[0].resourceRef = "http://site-one.invalid/path"; w.roots.subjects[0].connectors.forEach((c) => { c.reaches = [{ resourceKind: "SITE_ORIGIN", resourceRef: "http://site-one.invalid/path" }]; }); }],
  ["a tenant declared twice", "TENANT_DECLARED_TWICE", (w) => { w.tenants.tenants.push({ ...w.tenants.tenants[0] }); }],
  ["an unreadable root registry", "ROOTS_UNREADABLE", (w) => { w.roots = "{ not json"; }],
  /* RR-138 §4 · per-client recrawl settings */
  ["a recrawl setting for a subject nobody declared", "RECRAWL_SETTING_FOR_UNDECLARED_SUBJECT", (w) => { w.recrawl.settings[0].subjectId = "nobody"; }],
  ["a recrawl interval that is not a whole hour ≥ 1", "RECRAWL_INTERVAL_NOT_A_POSITIVE_WHOLE_HOUR", (w) => { w.recrawl.settings[0].everyHours = 0; }],
  ["two recrawl settings for one subject", "RECRAWL_SETTING_DECLARED_TWICE", (w) => { w.recrawl.settings.push({ ...w.recrawl.settings[0] }); }],
  ["a recrawl setting with no basis", "RECRAWL_SETTING_BASIS_MISSING", (w) => { w.recrawl.settings[0].basis = ""; }],
  ["an unreadable recrawl settings file", "RECRAWL_SETTINGS_UNREADABLE", (w) => { w.recrawl = "{ nope"; }],
];
for (const [what, rule, mutate] of BAD) {
  test(`REJECTS ${what} — ${rule}`, () => assert.ok(rules(check(mutate)).includes(rule), `expected ${rule}, got ${rules(check(mutate)).join(", ") || "no violation"}`));
}

test("the CLI exits 1 on a bad declaration and 0 on a valid one, printing no host, URL or tenant id", () => {
  for (const [mutate, code] of [[(w) => { w.seeds["batch-one"] += `${ORIGIN2}/c\n`; }, 1], [null, 0]]) {
    const w = validWorld();
    mutate?.(w);
    const root = materialise(w);
    try {
      const r = spawnSync(process.execPath, [join(HERE, "validate-declarations.mjs"), root], { encoding: "utf8" });
      assert.equal(r.status, code, r.stdout + r.stderr);
      assert.doesNotMatch(r.stdout, /https?:\/\/|tenant:[0-9a-f]/);
    } finally { rmSync(root, { recursive: true, force: true }); }
  }
});
