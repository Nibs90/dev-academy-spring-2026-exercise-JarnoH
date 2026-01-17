const locale = "fi-FI";

// The following functions will format valuesaccording to the Finnish locale
export function formatNumber(value: unknown): string {
  if (value === null || value === undefined) {
    return "-";
  }

  const num = Number(value);

  if (isNaN(num)) {
    return "-";
  }

  return new Intl.NumberFormat(locale).format(num);
}

export function formatInt(value: unknown): string {
  if (value === null || value === undefined) {
    return "-";
  }

  const num = Number(value);

  if (isNaN(num)) {
    return "-";
  }

  return new Intl.NumberFormat(locale, {
    maximumFractionDigits: 0,
  }).format(num);
}

export function formatDecimal(value: unknown): string {
  if (value === null || value === undefined) {
    return "-";
  }

  const num = Number(value);

  if (isNaN(num)) {
    return "-";
  }

  // Format with two decimal places
  return new Intl.NumberFormat(locale, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(num);
}

// Formats consumption in MWh from kWh value
export function formatConsumptionMWh(valueKwh: unknown): string {
  if (valueKwh === null || valueKwh === undefined) {
    return "-";
  }

  const num = Number(valueKwh);

  if (isNaN(num)) {
    return "-";
  }

  const mwh = num / 1000;

  return new Intl.NumberFormat(locale, {
    maximumFractionDigits: 0,
  }).format(mwh);
}

// Formats production in MWh from kWh value
export function formatProductionMWh(valueKwh: unknown): string {
  if (valueKwh === null || valueKwh === undefined) {
    return "-";
  }

  const num = Number(valueKwh);

  if (isNaN(num)) {
    return "-";
  }

  return new Intl.NumberFormat(locale, {
    maximumFractionDigits: 0,
  }).format(num);
}

// Formats price in Euros with two decimal places
export function formatPrice(value: unknown): string {
  if (value === null || value === undefined) {
    return "-";
  }

  const num = Number(value);

  if (isNaN(num)) {
    return "-";
  }

  return new Intl.NumberFormat(locale, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(num);
}
