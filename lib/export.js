import { format } from "date-fns";
import { formatCurrency, formatSignedCurrency } from "./currency";

/**
 * Export transactions as a CSV file download.
 * @param {Array} transactions - Array of transaction objects
 * @param {string} accountName - Account name for the filename
 */
export function exportToCSV(transactions, accountName = "transactions") {
  if (!transactions || transactions.length === 0) return;

  const headers = ["Date", "Description", "Category", "Type", "Amount"];

  const rows = transactions.map((t) => [
    format(new Date(t.date), "yyyy-MM-dd"),
    `"${(t.description || "").replace(/"/g, '""')}"`, // Escape quotes
    t.category,
    t.type,
    t.type === "EXPENSE" ? -Math.abs(t.amount) : Math.abs(t.amount),
  ]);

  // Calculate totals
  const totalIncome = transactions
    .filter((t) => t.type === "INCOME")
    .reduce((sum, t) => sum + Math.abs(t.amount), 0);
  const totalExpense = transactions
    .filter((t) => t.type === "EXPENSE")
    .reduce((sum, t) => sum + Math.abs(t.amount), 0);

  const csvContent = [
    `Account: ${accountName}`,
    `Exported: ${format(new Date(), "PPpp")}`,
    `Total Income: ${formatCurrency(totalIncome)}`,
    `Total Expenses: ${formatCurrency(totalExpense)}`,
    `Net: ${formatCurrency(totalIncome - totalExpense)}`,
    "",
    headers.join(","),
    ...rows.map((row) => row.join(",")),
  ].join("\n");

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `${accountName.toLowerCase().replace(/\s+/g, "_")}_transactions_${format(new Date(), "yyyy-MM-dd")}.csv`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Open a print-friendly view of transactions for saving as PDF.
 * @param {Array} transactions - Array of transaction objects
 * @param {string} accountName - Account name for the title
 */
export function exportToPDF(transactions, accountName = "Transactions") {
  if (!transactions || transactions.length === 0) return;

  // Calculate totals
  const totalIncome = transactions
    .filter((t) => t.type === "INCOME")
    .reduce((sum, t) => sum + Math.abs(t.amount), 0);
  const totalExpense = transactions
    .filter((t) => t.type === "EXPENSE")
    .reduce((sum, t) => sum + Math.abs(t.amount), 0);
  const net = totalIncome - totalExpense;

  const rows = transactions
    .map(
      (t) => `
      <tr>
        <td style="padding:8px 12px;border-bottom:1px solid #e5e7eb;">${format(new Date(t.date), "PP")}</td>
        <td style="padding:8px 12px;border-bottom:1px solid #e5e7eb;">${t.description || "-"}</td>
        <td style="padding:8px 12px;border-bottom:1px solid #e5e7eb;text-transform:capitalize;">${t.category}</td>
        <td style="padding:8px 12px;border-bottom:1px solid #e5e7eb;">${t.type}</td>
        <td style="padding:8px 12px;border-bottom:1px solid #e5e7eb;text-align:right;color:${t.type === "EXPENSE" ? "#ef4444" : "#22c55e"};font-weight:500;">
          ${formatSignedCurrency(t.amount, t.type)}
        </td>
      </tr>`
    )
    .join("");

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>${accountName} - Transaction Report</title>
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; color: #1f2937; padding: 40px; }
        .header { margin-bottom: 32px; }
        .header h1 { font-size: 24px; font-weight: 700; margin-bottom: 4px; }
        .header p { color: #6b7280; font-size: 14px; }
        .summary { display: flex; gap: 24px; margin-bottom: 32px; }
        .summary-card { flex: 1; padding: 16px; border-radius: 8px; border: 1px solid #e5e7eb; }
        .summary-card .label { font-size: 12px; color: #6b7280; text-transform: uppercase; letter-spacing: 0.05em; }
        .summary-card .value { font-size: 20px; font-weight: 700; margin-top: 4px; }
        .income { color: #22c55e; }
        .expense { color: #ef4444; }
        table { width: 100%; border-collapse: collapse; font-size: 14px; }
        th { padding: 10px 12px; text-align: left; border-bottom: 2px solid #1f2937; font-weight: 600; font-size: 12px; text-transform: uppercase; letter-spacing: 0.05em; }
        th:last-child { text-align: right; }
        @media print { body { padding: 20px; } }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>${accountName} - Transaction Report</h1>
        <p>Generated on ${format(new Date(), "PPpp")} &bull; ${transactions.length} transactions</p>
      </div>
      <div class="summary">
        <div class="summary-card">
          <div class="label">Total Income</div>
          <div class="value income">${formatCurrency(totalIncome)}</div>
        </div>
        <div class="summary-card">
          <div class="label">Total Expenses</div>
          <div class="value expense">${formatCurrency(totalExpense)}</div>
        </div>
        <div class="summary-card">
          <div class="label">Net</div>
          <div class="value" style="color:${net >= 0 ? "#22c55e" : "#ef4444"}">${formatCurrency(net)}</div>
        </div>
      </div>
      <table>
        <thead>
          <tr>
            <th>Date</th>
            <th>Description</th>
            <th>Category</th>
            <th>Type</th>
            <th style="text-align:right">Amount</th>
          </tr>
        </thead>
        <tbody>${rows}</tbody>
      </table>
    </body>
    </html>
  `;

  const printWindow = window.open("", "_blank");
  printWindow.document.write(html);
  printWindow.document.close();
  printWindow.onload = () => {
    printWindow.print();
  };
}
