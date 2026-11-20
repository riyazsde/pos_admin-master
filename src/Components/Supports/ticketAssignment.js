export const normalizeAgentId = (id) =>
  id === null || id === undefined || id === '' ? null : String(id);

export const getTicketAssigneeId = (ticket) => {
  const rawId =
    ticket?.employeeId ??
    ticket?.employee_id ??
    ticket?.Employee_id ??
    ticket?.assignedEmployeeId ??
    ticket?.assigned_employee_id ??
    ticket?.Assigned_Employee_id ??
    ticket?.assignedAgentId ??
    ticket?.assigned_to_id ??
    ticket?.Assigned_To_id ??
    ticket?.AssignedTo?.employee_id ??
    ticket?.AssignedTo?.Employee_id ??
    ticket?.AssignedTo?.id ??
    ticket?.Assigned_Employee?.employee_id ??
    ticket?.Assigned_Employee?.Employee_id ??
    ticket?.Assigned_Employee?.id ??
    ticket?.Assigned_Employee?._id ??
    ticket?.Assigned_To?.employee_id ??
    ticket?.Assigned_To?.Employee_id ??
    ticket?.Assigned_To?.id ??
    ticket?.assignee?.employee_id ??
    ticket?.assignee?.id ??
    ticket?.assignee?._id;
  const id =
    rawId && typeof rawId === 'object'
      ? rawId.employee_id ??
        rawId.Employee_id ??
        rawId.id ??
        rawId.user_id ??
        rawId._id
      : rawId;

  return normalizeAgentId(id);
};
