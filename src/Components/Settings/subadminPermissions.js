export const PERMISSION_TYPES = [
  {
    labelKey: 'subadmin.permissions.dashboard',
    createValue: 'Dashboard',
    editValue: 'dashboard',
  },
  {
    labelKey: 'subadmin.permissions.clients',
    createValue: 'Clients',
    editValue: 'clients',
  },
  {
    labelKey: 'subadmin.permissions.subscriptions',
    createValue: 'Subscriptions',
    editValue: 'subscriptions',
  },
  {
    labelKey: 'subadmin.permissions.reports',
    createValue: 'Reports',
    editValue: 'reports',
  },
  {
    labelKey: 'subadmin.permissions.momDevice',
    createValue: 'MDM Device',
    editValue: 'mdm device',
    aliases: ['mdm', 'mom', 'mom device'],
  },
  {
    labelKey: 'subadmin.permissions.inventory',
    createValue: 'Inventory',
    editValue: 'inventory',
  },
  {
    labelKey: 'subadmin.permissions.auditLog',
    createValue: 'Audits Log',
    editValue: 'audits log',
  },
  {
    labelKey: 'subadmin.permissions.supportTickets',
    createValue: 'Support Tickets',
    editValue: 'support tickets',
  },
  {
    labelKey: 'subadmin.permissions.posDevices',
    createValue: 'POS Devices',
    editValue: 'pos devices',
  },
  {
    labelKey: 'subadmin.permissions.settings',
    createValue: 'Settings',
    editValue: 'settings',
  },
];

export const getPermissionLabelKey = (value) => {
  const normalizedValue = String(value ?? '').trim().toLowerCase();
  return PERMISSION_TYPES.find(
    (permission) =>
      permission.createValue.toLowerCase() === normalizedValue ||
      permission.editValue === normalizedValue ||
      permission.aliases?.includes(normalizedValue)
  )?.labelKey;
};

export const getPermissionEditValue = (value) => {
  const normalizedValue = String(value ?? '').trim().toLowerCase();
  return PERMISSION_TYPES.find(
    (permission) =>
      permission.createValue.toLowerCase() === normalizedValue ||
      permission.editValue === normalizedValue ||
      permission.aliases?.includes(normalizedValue)
  )?.editValue;
};
