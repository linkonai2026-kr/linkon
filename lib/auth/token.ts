import { createHmac, timingSafeEqual } from "crypto";

const SECRET = process.env.LINKON_WEBHOOK_SECRET!;

/**
 * payload와 timestamp를 합쳐 HMAC-SHA256 서명 생성
 * replay attack 방지를 위해 timestamp 포함
 */
export function signPayload(payload: string, timestamp: number): string {
  const message = `${timestamp}.${payload}`;
  return createHmac("sha256", SECRET).update(message).digest("hex");
}

/**
 * 서명 검증 (timing-safe 비교 + 5분 만료)
 */
export function verifyPayload(
  payload: string,
  timestamp: number,
  signature: string,
  maxAgeMs = 5 * 60 * 1000
): boolean {
  // 만료 확인
  if (Date.now() - timestamp > maxAgeMs) {
    return false;
  }

  const expected = signPayload(payload, timestamp);

  try {
    return timingSafeEqual(
      Buffer.from(expected, "hex"),
      Buffer.from(signature, "hex")
    );
  } catch {
    return false;
  }
}

/**
 * 서비스 webhook 헤더용 Authorization 값 생성
 * 형식: "ts=<timestamp>,sig=<hmac>"
 */
export function buildWebhookAuth(body: string): string {
  const ts = Date.now();
  const sig = signPayload(body, ts);
  return `ts=${ts},sig=${sig}`;
}

/**
 * webhook Authorization 헤더 파싱 및 검증
 */
export function verifyWebhookAuth(
  body: string,
  authHeader: string | null
): boolean {
  if (!authHeader) return false;

  const tsMatch = authHeader.match(/ts=(\d+)/);
  const sigMatch = authHeader.match(/sig=([0-9a-f]+)/);

  if (!tsMatch || !sigMatch) return false;

  const ts = parseInt(tsMatch[1], 10);
  const sig = sigMatch[1];

  return verifyPayload(body, ts, sig);
}
