export type EventType = "BUSINESS_TOUR" | "TRADE_FAIR";

export function parseEventType(value: unknown): EventType | undefined {
  if (value === "TRADE_FAIR" || value === "BUSINESS_TOUR") return value;
  return undefined;
}

export function normalizeEventType(
  value: unknown,
  fallback: EventType = "BUSINESS_TOUR"
): EventType {
  return parseEventType(value) ?? fallback;
}

export function eventTypeLabel(value: unknown): string {
  return parseEventType(value) === "TRADE_FAIR" ? "Trade Fair" : "Tour";
}
