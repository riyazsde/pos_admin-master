const getDeviceId = (device) => {
  const value = device?.MyDevices_id;
  return value && typeof value === 'object' ? value.MyDevices_id : value;
};

const getSerial = (device) => {
  const value =
    device?.Serial_Number ?? device?.serialNumber ?? device?.serial;
  return typeof value === 'string' ? value.trim().toUpperCase() : '';
};

const countBy = (devices, getKey) => {
  const counts = new Map();
  devices.forEach((device) => {
    const key = getKey(device);
    if (key === null || key === undefined || key === '') return;
    counts.set(key, (counts.get(key) || 0) + 1);
  });
  return counts;
};

export const getMdmBindings = (inventoryDevices, mdmDevices) => {
  if (!Array.isArray(mdmDevices)) {
    return inventoryDevices.map(() => ({ status: 'unavailable' }));
  }

  const inventoryIds = countBy(inventoryDevices, (device) => {
    const id = getDeviceId(device);
    return id === null || id === undefined ? id : String(id);
  });
  const inventorySerials = countBy(inventoryDevices, getSerial);
  const mdmIds = countBy(mdmDevices, (device) => {
    const id = getDeviceId(device);
    return id === null || id === undefined ? id : String(id);
  });
  const mdmSerials = countBy(mdmDevices, getSerial);

  return inventoryDevices.map((device) => {
    const rawId = getDeviceId(device);
    const id = rawId === null || rawId === undefined ? '' : String(rawId);
    const serial = getSerial(device);
    if (!id || !serial) return { status: 'missingIdentity' };

    const idMatches = mdmDevices.filter(
      (candidate) => String(getDeviceId(candidate) ?? '') === id
    );
    const serialMatches = mdmDevices.filter(
      (candidate) => getSerial(candidate) === serial
    );
    const sameMdmRecord =
      idMatches.length === 1 &&
      serialMatches.length === 1 &&
      idMatches[0] === serialMatches[0];
    const uniqueAcrossBothLists =
      inventoryIds.get(id) === 1 &&
      inventorySerials.get(serial) === 1 &&
      mdmIds.get(id) === 1 &&
      mdmSerials.get(serial) === 1;

    if (sameMdmRecord && uniqueAcrossBothLists) {
      return { status: 'matched' };
    }

    if (idMatches.length === 0 && serialMatches.length === 0) {
      return { status: 'notEnrolled' };
    }

    const mdmRecord = idMatches[0] || serialMatches[0];
    return {
      status: 'mismatch',
      mdmId: getDeviceId(mdmRecord),
      mdmSerial: getSerial(mdmRecord) || null,
    };
  });
};
