/**
 * ALMIOET — THE CLIENT PRODUCT QUESTIONNAIRE (owner answer A2, RR-250, 12 October 2026).
 *
 * The contract is the engine's: src/questionnaire/product-questionnaire.mjs (product-questionnaire/1). This file is DATA ONLY and
 * imports nothing. Its leading underscore keeps it out of the fact records.
 *
 * 🔴 EVERY ANSWER BELOW IS INFERRED, AND EVERY ONE WAS APPROVED BY THE OWNER ON 12 OCTOBER 2026 (RR-251) "as correct for the
 * product as it is live today". The approval is the committed record each answer names. An approved answer is a SELF-SOURCED
 * capability claim: the product speaking about itself — never an independent fact, never VERIFIED.
 * 🔴 ONE ANSWER WAS REWORDED AND APPROVED SEPARATELY: the size of a full mock. It was first shown to the owner as "22 items"; the 22 are
 * TASKS (the product's mock plan), each Listening or Reading task holding several questions, so the word was misleading. The owner approved
 * the corrected wording on 12 October 2026 (RR-252), and that answer names that record. All 24 answers are now approved.
 * 🔴 THE OWNER'S RULE (RR-251): when the product's live pricing changes, these answers must be updated and approved again.
 *
 * The client did not write these: CC pre-filled them on 12 October
 * 2026 from the product's own code (repository almi-oet, origin/main 9e14caa — the five files read are byte-identical there
 * and on the working head a4514b3) and from one read of the product's public pricing page. Each answer names what it was
 * inferred from.
 *
 * 🔴 WHAT WAS LEFT OUT ON PURPOSE, AND STAYS OUT (the owner, RR-251: "stay omitted, not invented"):
 *   · the size of the practice bank — two dated code comments disagree (516 and 507) and no constant states it;
 *   · the number of distinct mock tests — mocks are assembled from the bank;
 *   · the amount actually charged — the code states the ADVERTISED price and says the payment provider holds the charged one.
 * The currency CODE is not in the code or on the public page (both show only "$"); "USD" is the owner's own word (RR-251).
 */
const APPROVED = Object.freeze({ state: "APPROVED", by: "owner", on: "2026-10-12", record: Object.freeze({ repo: "_handoffs", path: "AlmiVisibility_OWNER_DECISION_2026-10-12_RR-251_APPROVE_CLIENT_ANSWERS_F44_A1_SPEC_A6.md", commit: "f7cd82179d8f1b1c74cbe49cdfb3cb413736f835" }) });
const code = (ref) => Object.freeze({ kind: "CODE", ref });
const site = (ref) => Object.freeze({ kind: "PUBLIC_SITE", ref });
/* the one answer approved separately, in the owner's own wording (RR-252, answer 3) */
const APPROVED_REWORDED = Object.freeze({ state: "APPROVED", by: "owner", on: "2026-10-12", record: Object.freeze({ repo: "_handoffs", path: "AlmiVisibility_OWNER_DECISION_2026-10-12_RR-252_MERGE_ANSWERS.md", commit: "38d6e9182e1cc9c5b09a4c8109f27e6300bd6c4a" }) });
const says = (answerId, section, statement, value, inferredFrom, approval = APPROVED) => Object.freeze({ answerId, section, statement, value, basis: "INFERRED", inferredFrom: Object.freeze(inferredFrom), approval });
const money = (value, unit) => Object.freeze({ value, valueType: "money", unit });
const duration = (value, unit) => Object.freeze({ value, valueType: "duration", unit });
const count = (value, unit) => Object.freeze({ value, valueType: "count", unit });

const OFFER = "almi-oet:src/lib/billing/offer.ts";
const REGISTRY = "almi-oet:src/lib/oet/registry.ts";
const SHAPE = "almi-oet:src/lib/oet/exam-shape.ts";
const PRICING_COPY = "almi-oet:src/app/pricing/page.tsx";
const PRICING_PAGE = "the product's public pricing page, read once on 2026-10-12";

