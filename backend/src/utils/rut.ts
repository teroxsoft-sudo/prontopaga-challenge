export function normalizeRut(rut: string): string {
  return rut
    .replace(/\./g, "")
    .replace(/\s/g, "")
    .toUpperCase();
}

export function formatRut(rut: string): string {
  const normalized = normalizeRut(rut);

  const [body, dv] = normalized.split("-");

  if (!body || !dv) {
    return normalized;
  }

  const formattedBody = body.replace(/\B(?=(\d{3})+(?!\d))/g, ".");

  return `${formattedBody}-${dv}`;
}

export function isValidRut(rut: string): boolean {
  const normalized = normalizeRut(rut);

  if (!/^\d{7,8}-[\dK]$/.test(normalized)) {
    return false;
  }

  const [body, providedDv] = normalized.split("-");

  if (!body || !providedDv) {
    return false;
  }

  let sum = 0;
  let multiplier = 2;

  for (let i = body.length - 1; i >= 0; i--) {
    sum += Number(body[i]) * multiplier;

    multiplier++;

    if (multiplier === 8) {
      multiplier = 2;
    }
  }

  const result = 11 - (sum % 11);

  let expectedDv: string;

  if (result === 11) {
    expectedDv = "0";
  } else if (result === 10) {
    expectedDv = "K";
  } else {
    expectedDv = result.toString();
  }

  return providedDv === expectedDv;
}