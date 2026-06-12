export const formatNumber = (value) =>
  new Intl.NumberFormat("en-US", {
    maximumFractionDigits: 0
  }).format(value || 0);

export const formatCurrency = (value) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0
  }).format(value || 0);

export const formatDecimalCurrency = (value) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2
  }).format(value || 0);

export const formatPercent = (value) =>
  `${new Intl.NumberFormat("en-US", {
    maximumFractionDigits: 2
  }).format(value || 0)}%`;

export const formatDate = (value) => {
  if (!value) {
    return "No date";
  }
  const date = new Date(value);
  if (isNaN(date.getTime())) {
    return "Invalid date";
  }
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric"
  }).format(date);
};

export const scoreTone = (score) => {
  if (score >= 75) return "text-signal";
  if (score >= 55) return "text-amber";
  return "text-rose";
};

export const severityTone = (severity) => {
  if (severity === "high") return "bg-rose/10 text-rose border-rose/20";
  if (severity === "medium") return "bg-amber/10 text-amber border-amber/25";
  return "bg-signal/10 text-signal border-signal/20";
};

