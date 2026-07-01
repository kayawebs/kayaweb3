"use client";

import { useMemo, useState } from "react";

import type { ToolLocale } from "@/lib/tool-i18n";

type RepaymentMethod = "equal-payment" | "equal-principal";

type ScheduleRow = {
  period: number;
  payment: number;
  principal: number;
  interest: number;
  balance: number;
};

const TEXT = {
  en: {
    command: "loan --installments --interest",
    loan: "Loan amount",
    rate: "Annual interest rate %",
    periods: "Installments",
    method: "Repayment method",
    equalPayment: "Equal principal + interest",
    equalPrincipal: "Equal principal",
    fixedPayment: "Monthly payment",
    firstPayment: "First payment",
    lastPayment: "Last payment",
    totalPaid: "Total repayment",
    totalInterest: "Total interest",
    schedule: "Payment schedule preview",
    period: "Period",
    payment: "Payment",
    principal: "Principal",
    interest: "Interest",
    balance: "Balance",
    note: "Preview shows the first 12 installments. Fees, taxes, and penalties are not included.",
    invalid: "Enter valid numbers. Loan and installments must be above 0, rate cannot be negative, and installments must be 600 or fewer.",
  },
  zh: {
    command: "loan --installments --interest",
    loan: "贷款金额",
    rate: "年利率 %",
    periods: "还款期数",
    method: "还款方式",
    equalPayment: "等额本息",
    equalPrincipal: "等额本金",
    fixedPayment: "每期还款",
    firstPayment: "首期还款",
    lastPayment: "末期还款",
    totalPaid: "总还款额",
    totalInterest: "总利息",
    schedule: "还款计划预览",
    period: "期数",
    payment: "还款额",
    principal: "本金",
    interest: "利息",
    balance: "剩余本金",
    note: "预览仅展示前 12 期，不包含手续费、税费、罚息或提前还款变化。",
    invalid: "请输入合法数字。贷款金额和期数必须大于 0，利率不能为负，期数不能超过 600。",
  },
} as const;

