export function formatCurrency(value: number): string {
  if (isNaN(value)) return "0 ₫";
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  }).format(value);
}
