#!/usr/bin/env node
/**
 * THE DATA REPOSITORY'S OWN CHECK — its declarations, attachments, tenant scope and references, with NO live request (RR-135 §3).
 *
 *   node ci/validate-declarations.mjs [<data root>]        exit 0 = every rule holds · exit 1 = at least one violation
 *
 * What it reads: roots.json, tenancy/tenants.json, tenancy/attachments.json, and each research batch's seeds.txt, all on disk.
 * What it never does: fetch, resolve a name, open a socket, read an environment variable's value, or write anything.
 *
 * Why it is self-contained: the engine's own resolver lives in a private repository, and a workflow here could only check it out with
 * a key that only the owner can create. These rules are the data's REFERENTIAL law. The engine's F02/F03 decisions still run against
 * this repository in the engine's CI, and they remain the authority.
 *
 * Output is counts and rule codes only: no host, URL, tenant id, path or label is printed.
 */
import { readFileSync, existsSync, statSync } from "node:fs";
import { join, resolve } from "node:path";
import { pathToFileURL } from "node:url";

const TENANT_ID = /^tenant:[0-9a-f]{32}$/;
const DATE = /^\d{4}-\d{2}-\d{2}$/;
const ENV_NAME = /^[A-Z][A-Z0-9_]*$/;
const BATCH_ID = /^[a-z0-9][a-z0-9-]*$/;

