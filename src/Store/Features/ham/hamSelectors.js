// Store/Features/ham/hamSelectors.js
import { createSelector } from '@reduxjs/toolkit';

const selectHam = (state) => state.ham;

// ---------------------------------------------------------------------------
// Header numbers — unfiltered, from getInventoryStatus()
// ---------------------------------------------------------------------------
export const selectInventorySummary = createSelector([selectHam], (ham) => ({
  // Records / models
  models: ham.inventory.totalHardware ?? 0,
  active: ham.inventory.activeHardware ?? 0,
  inactive: ham.inventory.inactiveHardware ?? 0,
  unpaid: ham.inventory.unpaidHardware ?? 0,

  // Physical units
  units: ham.inventorySummary.totalInventoryItems ?? 0,
  lowStock: ham.inventorySummary.lowStockItems ?? 0,
  outOfStock: ham.inventorySummary.outOfStock ?? 0,
  locations: ham.inventorySummary.totalLocations ?? 0,
  value: ham.inventorySummary.totalValue ?? 0,
}));

// ---------------------------------------------------------------------------
// Per-model assignment rollup — the SINGLE SOURCE OF TRUTH for "assigned"
// Map<MyDevices_id, { units, printers, systems, active, records }>
// ---------------------------------------------------------------------------
export const selectAssignmentByModel = createSelector([selectHam], (ham) => {
  const map = new Map();
  (ham.assignedDevices || []).forEach((row) => {
    const raw = row?.MyDevices_id;
    const modelId = typeof raw === 'object' ? raw?.MyDevices_id : raw;
    if (modelId == null) return;

    const prev = map.get(modelId) || {
      units: 0,
      printers: 0,
      systems: 0,
      active: 0,
      records: 0,
    };
    const printers = Number(row.PrintersCount) || 0;
    const systems = Number(row.SystemsCount) || 0;

    map.set(modelId, {
      units: prev.units + printers + systems,
      printers: prev.printers + printers,
      systems: prev.systems + systems,
      active: prev.active + (row.isAcitve ? 1 : 0),
      records: prev.records + 1,
    });
  });
  return map;
});

// The one number used by BOTH the predicate and the Assigned column
export const getAssignedUnits = (device, assignmentByModel) => {
  const id = device?.MyDevices_id ?? device?._id;
  return assignmentByModel.get(id)?.units ?? 0;
};

// ---------------------------------------------------------------------------
// The ONE filter used by rows AND footer. Signature: selectFilteredDevices(state, tab)
// ---------------------------------------------------------------------------
export const selectFilteredDevices = createSelector(
  [selectHam, selectAssignmentByModel, (_state, tab) => tab],
  (ham, assignmentByModel, tab) => {
    const devices = ham.devices || [];
    return devices.filter((d) => {
      const stock = Number(d.Total_Stocks) || 0;
      if (tab === 'assigned') {
        // Same number the Assigned column renders — cannot disagree
        return getAssignedUnits(d, assignmentByModel) > 0;
      }
      if (tab === 'out') return stock === 0;
      return true;
    });
  }
);

// ---------------------------------------------------------------------------
// Footer numbers — derived from the exact rows rendered
// ---------------------------------------------------------------------------
export const selectTabSummary = createSelector(
  [selectFilteredDevices, selectAssignmentByModel],
  (rows, assignmentByModel) => ({
    models: rows.length,
    units: rows.reduce((s, d) => s + (Number(d.Total_Stocks) || 0), 0),
    assigned: rows.reduce((s, d) => s + getAssignedUnits(d, assignmentByModel), 0),
  })
);