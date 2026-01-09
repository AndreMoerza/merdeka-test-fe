export function formatMoney(value: string | number) {
  const numberValue = typeof value === "string" ? parseFloat(value) : value;
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(numberValue);
}

export function formatThousandSeparator(value: string, onError?: (value: string) => void) {
  if (value === "") {
    return value;
  }

  const cleaned = value.replace(/[^0-9,]/g, "");
  let [integer, decimal] = cleaned.split(",");

  if (integer.length > 1 && integer.startsWith("0")) {
    integer = String(parseInt(integer, 10));
  }

  if (integer === "") {
    integer = "0";
  }

  const isValid = /^(\d+)?(,\d*)?$/.test(integer + (decimal !== undefined ? "," + decimal : ""));
  if (!isValid) {
    onError?.(value);
    return "";
  }

  const intFormatted = integer.replace(/\B(?=(\d{3})+(?!\d))/g, ".");

  return decimal !== undefined ? `${intFormatted},${decimal}` : intFormatted;
}

export function normalizeBackendValue(val: string | number): string {
  if (val === null || val === undefined || val === "") return "";

  const str = String(val);
  if (!str.includes(".")) return str;

  const [intPart, decPart] = str.split(".");

  if (!decPart || /^0+$/.test(decPart)) {
    return intPart;
  }

  return `${intPart},${decPart}`;
}
