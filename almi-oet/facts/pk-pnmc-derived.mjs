/**
 * PAKISTAN — PNMC · THE DERIVED COMPARISON. The registry's FIRST derived record.
 *
 * 🔴 NOTHING HERE WAS READ FROM A SOURCE. This record's source is its INPUTS, and that is not a
 * weaker kind of citation — it is a different kind. `pk-pnmc.mjs` holds the two fees, each read
 * from PNMC's own page and each carrying its own source, licence and freshness. This file holds
 * only the arithmetic between them, and the arithmetic is re-executable: `derivation.formula`
 * names a function in the frozen `FORMULAS` table, `derivation.inputs` names the two records, and
 * `derivation.inputValues` stores what they said when it ran.
 *
 * ── THE NEED IS NOT NEW, AND IT IS NOT THIS FILE'S ─────────────────────────────────────────────
 *
 * `pk-pnmc.mjs` has said since 10 September 2026, in its own header, that this comparison is the
 * thing worth holding:
 *
 *   "🔴 Rs.10,000 AGAINST Rs.1,000. A TENFOLD DIFFERENCE THAT EXISTS ONLY BECAUSE THE NURSE IS
 *    LEAVING. That is why the two fees are two records and not one with a note: they are different
 *    claims, they will change independently, and the comparison between them is the fact a reader
 *    actually needs."
 *
 * That sentence predates this record by nine days (engine commit 4b55e5e, 2026-09-10; carried into
 * this repository by the Option A move, a4b38cf, 2026-09-14). It is QUOTED here, not written here:
 * a need invented alongside the record that serves it would make the record its own justification.
 *
 * ── WHY `ratio` AND NOT `difference` ───────────────────────────────────────────────────────────
 *
 * The declaration commits to exactly one number — TENFOLD — and `ratio` over the two stored values
 * is the only member of the frozen table that yields it. `difference` yields 9,000, a figure that
 * appears nowhere in this repository, in `pk-pnmc.mjs`, or in the feasibility study that first
 * recorded the fee pair (`A1_FACT_SUPPLY_FEASIBILITY.md`: "a ten-fold difference that exists only
 * because the destination is foreign"). The formula was read off the declaration, not chosen for it.
 *
 * ── WHY IT IS UNKNOWN, AND WHY THAT IS THE POINT ───────────────────────────────────────────────
 *
 * Both fees are UNKNOWN, so this is UNKNOWN. `makeDerivedFact` enforces that in its constructor
 * rather than trusting this file to declare it honestly: a derived fact can never be more verified
 * than its weakest input, because clean arithmetic over an unchecked number is exactly the mistake
 * that reads as rigour.
 *
 * 🔴 NO UNIT. A ratio of two PKR amounts is dimensionless, and `unit` is null rather than carrying
 * an invented word for that. What the 10 MEANS is carried by `derivation.formula`, which a machine
 * reads, not by a label a reader has to trust.
 */
import { fact } from "../../../src/facts/record.mjs";
import { makeDerivedFact } from "../../../src/facts/lifecycle.mjs";
import { factId } from "../../../src/facts/schema.mjs";

const FOREIGN = "pk-pnmc.verification-fee.destination=foreign";
const DOMESTIC = "pk-pnmc.verification-fee.destination=domestic";

/**
 * 🔴 A SNAPSHOT, AND IT MUST BE ONE. These are the two inputs AS THEY STOOD when the derivation
 * ran. They are written here rather than imported live from `pk-pnmc.mjs` for one reason: F28
 * requires `inputValues` to hold "the value of every input it was computed from — without them a
 * changed input cannot be detected". A live import would recompute the snapshot on every load, so
 * the stored values could never disagree with the records, and `detectInputChanges` could never
 * fire. A frozen snapshot is what makes INPUT_CHANGED possible at all.
 *
 * NOTHING HERE IS TRUSTED. On every validation run F29 re-reads both records from the registry and
 * re-judges this record against them twice over: the stored value must equal the formula over the
 * inputs AS THEY NOW STAND, and the declared standing must equal the ceiling their CURRENT states
 * give. If either fee's value or verification state moves, this record goes RED and is recomputed
 * by a person — it is never silently repaired.
 *
 * ORDER IS THE CLAIM: ratio takes [foreign, domestic] and answers "the foreign fee is N times the
 * domestic one" — 10000 / 1000 = 10. Reversed it would answer a different question and give 0.1.
 */
const INPUT_SNAPSHOT = Object.freeze([
  Object.freeze({ id: FOREIGN, value: Object.freeze({ value: 10000 }), verificationState: "UNKNOWN" }),
  Object.freeze({ id: DOMESTIC, value: Object.freeze({ value: 1000 }), verificationState: "UNKNOWN" }),
]);

const CLAIM = Object.freeze({
  subject: "pk-pnmc",
  predicate: "verification-fee-foreign-to-domestic-ratio",
  qualifier: null,
});

export default [
  fact({
    ...makeDerivedFact({
      /* 🔴 DERIVED, NEVER TYPED (F1) — the id cannot disagree with the claim it makes. */
      id: factId(CLAIM),
      claim: CLAIM,
      formula: "ratio",
      inputs: [FOREIGN, DOMESTIC],
      inputFacts: INPUT_SNAPSHOT,
      unit: null,
      /* A date is a measurement, never the clock's guess. The derivation itself reads no clock, so
       * the same derivation over the same inputs is byte-identical every time it runs. */
      computedOn: "2026-09-19",
    }),
    /* The fields every record carries, derived or not. Both inputs are origin-scoped and share a
     * locale; a comparison between them cannot honestly sit anywhere else. */
    scope: "origin",
    locale: { origin: "pakistan", profession: "nursing" },
    life: { status: "active", extractedOn: "2026-09-19", firstSeenOn: "2026-09-19" },
  }),
];
