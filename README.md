# @inopay/web

[![npm version](https://img.shields.io/npm/v/@inopay/web.svg)](https://www.npmjs.com/package/@inopay/web)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

Inopay Web SDK — TypeScript client for the African capital markets infrastructure (BRVM, BVMAC, GSE) via the public Inopay sandbox.

## Status

`v0.1.0-alpha.1` — public alpha. Wraps `https://api.getinopay.com/v1/sandbox/*`. Production endpoints will follow with no client API change.

## Install

```bash
npm install @inopay/web
```

Or pin a specific version:

```bash
npm install @inopay/web@0.1.0-alpha.3
```

## Quick start

```ts
import { InopayClient } from '@inopay/web';

const inopay = new InopayClient({
  apiKey: 'sk_test_demo_inopay_2026', // public sandbox demo key, 60 req/min/IP
});

// List BRVM, BVMAC and GSE instruments
const { instruments } = await inopay.instruments.list();
console.log(instruments[0]); // { symbol: 'SNTS.BRVM', name: 'Sonatel SN', last_price: 23950, ... }

// Place a simulated order
const { order } = await inopay.orders.create({
  symbol: 'SNTS.BRVM',
  side: 'buy',
  qty: 10,
});
console.log(order.status); // 'filled'

// Fetch a mock signed KYC attestation
const { attestation } = await inopay.kyc.fetch('usr_demo_42');
console.log(attestation.ed25519_signature);
```

## API surface

- `client.health()` — sandbox status
- `client.instruments.list()` — list instruments (BRVM / BVMAC / GSE)
- `client.sgis.list()` — list partner SGIs
- `client.orders.create({ symbol, side, qty, sgi_id? })` — simulated order
- `client.orders.get(id)` — read back an order
- `client.kyc.fetch(userId)` — Ed25519-signed mock KYC attestation
- `client.sandbox.reset()` — reset the demo wallet

## Rate limit

The public demo key `sk_test_demo_inopay_2026` is rate-limited to **60 requests per minute per IP**.
For higher quotas and isolated environments, request a private sandbox key at <https://getinopay.com/fr/developers/sandbox>.

## Documentation

- API reference: <https://api.getinopay.com/v1/openapi.json>
- Sandbox docs: <https://getinopay.com/fr/developers/sandbox>
- Regulatory references: <https://getinopay.com/fr/legal/regulatory-references>

## Why Inopay

Inopay is the [investment infrastructure for African capital markets](https://getinopay.com/fr/why-inopay) — BRVM (WAEMU), BVMAC (CEMAC), GSE (Ghana). Mobile Money operators, banks and licensed SGIs embed the regional exchanges into their apps via this SDK.

- Use case **Mobile Money operators** → see [Pour opérateurs MoMo](https://getinopay.com/fr/momo)
- Use case **Banks** → see [Pour banques](https://getinopay.com/fr/banks)
- Use case **SGI** → see [Pour SGI](https://getinopay.com/fr/sgi)
- White-label deployment → see [White-label](https://getinopay.com/fr/white-label)

## Regulatory framework

Inopay is a technical intermediation provider. Orders are executed exclusively by [AMF-UMOA-licensed SGIs](https://getinopay.com/fr/legal/regulatory-references). The KYC framework aligns with BCEAO Instruction No. 003-03-2025.

- [Compliance & doctrine (AMF-UMOA, COSUMAF, SEC Ghana)](https://getinopay.com/fr/compliance)
- [Public regulatory references](https://getinopay.com/fr/legal/regulatory-references)
- [Trust center & data residency](https://getinopay.com/fr/trust)
- [Contractual SLA](https://getinopay.com/fr/sla)
- [Public audit chain](https://getinopay.com/fr/audit)

## Other Inopay SDKs

The Inopay SDK family — same API surface, five native platforms:

- [`@inopay/web`](https://github.com/fofanay/inopay-web) — TypeScript / Web
- [`InopaySDK`](https://github.com/fofanay/inopay-ios) — Swift / iOS / macOS
- [`inopay-android`](https://github.com/fofanay/inopay-android) — Kotlin / Android / JVM
- [`inopay`](https://github.com/fofanay/inopay-python) — Python (sync, requests-based)
- [`inopay-java`](https://github.com/fofanay/inopay-java) — Java (sync, java.net.http + Jackson)

## Documentation & support

- [Developer portal](https://getinopay.com/fr/developers) — API, webhooks, sandbox
- [API reference (OpenAPI 3.1)](https://api.getinopay.com/v1/openapi.json)
- [Sandbox console](https://getinopay.com/fr/developers/sandbox) — public demo key + 7 endpoints
- [Portable KYC spec](https://getinopay.com/fr/developers/kyc) — Ed25519, offline-verifiable
- [Webhooks reference](https://getinopay.com/fr/developers/webhooks)
- [Changelog](https://getinopay.com/fr/developers/changelog)
- [Press kit](https://getinopay.com/fr/press-kit) — logo, boilerplates, fact sheet

Need integration help? Email <partner@getinopay.com>.

## License

MIT — © Inopay
