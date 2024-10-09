import { useState } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import * as Accordion from "@radix-ui/react-accordion";
import * as Label from "@radix-ui/react-label";

// Updated Tax slabs for Pakistan (2024-2025)
const TAX_SLABS = [
  { min: 0, max: 600000, rate: 0, additional: 0 },
  { min: 600001, max: 1200000, rate: 0.05, additional: 0 },
  { min: 1200001, max: 2200000, rate: 0.15, additional: 30000 },
  { min: 2200001, max: 3200000, rate: 0.25, additional: 180000 },
  { min: 3200001, max: 4100000, rate: 0.3, additional: 430000 },
  { min: 4100001, max: Infinity, rate: 0.35, additional: 700000 },
];

type TaxInfo = {
  monthlySalary: number;
  annualSalary: number;
  monthlyTax: number;
  annualTax: number;
  monthlyNetSalary: number;
  annualNetSalary: number;
};

export default function TaxCalculator() {
  const [monthlySalary, setMonthlySalary] = useState<string>("");
  const [taxInfo, setTaxInfo] = useState<TaxInfo | null>(null);

  const calculateTax = () => {
    const annualSalary = parseFloat(monthlySalary) * 12;
    let totalTax = 0;

    for (let i = 0; i < TAX_SLABS.length; i++) {
      const slab = TAX_SLABS[i];
      if (annualSalary > slab.min) {
        const taxableAmount = Math.min(annualSalary, slab.max) - slab.min;
        totalTax = slab.additional + taxableAmount * slab.rate;
        if (annualSalary <= slab.max) break;
      }
    }

    const monthlyTax = totalTax / 12;
    const annualNetSalary = annualSalary - totalTax;
    const monthlyNetSalary = annualNetSalary / 12;

    setTaxInfo({
      monthlySalary: parseFloat(monthlySalary),
      annualSalary,
      monthlyTax,
      annualTax: totalTax,
      monthlyNetSalary,
      annualNetSalary,
    });
  };

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat("en-PK", {
      style: "currency",
      currency: "PKR",
    }).format(amount);
  };

  const pieChartData = taxInfo
    ? [
        { name: "Net Salary", value: taxInfo.annualNetSalary },
        { name: "Tax", value: taxInfo.annualTax },
      ]
    : [];

  return (
    <div className="w-full max-w-3xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold text-center mb-6">
        Pakistan Income Tax Calculator 2024-2025
      </h1>
      <div className="space-y-4">
        <div>
          <Label.Root
            htmlFor="monthlySalary"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Monthly Salary (PKR)
          </Label.Root>
          <input
            id="monthlySalary"
            type="number"
            value={monthlySalary}
            onChange={(e) => setMonthlySalary(e.target.value)}
            placeholder="Enter your monthly salary"
            className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md text-sm shadow-sm placeholder-gray-400
                       focus:outline-none focus:border-black focus:ring-1 focus:ring-black"
          />
        </div>
        <button
          onClick={calculateTax}
          className="w-full bg-black hover:bg-black text-white font-bold py-2 px-4 rounded"
        >
          Calculate Tax
        </button>

        {taxInfo && (
          <div className="mt-8 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-gray-100 p-4 rounded-lg">
                <h2 className="text-lg font-semibold mb-2">
                  Monthly Breakdown
                </h2>
                <p>Gross Salary: {formatCurrency(taxInfo.monthlySalary)}</p>
                <p>Tax: {formatCurrency(taxInfo.monthlyTax)}</p>
                <p>Net Salary: {formatCurrency(taxInfo.monthlyNetSalary)}</p>
              </div>
              <div className="bg-gray-100 p-4 rounded-lg">
                <h2 className="text-lg font-semibold mb-2">Yearly Breakdown</h2>
                <p>Gross Salary: {formatCurrency(taxInfo.annualSalary)}</p>
                <p>Tax: {formatCurrency(taxInfo.annualTax)}</p>
                <p>Net Salary: {formatCurrency(taxInfo.annualNetSalary)}</p>
              </div>
            </div>

            <div className="bg-gray-100 p-4 rounded-lg">
              <h2 className="text-lg font-semibold mb-2">Tax Breakdown</h2>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieChartData}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) =>
                        `${name} ${(percent * 100).toFixed(0)}%`
                      }
                    >
                      <Cell key="cell-0" fill="#4CAF50" />
                      <Cell key="cell-1" fill="#F44336" />
                    </Pie>
                    <Tooltip
                      formatter={(value) => formatCurrency(value as number)}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}

        <div className="bg-gray-100 p-4 rounded-lg">
          <h2 className="text-lg font-semibold mb-2">FAQs</h2>
          <Accordion.Root type="single" collapsible>
            <Accordion.Item value="item-1">
              <Accordion.Trigger className="w-full text-left py-2 px-4 outline-none bg-gray-200 hover:bg-gray-300 ring-1 hover:ring-black rounded-t-md">
                How is the tax calculated?
              </Accordion.Trigger>
              <Accordion.Content className="p-4 bg-white rounded-b-md">
                <p>
                  The tax is calculated based on the following slabs for the
                  fiscal year 2024-25:
                </p>
                <ul className="list-disc pl-5 space-y-2 mt-2">
                  <li>Up to Rs. 600,000: 0%</li>
                  <li>
                    Rs. 600,001 - Rs. 1,200,000: 5% of the amount exceeding Rs.
                    600,000
                  </li>
                  <li>
                    Rs. 1,200,001 - Rs. 2,200,000: Rs. 30,000 + 15% of the
                    amount exceeding Rs. 1,200,000
                  </li>
                  <li>
                    Rs. 2,200,001 - Rs. 3,200,000: Rs. 180,000 + 25% of the
                    amount exceeding Rs. 2,200,000
                  </li>
                  <li>
                    Rs. 3,200,001 - Rs. 4,100,000: Rs. 430,000 + 30% of the
                    amount exceeding Rs. 3,200,000
                  </li>
                  <li>
                    Above Rs. 4,100,000: Rs. 700,000 + 35% of the amount
                    exceeding Rs. 4,100,000
                  </li>
                </ul>
              </Accordion.Content>
            </Accordion.Item>
            <Accordion.Item value="item-2">
              <Accordion.Trigger className="w-full text-left py-2 px-4 outline-none bg-gray-200 hover:bg-gray-300 ring-1 hover:ring-black rounded-t-md">
                Is this calculation final?
              </Accordion.Trigger>
              <Accordion.Content className="p-4 bg-white rounded-b-md">
                <p>
                  This calculation is based on the proposed tax slabs for the
                  fiscal year 2024-25. The actual tax liability may vary based
                  on individual circumstances, deductions, and any changes in
                  tax laws. It's always recommended to consult with a tax
                  professional for personalized advice.
                </p>
              </Accordion.Content>
            </Accordion.Item>
          </Accordion.Root>
        </div>
      </div>
    </div>
  );
}