/** Validate the data root at `root`; returns { violations: [{rule, n}], counts }. Pure apart from reading files under `root`. */
export function validateDataRoot(root) {
  const v = new Map();
  const bad = (rule) => v.set(rule, (v.get(rule) ?? 0) + 1);
  const readJson = (rel, rule) => {
    try { return JSON.parse(readFileSync(join(root, rel), "utf8")); } catch { bad(rule); return null; }
  };
  const isDir = (p) => existsSync(p) && statSync(p).isDirectory();

  const roots = readJson("roots.json", "ROOTS_UNREADABLE");
  const tenantsDoc = readJson(join("tenancy", "tenants.json"), "TENANTS_UNREADABLE");
  const attachDoc = readJson(join("tenancy", "attachments.json"), "ATTACHMENTS_UNREADABLE");
  const counts = { tenants: 0, attachments: 0, subjects: 0, connectors: 0, researchBatches: 0, seedFiles: 0, seeds: 0 };
  if (!roots || !tenantsDoc || !attachDoc) return { violations: [...v].map(([rule, n]) => ({ rule, n })), counts };

  /* tenants */
  const tenants = Array.isArray(tenantsDoc.tenants) ? tenantsDoc.tenants : (bad("TENANTS_NOT_A_LIST"), []);
  const tenantIds = new Set();
  for (const t of tenants) {
    counts.tenants += 1;
    if (!TENANT_ID.test(t?.tenantId ?? "")) bad("TENANT_ID_MALFORMED");
    else if (tenantIds.has(t.tenantId)) bad("TENANT_DECLARED_TWICE");
    else tenantIds.add(t.tenantId);
    if (t?.status !== "ACTIVE" && t?.status !== "RETIRED") bad("TENANT_STATUS_UNKNOWN");
    if (!DATE.test(t?.declaredOn ?? "")) bad("TENANT_DATE_MALFORMED");
    if (typeof t?.declarationBasis !== "string" || t.declarationBasis === "") bad("TENANT_BASIS_MISSING");
  }

  /* attachments: one resource, one tenant, a declared tenant, a date and a basis */
  const attachments = Array.isArray(attachDoc.attachments) ? attachDoc.attachments : (bad("ATTACHMENTS_NOT_A_LIST"), []);
  const owner = new Map();
  const key = (k, r) => `${k}\u0000${r}`;
  for (const a of attachments) {
    counts.attachments += 1;
    if (typeof a?.resourceKind !== "string" || typeof a?.resourceRef !== "string" || a.resourceRef === "") { bad("ATTACHMENT_RESOURCE_MALFORMED"); continue; }
    if (!tenantIds.has(a.tenantId)) bad("ATTACHMENT_TO_UNDECLARED_TENANT");
    if (!DATE.test(a?.declaredOn ?? "")) bad("ATTACHMENT_DATE_MALFORMED");
    if (typeof a?.declarationBasis !== "string" || a.declarationBasis === "") bad("ATTACHMENT_BASIS_MISSING");
    const k = key(a.resourceKind, a.resourceRef);
    if (owner.has(k)) bad("RESOURCE_ATTACHED_TWICE");
    else owner.set(k, a.tenantId);
    if (a.resourceKind === "SITE_ORIGIN") {
      let u = null;
      try { u = new URL(a.resourceRef); } catch { bad("SITE_ORIGIN_NOT_A_URL"); }
      if (u && (u.protocol !== "https:" || u.origin !== a.resourceRef.replace(/\/$/, ""))) bad("SITE_ORIGIN_NOT_AN_HTTPS_ORIGIN");
    }
  }

  /* stores */
  const stores = Array.isArray(roots.stores) ? roots.stores : (bad("STORES_NOT_A_LIST"), []);
  for (const s of stores) if (typeof s?.path !== "string" || !isDir(join(root, s.path))) bad("STORE_DIRECTORY_ABSENT");
  const research = stores.find((s) => s?.store === "RESEARCH");

  /* subjects: every member and every connector reach is attached, and all of them to ONE tenant; a credential is a NAME */
  const subjects = Array.isArray(roots.subjects) ? roots.subjects : (bad("SUBJECTS_NOT_A_LIST"), []);
  const subjectIds = new Set();
  for (const s of subjects) {
    counts.subjects += 1;
    if (typeof s?.subjectId !== "string" || s.subjectId === "") { bad("SUBJECT_ID_MISSING"); continue; }
    if (subjectIds.has(s.subjectId)) bad("SUBJECT_DECLARED_TWICE");
    subjectIds.add(s.subjectId);
    if (typeof s.path !== "string" || !isDir(join(root, s.path))) bad("SUBJECT_DIRECTORY_ABSENT");
    const resources = [...(s.members ?? []), ...(s.connectors ?? []).flatMap((c) => c?.reaches ?? [])];
    const tenantsOfSubject = new Set();
    for (const m of resources) {
      const t = owner.get(key(m?.resourceKind, m?.resourceRef));
      if (t === undefined) bad("SUBJECT_RESOURCE_NOT_ATTACHED");
      else tenantsOfSubject.add(t);
    }
    if (tenantsOfSubject.size > 1) bad("SUBJECT_SPANS_TENANTS");
    const kinds = new Set();
    for (const c of s.connectors ?? []) {
      counts.connectors += 1;
      if (kinds.has(c?.kind)) bad("CONNECTOR_KIND_DECLARED_TWICE");
      kinds.add(c?.kind);
      if (!Array.isArray(c?.reaches) || c.reaches.length === 0) bad("CONNECTOR_REACHES_NOTHING");
      const cred = c?.credential;
      if (cred !== null && cred !== undefined) {
        const keys = Object.keys(cred).sort().join();
        if (cred.mechanism !== "ENV_REFERENCE" || !ENV_NAME.test(cred.name ?? "") || keys !== "mechanism,name") bad("CREDENTIAL_NOT_A_NAME");
      }
    }
  }

  /* research batches: an attached batch has its directory; its seeds are URLs on a site origin of the batch's own tenant */
  const batches = attachments.filter((a) => a?.resourceKind === "RESEARCH_BATCH");
  for (const b of batches) {
    counts.researchBatches += 1;
    if (!BATCH_ID.test(b.resourceRef)) { bad("BATCH_ID_MALFORMED"); continue; }
    const dir = research ? join(root, research.path, b.resourceRef) : null;
    if (!dir || !isDir(dir)) { bad("BATCH_DIRECTORY_ABSENT"); continue; }
    const seedsFile = join(dir, "seeds.txt");
    if (!existsSync(seedsFile)) continue;
    counts.seedFiles += 1;
    const tenantOrigins = new Set(attachments.filter((a) => a?.resourceKind === "SITE_ORIGIN" && a.tenantId === b.tenantId).map((a) => a.resourceRef.replace(/\/$/, "")));
    const seeds = readFileSync(seedsFile, "utf8").split(/\r?\n/).map((l) => l.trim()).filter((l) => l !== "" && !l.startsWith("#"));
    if (seeds.length === 0) bad("BATCH_SEEDS_EMPTY");
    for (const s of seeds) {
      counts.seeds += 1;
      let u = null;
      try { u = new URL(s); } catch { bad("SEED_NOT_A_URL"); continue; }
      if (u.protocol !== "https:") bad("SEED_NOT_HTTPS");
      else if (!tenantOrigins.has(u.origin)) bad("SEED_OUTSIDE_THE_BATCH_TENANTS_SITE");
    }
  }
  return { violations: [...v].map(([rule, n]) => ({ rule, n })), counts };
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  const root = resolve(process.argv[2] ?? ".");
  const { violations, counts } = validateDataRoot(root);
  console.log(`declarations: ${Object.entries(counts).map(([k, n]) => `${k} ${n}`).join(" · ")}`);
  if (violations.length) {
    for (const x of violations) console.log(`VIOLATION ${x.rule} × ${x.n}`);
    console.log(`RESULT: FAIL — ${violations.reduce((s, x) => s + x.n, 0)} violation(s) of ${violations.length} rule(s)`);
    process.exit(1);
  }
  console.log("RESULT: PASS — every rule holds");
}
