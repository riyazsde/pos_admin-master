const toCount = (value) => {
  if (value === null || value === undefined || value === '') return 0;
  const count = Number(value);
  return Number.isFinite(count) ? count : 0;
};

export const getDashboardChartData = (items, periodKey) => {
  if (!Array.isArray(items)) return [];

  return items.map((item) => ({
    period: item?.[periodKey] ?? '',
    newClients: toCount(item?.newClients),
    renewals: toCount(item?.existingClientsRenewal),
  }));
};

export const getDashboardTooltipEntries = (row) => [
  { dataKey: 'newClients', value: toCount(row?.newClients) },
  { dataKey: 'renewals', value: toCount(row?.renewals) },
];

export const getDashboardChartMax = (chartData) =>
  Math.max(
    0,
    ...chartData.flatMap((row) => [row.newClients, row.renewals])
  );
