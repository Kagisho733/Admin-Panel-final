import type { Product } from "../../types/Product";

function missingCourierFields(product: Product): string[] {
  return [...(["weight", "length", "width", "height"] as const).filter(key => !Number.isFinite(product[key]) || (product[key] ?? 0) <= 0), ...(!product.packaging?.trim() ? ["packaging"] : [])];
}

export default function CourierReadiness({product}: {product: Product}) {
  const missing = missingCourierFields(product);
  return <p className={`my-2 text-xs font-semibold ${missing.length ? "text-amber-700" : "text-emerald-700"}`} title={missing.join(", ")}>{missing.length ? `Not courier-ready: add ${missing.join(", ")}` : "Courier-ready"}</p>;
}
