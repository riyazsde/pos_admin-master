const ADMIN_ROLES = new Set([
  'admin',
  'administrator',
  'super admin',
  'super administrator',
]);

const isGranted = (value) =>
  value === true || value === 1 || value === 'true';

export const hasRoutePermission = (user, permission) => {
  const role = String(user?.Role_id?.role_name ?? user?.role ?? '')
    .trim()
    .toLowerCase();
  if (ADMIN_ROLES.has(role)) return true;

  const permissionLists = [
    user?.SubAdmin_Permissions?.IsPermissons,
    user?.IsPermissons,
    user?.permissions,
  ];

  return permissionLists.some(
    (entries) =>
      Array.isArray(entries) &&
      entries.some((entry) => {
        if (typeof entry === 'string') {
          return entry.trim().toLowerCase() === permission.toLowerCase();
        }

        const name = entry?.type ?? entry?.name;
        return (
          isGranted(entry?.status) &&
          String(name ?? '').trim().toLowerCase() === permission.toLowerCase()
        );
      })
  );
};