export default Object.freeze({
  schemaVersion: 1,
  contractId: "product-questionnaire/1",
  questionnaireId: "almi-oet-2026-10-12",
  tenantId: "tenant:93b991d5afa33b16ccb9166b249593b6",
  productId: "almi-oet",
  submittedBy: "actor:cc (pre-filled for the client; not the client's own submission)",
  submittedOn: "2026-10-12",
  /**
   * 🔴 THE CLIENT'S DESIGN (the owner's standing page law, RR-255, clause 1) — how a page built for this product must LOOK: the product's
   * own header, colours, fonts, cards and footer. READ, read-only, by CC on 12 October 2026 from the product's own code (repository
   * almi-oet, working head a4514b3; nothing in that repository was changed). The client has not filed it itself yet. It is not an answer,
   * not a capability record and not evidence. The product line is the owner's own declared wording (RR-253, answer 4).
   * Left out: the footer's "Products" column (the code builds it from a shared list, not from a fixed text).
   */
  design: Object.freeze({
    siteAddress: "https://almioet.almiworld.com",
    brandName: "AlmiOET",
    productLine: "AlmiOET — online OET practice: all four sub-tests, AI feedback on Writing and Speaking.",
    logo: Object.freeze({ mark: "A", wordmark: "AlmiOET" }),
    colours: Object.freeze({ background: "#FFFBF5", surface: "#FFFFFF", border: "#FFE8D6", primary: "#FF7A6B", primaryDeep: "#ff6b5b", accent: "#0d9488", ink: "#1a1a2e", text: "#334155", muted: "#475569", footerBackground: "#14110D", footerAccent: "#D4A24C", onDark: "#f8fafc" }),
    fonts: Object.freeze({ body: "Inter, ui-sans-serif, system-ui, -apple-system, \"Segoe UI\", sans-serif" }),
    card: Object.freeze({ radius: "16px" }),
    nav: Object.freeze([Object.freeze({ label: "Practice", href: "/practice" }), Object.freeze({ label: "Log in", href: "/login" })]),
    cta: Object.freeze({ label: "Start 7-day free trial", href: "/signup" }),
    footer: Object.freeze({
      columns: Object.freeze([
        Object.freeze({ title: "AlmiWorld", links: Object.freeze([Object.freeze({ label: "Home", href: "https://almiworld.com/" }), Object.freeze({ label: "Ebooks", href: "https://almiworld.com/ebooks-2/" }), Object.freeze({ label: "Shamool Foundation", href: "https://shamoolfoundation.com/" })]) }),
        Object.freeze({ title: "Legal & Contact", links: Object.freeze([Object.freeze({ label: "Contact Us", href: "https://almiworld.com/contact-us/" }), Object.freeze({ label: "Refund and Return Policy", href: "https://almiworld.com/refund_returns/" }), Object.freeze({ label: "Privacy Policy", href: "https://almiworld.com/privacy-policy/" })]) }),
      ]),
      notice: "© 2026 AlmiWorld. All rights reserved.",
    }),
    basis: "READ_FROM_CLIENT_SITE",
    readFrom: Object.freeze([code("almi-oet:src/app/globals.css"), code("almi-oet:src/components/GlobalHeader.tsx"), code("almi-oet:src/components/GlobalFooter.tsx")]),
  }),
  answers: Object.freeze([
    // ── what the product does ──
    says("practice-all-four-sub-tests", "CAPABILITY", "Students practise all four OET sub-tests: Listening, Reading, Writing and Speaking.", null, [code(REGISTRY), site(PRICING_PAGE)]),
    says("auto-marked-listening-and-reading", "CAPABILITY", "Listening and Reading answers are marked automatically.", null, [code(REGISTRY)]),
    says("ai-feedback-writing-and-speaking", "CAPABILITY", "The Writing letter and the Speaking role-play get AI feedback against the OET criteria.", null, [code(REGISTRY), code(PRICING_COPY), site(PRICING_PAGE)]),
    says("speaking-judged-from-transcript", "CAPABILITY", "Speaking is judged from a transcript of what the student said, not from accent or audio quality.", null, [code(REGISTRY)]),
    says("estimate-per-sub-test-as-a-range", "CAPABILITY", "Each sub-test gets an estimated score on the 0 to 500 scale with a grade (A, B, C+ or C), shown as a range. No overall score is given.", null, [code(PRICING_COPY), site(PRICING_PAGE)]),
    says("writing-and-speaking-by-profession", "CAPABILITY", "Writing and Speaking tasks are specific to the student's profession; Listening and Reading are shared by all professions.", null, [code("almi-oet:src/lib/oet/professions.ts")]),
    says("full-mock-in-one-sitting", "CAPABILITY", "A student can sit a full mock test in the OET order in one sitting, and resume an unfinished one.", null, [code(REGISTRY), code("almi-oet:src/app/(app)/practice/mock/page.tsx")]),
    says("adaptive-difficulty", "CAPABILITY", "Practice adapts to the student's level across three difficulty levels.", null, [code("almi-oet:src/lib/oet/session.ts"), site(PRICING_PAGE)]),
    says("progress-page", "CAPABILITY", "A progress page shows, per sub-test, how many exercises are done and which exercise to do next.", null, [code("almi-oet:src/app/(app)/progress/page.tsx")]),
    says("original-material", "CAPABILITY", "All practice material is original and is never copied from OET.", null, [code(PRICING_COPY), site(PRICING_PAGE)]),
    says("cancel-anytime", "CAPABILITY", "A subscriber can cancel at any time from the account page.", null, [code(PRICING_COPY), site(PRICING_PAGE)]),
    // ── prices ──
    says("price-pro-monthly", "PRICE", "The one plan on sale, Pro, is advertised at this price per month. There is no yearly plan and no free plan.", money(12, "USD"), [code(OFFER), code(PRICING_COPY), site(PRICING_PAGE)]),
    // ── durations ──
    says("free-trial-length", "DURATION", "The free trial lasts this long. A card is entered at the start and is not charged during the trial.", duration(7, "days"), [code(OFFER), site(PRICING_PAGE)]),
    says("billing-period", "DURATION", "The subscription renews every billing period of this length.", duration(1, "months"), [code(PRICING_COPY), site(PRICING_PAGE)]),
    says("reading-part-a-time", "DURATION", "Reading Part A is timed at this length.", duration(15, "minutes"), [code(SHAPE)]),
    says("reading-parts-b-and-c-time", "DURATION", "Reading Parts B and C together are timed at this length.", duration(45, "minutes"), [code(SHAPE)]),
    says("writing-time", "DURATION", "The Writing task is timed at this length in total: 5 minutes of reading time, then 40 minutes of writing.", duration(45, "minutes"), [code(SHAPE)]),
    says("speaking-preparation-time", "DURATION", "Each Speaking role-play has this much preparation time.", duration(3, "minutes"), [code(SHAPE)]),
    says("speaking-role-play-time", "DURATION", "Each Speaking role-play lasts this long.", duration(5, "minutes"), [code(SHAPE)]),
    // ── counts ──
    says("professions-supported", "COUNT", "The product supports this many OET professions.", count(12, "professions"), [code("almi-oet:src/lib/oet/professions.ts")]),
    says("task-types", "COUNT", "The product has this many task types across the four sub-tests.", count(8, "task types"), [code(REGISTRY)]),
    /* reworded after the first approval, then approved in the owner's own words (RR-252) — the statement is his sentence, word for word */
  says("tasks-in-one-full-mock", "COUNT", "A full mock has 22 tasks: 10 Listening, 9 Reading, 1 Writing, 2 Speaking; the question count is not given here.", count(22, "tasks"), [code(REGISTRY)], APPROVED_REWORDED),
  says("trial-ai-writing-evaluations", "COUNT", "A free trial includes this many AI evaluations of a Writing letter, for the whole trial. Paying subscribers have no such limit.", count(2, "evaluations"), [code(OFFER)]),
    says("trial-ai-speaking-evaluations", "COUNT", "A free trial includes this many AI evaluations of a Speaking role-play, for the whole trial. Paying subscribers have no such limit.", count(2, "evaluations"), [code(OFFER)]),
  ]),
});
