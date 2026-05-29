"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { formatCurrency } from "@/lib/utils";

export function MortgageCalculator({ defaultPrice = 350000 }: { defaultPrice?: number }) {
  const [price, setPrice] = useState(defaultPrice);
  const [down, setDown] = useState(20);
  const [rate, setRate] = useState(6.85);
  const [years, setYears] = useState(30);

  const loan = price * (1 - down / 100);
  const monthlyRate = rate / 100 / 12;
  const payments = years * 12;
  const monthly =
    monthlyRate === 0
      ? loan / payments
      : (loan * monthlyRate * Math.pow(1 + monthlyRate, payments)) /
        (Math.pow(1 + monthlyRate, payments) - 1);

  const schedule = Array.from({ length: 5 }, (_, i) => {
    const month = i + 1;
    const interest = loan * monthlyRate * (1 - i * 0.002);
    const principal = monthly - interest;
    return { month, principal, interest, balance: loan - principal * month };
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Mortgage calculator</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="text-xs text-slate-500">Purchase price</label>
            <Input
              type="number"
              value={price}
              onChange={(e) => setPrice(Number(e.target.value))}
            />
          </div>
          <div>
            <label className="text-xs text-slate-500">Down payment %</label>
            <Input
              type="number"
              value={down}
              onChange={(e) => setDown(Number(e.target.value))}
            />
          </div>
          <div>
            <label className="text-xs text-slate-500">Interest rate %</label>
            <Input
              type="number"
              step="0.1"
              value={rate}
              onChange={(e) => setRate(Number(e.target.value))}
            />
          </div>
          <div>
            <label className="text-xs text-slate-500">Term (years)</label>
            <Input
              type="number"
              value={years}
              onChange={(e) => setYears(Number(e.target.value))}
            />
          </div>
        </div>
        <div className="rounded-xl bg-violet-50 p-4 text-center">
          <p className="text-sm text-slate-500">Estimated monthly payment</p>
          <p className="text-2xl font-bold text-violet-700">
            {formatCurrency(monthly)}
          </p>
        </div>
        <p className="text-xs font-medium text-slate-500">Amortization preview (first 5 months)</p>
        <div className="overflow-x-auto text-xs">
          <table className="w-full">
            <thead>
              <tr className="text-left text-slate-500">
                <th className="py-1">Month</th>
                <th>Principal</th>
                <th>Interest</th>
              </tr>
            </thead>
            <tbody>
              {schedule.map((row) => (
                <tr key={row.month} className="border-t border-slate-100">
                  <td className="py-1">{row.month}</td>
                  <td>{formatCurrency(row.principal)}</td>
                  <td>{formatCurrency(row.interest)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
