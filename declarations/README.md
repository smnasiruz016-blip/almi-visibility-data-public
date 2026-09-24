# declarations/ — accepted project declarations (F01)

**Owner command, 24 September 2026** (`_handoffs/AlmiVisibility_CC_COMMAND_2026-09-24_F01_COMPLETE.md`, §7): accepted
project declarations are client data, so they live here, beside the rest of the products' data, and never in the
engine repository.

`ROOT.json` declares this directory as the project declaration root. The engine
(`bin/project-intake.mjs` in `almi-visibility`) resolves exactly one declared external root carrying it. If none does,
or more than one does, it refuses to write.

## Layout

```
declarations/tenants/<tenant>/<projectId>/<declarationId>.json   one immutable submission (canonical JSON, UTF-8, LF)
declarations/tenants/<tenant>/<projectId>/current.json           which declaration of the project is current
```

`<tenant>` is the declared tenant id from `tenancy/tenants.json`, with its colon written as a hyphen.

## What a declaration is, and what it is not

- It records what a submitter **says**.
- It does not prove ownership, grant a permission, verify a fact or create a tenant.
- Every permission it names is a request. The engine records each as DENIED or PENDING, never GRANTED.

## What may be written here

- Only the intake, after `--submit --confirm`, through the engine's governed-write boundary, with every decision on
  the audit trail.
- Nothing is hand-edited. A submission file is never rewritten: an update is a new declaration that names what it
  supersedes.
- Nothing here is a secret. The intake refuses any value shaped like a credential.
- Nothing here is committed without review. The intake writes to this working tree, and the owner commits it by pull
  request, like every other change to this repository.
