# The fee in rupees: NOT SHOWN (measured 13 October 2026)

The owner approved a line "≈ PKR <amount> at the <date> exchange rate" from an official rate source (the State Bank of Pakistan).

- The exam body's price outside the USA is in AUSTRALIAN dollars (AU$587). Its US-dollar price (US$455) is for tests taken in the USA.
- The State Bank of Pakistan sheets read on 13 October 2026 (the weighted-average and the revaluation sheet "as on 12-Oct-2026") show
  the US dollar only: weighted average 276.6927 / 277.1178, revaluation rate 276.9736. No Australian-dollar rate was on either sheet read.
- So no official AUD-to-PKR rate is recorded, and none is invented: `conversion-rates.json` is empty and no rupee figure is on any page.
  The US-dollar rate is kept in `exchange-rate-facts.json` as a dated fact, not used on a page.

The engine's conversion line is built and tested. It needs one record in `conversion-rates.json`:
`{ "page", "claimId", "shown": "AU$587", "amount": 587, "from": "AUD", "to": "PKR", "rate", "rateDate", "source", "link", "staleAfterDays" }`.
