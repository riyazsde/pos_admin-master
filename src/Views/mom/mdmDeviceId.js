export const getNumericMdmDeviceId = (device) => {
  const rawId = device?.MyDevices_id;
  if (
    (typeof rawId !== 'number' && typeof rawId !== 'string') ||
    (typeof rawId === 'string' && !/^\d+$/.test(rawId.trim()))
  ) {
    return null;
  }

  const id = Number(rawId);
  return Number.isSafeInteger(id) && id > 0 ? id : null;
};
