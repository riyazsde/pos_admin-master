import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import {
  getTicketAssigneeId,
  normalizeAgentId,
} from './ticketAssignment.js';

describe('ticket assignment data', () => {
  it('reads supported assignee fields and normalizes IDs for selection', () => {
    assert.equal(getTicketAssigneeId({ employee_id: 7 }), '7');
    assert.equal(
      getTicketAssigneeId({ Assigned_Employee_id: { user_id: 12 } }),
      '12'
    );
    assert.equal(
      getTicketAssigneeId({ Assigned_Employee: { _id: 14 } }),
      '14'
    );
    assert.equal(normalizeAgentId(null), null);
  });

  it('keeps tickets unassigned when the API provides no assignee ID', () => {
    assert.equal(getTicketAssigneeId({ Support_Ticket_id: 11 }), null);
  });
});
