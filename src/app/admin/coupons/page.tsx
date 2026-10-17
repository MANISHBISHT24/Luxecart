import { Plus } from "lucide-react";
import { formatMoney } from "@/lib/utils";

export const metadata = {
  title: "Promotional Codes | LuxeCart Admin",
};

export const instant = false;

interface CouponItem {
  code: string;
  description: string;
  discountType: "PERCENTAGE" | "FIXED_AMOUNT";
  valueText: string;
  minSpendPaise: number;
  isActive: boolean;
  usageCount: number;
}

const CAMPAIGNS: CouponItem[] = [
  {
    code: "WELCOME10",
    description: "10% off your initial luxury acquisition",
    discountType: "PERCENTAGE",
    valueText: "10% off",
    minSpendPaise: 0,
    isActive: true,
    usageCount: 142,
  },
  {
    code: "LUXE15",
    description: "15% off curated orders over ₹10,000",
    discountType: "PERCENTAGE",
    valueText: "15% off",
    minSpendPaise: 1_000_000,
    isActive: true,
    usageCount: 88,
  },
  {
    code: "ARCHIVE20",
    description: "20% VIP collector discount over ₹25,000",
    discountType: "PERCENTAGE",
    valueText: "20% off",
    minSpendPaise: 2_500_000,
    isActive: true,
    usageCount: 37,
  },
  {
    code: "FLAT500",
    description: "Flat ₹500 off orders over ₹3,000",
    discountType: "FIXED_AMOUNT",
    valueText: "₹500 flat",
    minSpendPaise: 300_000,
    isActive: true,
    usageCount: 64,
  },
];

export default function AdminCouponsPage() {
  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="eyebrow">Marketing & Concessions</p>
          <h1 className="text-3xl sm:text-4xl font-display text-charcoal mt-1">Promotional Codes</h1>
          <p className="text-sm text-ink-soft mt-0.5">
            Server-verified discount codes and minimum acquisition requirements.
          </p>
        </div>

        <button
          type="button"
          className="flex items-center gap-2 bg-charcoal text-ivory text-xs uppercase tracking-wider px-4 py-2.5 hover:bg-charcoal/90 transition-colors"
        >
          <Plus className="h-4 w-4" />
          <span>Issue New Promo Code</span>
        </button>
      </div>

      <div className="bg-white border hairline p-6 sm:p-8 space-y-6">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="text-xs uppercase tracking-wider text-ink-soft border-b hairline">
                <th className="pb-3 font-medium">Code</th>
                <th className="pb-3 font-medium">Description</th>
                <th className="pb-3 font-medium">Concession Value</th>
                <th className="pb-3 font-medium text-right">Min Acquisition</th>
                <th className="pb-3 font-medium text-center">Redemptions</th>
                <th className="pb-3 font-medium text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {CAMPAIGNS.map((c) => (
                <tr key={c.code} className="hover:bg-beige/20 transition-colors">
                  <td className="py-4 font-mono font-medium text-xs text-charcoal">
                    <span className="bg-beige/60 px-2.5 py-1 border hairline">{c.code}</span>
                  </td>
                  <td className="py-4 text-xs text-charcoal">{c.description}</td>
                  <td className="py-4 text-xs font-medium text-charcoal">{c.valueText}</td>
                  <td className="py-4 text-right font-mono text-xs text-ink-soft">
                    {c.minSpendPaise === 0 ? "None" : formatMoney(c.minSpendPaise)}
                  </td>
                  <td className="py-4 text-center font-mono text-xs text-charcoal">{c.usageCount}</td>
                  <td className="py-4 text-center">
                    <span className="text-[0.65rem] uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200">
                      Active
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
