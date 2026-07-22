export function exportFeedbackCSV(data) {
  if (!data.length) return;

  const headers = [
    "Customer",
    "Feedback",
    "Category",
    "Sentiment",
    "Status",
  ];

  const rows = data.map((item) => [
    item.customer,
    item.feedback,
    item.category,
    item.sentiment,
    item.status,
  ]);

  const csv = [
    headers.join(","),
    ...rows.map((row) =>
      row.map((value) => `"${String(value).replace(/"/g, '""')}"`).join(",")
    ),
  ].join("\n");

  const blob = new Blob([csv], {
    type: "text/csv;charset=utf-8;",
  });

  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");

  link.href = url;
  link.download = "feedback.csv";

  document.body.appendChild(link);

  link.click();

  document.body.removeChild(link);

  URL.revokeObjectURL(url);
}