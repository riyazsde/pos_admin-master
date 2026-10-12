// Backend valid: Pending | Open | Process | Solve | Close
export const BACKEND_TO_UI = {
  Pending: 'Pending',
  Open: 'New',
  Process: 'On-Going',
  Solve: 'Resolved',
  Close: 'Closed',
};

export const UI_TO_BACKEND = {
  New: 'Open',
  'On-Going': 'Process',
  Resolved: 'Solve',
  Pending: 'Pending',
  Closed: 'Close',
};

export const mapBackendStatus = (raw) => {
  if (!raw) return 'New';
  if (BACKEND_TO_UI[raw]) return BACKEND_TO_UI[raw];
  const key = Object.keys(BACKEND_TO_UI).find(
    (k) => k.toLowerCase() === String(raw).toLowerCase()
  );
  return key ? BACKEND_TO_UI[key] : 'New';
};

export const mapUiStatusToBackend = (uiLabel) => {
  if (!uiLabel) return null;
  return UI_TO_BACKEND[uiLabel] || null;
};

export const TICKET_TABS = [
  { key: 'All Tickets', filter: null,       heading: 'All Tickets' },
  { key: 'New',         filter: 'New',      heading: 'New Tickets' },
  { key: 'On-Going',    filter: 'On-Going', heading: 'Ongoing Tickets' },
  { key: 'Pending',     filter: 'Pending',  heading: 'Pending Tickets' },
  { key: 'Resolved',    filter: 'Resolved', heading: 'Resolved Tickets' },
  { key: 'Closed',      filter: 'Closed',   heading: 'Closed Tickets' },
  { key: 'Escalated',   filter: null,       heading: 'Escalated Tickets' }, // backend unsupported
];