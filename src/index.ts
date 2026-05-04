// @inopay/web — Inopay Web SDK
// Aligns with public sandbox at https://api.getinopay.com/v1/sandbox

export type Market = 'BRVM' | 'BVMAC' | 'GSE';
export type Currency = 'XOF' | 'XAF' | 'GHS';
export type OrderSide = 'buy' | 'sell';
export type OrderStatus = 'pending' | 'filled' | 'rejected' | 'cancelled';

export interface Instrument {
  symbol: string;
  name: string;
  market: Market;
  currency: Currency;
  last_price: number;
  change_pct: number;
}

export interface InstrumentList {
  sandbox?: boolean;
  as_of: string;
  instruments: Instrument[];
  pagination?: { page: number; count: number; total: number; message?: string };
}

export interface SGI {
  id: string;
  name: string;
  market: Market;
  fill_rate: number;
}

export interface CreateOrderInput {
  symbol: string;
  side: OrderSide;
  qty: number;
  sgi_id?: string;
}

export interface Order {
  id: string;
  symbol: string;
  side: OrderSide;
  qty: number;
  sgi_id: string;
  status: OrderStatus;
  avg_price: number;
  filled_qty: number;
  filled_at?: string;
  settlement_date?: string;
  settlement_currency?: Currency;
}

export interface KycAttestation {
  schema: 'inopay/kyc/v1';
  user_id: string;
  issuer: string;
  level: 'KYC1' | 'KYC2' | 'KYC3';
  issued_at: string;
  expires_at: string;
  key_id: string;
  ed25519_signature: string;
}

export interface SandboxResetResult {
  sandbox: boolean;
  reset_at: string;
  wallet_credit_cents: number;
  message: string;
}

export interface InopayClientOptions {
  /**
   * Inopay API key. Use `sk_test_demo_inopay_2026` for the public sandbox.
   * Request a private sandbox key at https://getinopay.com/fr/developers/sandbox
   */
  apiKey: string;
  /**
   * Base URL — defaults to the public sandbox.
   * Production: https://api.getinopay.com/v1
   */
  baseUrl?: string;
  /**
   * Custom fetch implementation. Defaults to global fetch (Node 18+, browsers).
   */
  fetch?: typeof fetch;
}

export class InopayError extends Error {
  public readonly status: number;
  public readonly code: string;
  public readonly detail?: string;

  constructor(status: number, code: string, message: string, detail?: string) {
    super(message);
    this.name = 'InopayError';
    this.status = status;
    this.code = code;
    this.detail = detail;
  }
}

export class InopayClient {
  private readonly apiKey: string;
  private readonly baseUrl: string;
  private readonly fetchImpl: typeof fetch;

  constructor(options: InopayClientOptions) {
    if (!options.apiKey) {
      throw new Error('InopayClient: apiKey is required');
    }
    this.apiKey = options.apiKey;
    this.baseUrl = (options.baseUrl ?? 'https://api.getinopay.com/v1/sandbox').replace(/\/$/, '');
    this.fetchImpl = options.fetch ?? globalThis.fetch;
    if (!this.fetchImpl) {
      throw new Error('InopayClient: no fetch implementation available — pass options.fetch');
    }
  }

  private async request<T>(path: string, init?: RequestInit): Promise<T> {
    const url = this.baseUrl + path;
    const res = await this.fetchImpl(url, {
      ...init,
      headers: {
        Authorization: `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json',
        Accept: 'application/json',
        ...(init?.headers ?? {}),
      },
    });

    if (!res.ok) {
      let payload: { error?: string; detail?: string } = {};
      try {
        payload = await res.json();
      } catch {
        // ignore
      }
      throw new InopayError(
        res.status,
        payload.error ?? `http_${res.status}`,
        payload.detail ?? res.statusText,
        payload.detail,
      );
    }

    return res.json() as Promise<T>;
  }

  /** Health check on the sandbox. */
  health(): Promise<{ sandbox: boolean; status: string; demo_key: string; rate_limit: string }> {
    return this.request('/health');
  }

  instruments = {
    /** List instruments traded on BRVM, BVMAC and GSE. */
    list: (): Promise<InstrumentList> => this.request('/instruments'),
  };

  sgis = {
    /** List partner SGIs available in the sandbox. */
    list: (): Promise<{ sandbox: boolean; sgis: SGI[] }> => this.request('/sgis'),
  };

  orders = {
    /** Place a simulated order against a sandbox SGI. */
    create: (input: CreateOrderInput): Promise<{ sandbox: boolean; order: Order; note: string }> =>
      this.request('/orders', { method: 'POST', body: JSON.stringify(input) }),
    /** Fetch a previously-created order by id. */
    get: (id: string): Promise<{ sandbox: boolean; order: Order }> =>
      this.request(`/orders/${encodeURIComponent(id)}`),
  };

  kyc = {
    /** Fetch a mock Ed25519-signed KYC attestation for a user id. */
    fetch: (
      userId: string,
    ): Promise<{ sandbox: boolean; attestation: KycAttestation; note: string }> =>
      this.request(`/kyc/${encodeURIComponent(userId)}`),
  };

  sandbox = {
    /** Reset the demo wallet and credit it with virtual funds. */
    reset: (): Promise<SandboxResetResult> => this.request('/sandbox/reset', { method: 'POST' }),
  };
}

/** Convenience factory. */
export function createInopayClient(options: InopayClientOptions): InopayClient {
  return new InopayClient(options);
}

export default InopayClient;
