import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import {
  selectAssignmentByModel,
  selectFilteredDevices,
  selectTabSummary,
} from './hamSelectors.js';

const state = {
  ham: {
    devices: [
      { MyDevices_id: 13, Total_Stocks: 0 },
      { MyDevices_id: 12, Total_Stocks: 0 },
      { MyDevices_id: 10, Total_Stocks: 0 },
      { MyDevices_id: 9, Total_Stocks: 0 },
      { MyDevices_id: 8, Total_Stocks: 2 },
      { MyDevices_id: 7, Total_Stocks: 12 },
      { MyDevices_id: 6, Total_Stocks: 25 },
      { MyDevices_id: 5, Total_Stocks: 25 },
      { MyDevices_id: 4, Total_Stocks: 0 },
      { MyDevices_id: 3, Total_Stocks: 0 },
      { MyDevices_id: 2, Total_Stocks: 25 },
      { MyDevices_id: 1, Total_Stocks: 10 },
    ],
    assignedDevices: [
      { MyDevices_id: { MyDevices_id: 5 }, PrintersCount: 1, SystemsCount: 1 },
      { MyDevices_id: { MyDevices_id: 6 }, PrintersCount: 2, SystemsCount: 0 },
      { MyDevices_id: { MyDevices_id: 5 }, PrintersCount: 1, SystemsCount: 2 },
      { MyDevices_id: { MyDevices_id: 5 }, PrintersCount: 0, SystemsCount: 2 },
      { MyDevices_id: { MyDevices_id: 5 }, PrintersCount: 1, SystemsCount: 1 },
      { MyDevices_id: { MyDevices_id: 5 }, PrintersCount: 2, SystemsCount: 1 },
      { MyDevices_id: { MyDevices_id: 5 }, PrintersCount: 0, SystemsCount: 3 },
      { MyDevices_id: { MyDevices_id: 6 }, PrintersCount: 2, SystemsCount: 0 },
      { MyDevices_id: { MyDevices_id: 5 }, PrintersCount: 1, SystemsCount: 1 },
      { MyDevices_id: { MyDevices_id: 5 }, PrintersCount: 1, SystemsCount: 1 },
    ],
  },
};

describe('HAM inventory summaries', () => {
  it('counts all models and stock units, including zero-stock models', () => {
    assert.deepEqual(selectTabSummary(state, 'all'), {
      models: 12,
      units: 99,
      assigned: 23,
    });
  });

  it('uses the same assignment rollup for assigned rows and summary', () => {
    const assignmentByModel = selectAssignmentByModel(state);
    const assignedRows = selectFilteredDevices(state, 'assigned');

    assert.equal(assignedRows.length, 2);
    assert.deepEqual(selectTabSummary(state, 'assigned'), {
      models: 2,
      units: 50,
      assigned: 23,
    });
    assert.equal(assignmentByModel.get(5).units + assignmentByModel.get(6).units, 23);
  });
});