function formatMoney(value: number) {
  return value.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

function equalPaymentAmount(loan: number, annualRate: number, periods: number) {
  const monthlyRate = annualRate / 12 / 100;
  if (monthlyRate === 0) return loan / periods;
  return (loan * monthlyRate) / (1 - Math.pow(1 + monthlyRate, -periods));
}

function buildSchedule(loan: number, annualRate: number, periods: number, method: RepaymentMethod) {
  const monthlyRate = annualRate / 12 / 100;
  const rows: ScheduleRow[] = [];
  let balance = loan;
  const fixedPayment = equalPaymentAmount(loan, annualRate, periods);
  const fixedPrincipal = loan / periods;

  for (let period = 1; period <= periods; period += 1) {
    const interest = balance * monthlyRate;
    const principal =
      method === "equal-payment"
        ? Math.min(balance, fixedPayment - interest)
        : Math.min(balance, fixedPrincipal);
    const payment = principal + interest;
    balance = Math.max(0, balance - principal);

    rows.push({
      period,
      payment,
      principal,
      interest,
      balance,
    });
  }

  const totalPaid = rows.reduce((sum, row) => sum + row.payment, 0);
  const totalInterest = rows.reduce((sum, row) => sum + row.interest, 0);

  return {
    rows,
    firstPayment: rows[0]?.payment ?? 0,
    lastPayment: rows[rows.length - 1]?.payment ?? 0,
    fixedPayment: method === "equal-payment" ? fixedPayment : null,
    totalPaid,
    totalInterest,
  };
}

export default function LoanPaymentCalculatorTool({ locale = "en" }: { locale?: ToolLocale }) {
  const text = TEXT[locale];
  const [loan, setLoan] = useState("250000");
  const [rate, setRate] = useState("6.5");
  const [periods, setPeriods] = useState("60");
  const [method, setMethod] = useState<RepaymentMethod>("equal-payment");

  const result = useMemo(() => {
    const loanValue = Number(loan || 0);
    const rateValue = Number(rate || 0);
    const periodValue = Number(periods || 0);
    const wholePeriods = Math.round(periodValue);

    if (
      ![loanValue, rateValue, periodValue].every(Number.isFinite) ||
      loanValue <= 0 ||
      rateValue < 0 ||
      periodValue <= 0 ||
      wholePeriods > 600
    ) {
      return { error: text.invalid };
    }

    return buildSchedule(loanValue, rateValue, wholePeriods, method);
  }, [loan, rate, periods, method, text.invalid]);

  return (
    <section className="terminal-panel space-y-6">
      <div className="flex items-center justify-between gap-4 text-xs font-mono text-[var(--terminal-muted)]">
        <span className="terminal-accent">~/tools/loan-payment-calculator</span>
        <span>{text.command}</span>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <label className="space-y-2 rounded-lg border border-[var(--terminal-border)] bg-[var(--terminal-panel-bg)]/40 p-4 text-sm">
          <span className="block font-medium">{text.loan}</span>
          <input
            value={loan}
            onChange={(event) => setLoan(event.target.value)}
            inputMode="decimal"
            className="w-full rounded border border-[var(--terminal-border)] bg-transparent px-3 py-2 outline-none focus:border-[var(--terminal-accent)]"
          />
        </label>
        <label className="space-y-2 rounded-lg border border-[var(--terminal-border)] bg-[var(--terminal-panel-bg)]/40 p-4 text-sm">
          <span className="block font-medium">{text.rate}</span>
          <input
            value={rate}
            onChange={(event) => setRate(event.target.value)}
            inputMode="decimal"
            className="w-full rounded border border-[var(--terminal-border)] bg-transparent px-3 py-2 outline-none focus:border-[var(--terminal-accent)]"
          />
        </label>
        <label className="space-y-2 rounded-lg border border-[var(--terminal-border)] bg-[var(--terminal-panel-bg)]/40 p-4 text-sm">
          <span className="block font-medium">{text.periods}</span>
          <input
            value={periods}
            onChange={(event) => setPeriods(event.target.value)}
            inputMode="numeric"
            className="w-full rounded border border-[var(--terminal-border)] bg-transparent px-3 py-2 outline-none focus:border-[var(--terminal-accent)]"
          />
        </label>
        <label className="space-y-2 rounded-lg border border-[var(--terminal-border)] bg-[var(--terminal-panel-bg)]/40 p-4 text-sm">
          <span className="block font-medium">{text.method}</span>
          <select
            value={method}
            onChange={(event) => setMethod(event.target.value as RepaymentMethod)}
            className="w-full rounded border border-[var(--terminal-border)] bg-[var(--terminal-panel-bg)] px-3 py-2 outline-none focus:border-[var(--terminal-accent)]"
          >
            <option value="equal-payment">{text.equalPayment}</option>
            <option value="equal-principal">{text.equalPrincipal}</option>
          </select>
        </label>
      </div>

      {"error" in result ? (
        <p className="rounded border border-amber-500/40 bg-amber-500/10 px-3 py-2 text-sm text-amber-200">{result.error}</p>
      ) : (
        <>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
            <div className="rounded border border-[var(--terminal-border)] p-3">
              <div className="text-xs font-mono text-[var(--terminal-muted)]">{method === "equal-payment" ? text.fixedPayment : text.firstPayment}</div>
              <div className="mt-1 font-mono text-sm">{formatMoney(method === "equal-payment" ? result.fixedPayment ?? 0 : result.firstPayment)}</div>
            </div>
            <div className="rounded border border-[var(--terminal-border)] p-3">
              <div className="text-xs font-mono text-[var(--terminal-muted)]">{text.lastPayment}</div>
              <div className="mt-1 font-mono text-sm">{formatMoney(result.lastPayment)}</div>
            </div>
            <div className="rounded border border-[var(--terminal-border)] p-3">
              <div className="text-xs font-mono text-[var(--terminal-muted)]">{text.totalPaid}</div>
              <div className="mt-1 font-mono text-sm">{formatMoney(result.totalPaid)}</div>
            </div>
            <div className="rounded border border-[var(--terminal-border)] p-3 lg:col-span-2">
              <div className="text-xs font-mono text-[var(--terminal-muted)]">{text.totalInterest}</div>
              <div className="mt-1 font-mono text-sm text-[var(--terminal-accent)]">{formatMoney(result.totalInterest)}</div>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between gap-4">
              <h2 className="text-sm font-semibold">{text.schedule}</h2>
              <p className="text-xs text-[var(--terminal-muted)]">{text.note}</p>
            </div>
            <div className="overflow-x-auto rounded-lg border border-[var(--terminal-border)]">
              <table className="w-full min-w-[640px] border-collapse text-left text-xs">
                <thead className="bg-[var(--terminal-panel-bg)]/60 text-[var(--terminal-muted)]">
                  <tr>
                    <th className="px-3 py-2 font-mono">{text.period}</th>
                    <th className="px-3 py-2 font-mono">{text.payment}</th>
                    <th className="px-3 py-2 font-mono">{text.principal}</th>
                    <th className="px-3 py-2 font-mono">{text.interest}</th>
                    <th className="px-3 py-2 font-mono">{text.balance}</th>
                  </tr>
                </thead>
                <tbody>
                  {result.rows.slice(0, 12).map((row) => (
                    <tr key={row.period} className="border-t border-[var(--terminal-border)]">
                      <td className="px-3 py-2 font-mono">{row.period}</td>
                      <td className="px-3 py-2 font-mono">{formatMoney(row.payment)}</td>
                      <td className="px-3 py-2 font-mono">{formatMoney(row.principal)}</td>
                      <td className="px-3 py-2 font-mono">{formatMoney(row.interest)}</td>
                      <td className="px-3 py-2 font-mono">{formatMoney(row.balance)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </section>
  );
}
