// Serverless API Client for Vercel + Neon Postgres

async function api(action, payload = null) {
  try {
    const res = await fetch('/api/data', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action, payload })
    });
    if (!res.ok) {
      console.warn('API /api/data error status:', res.status);
      return null;
    }
    return await res.json();
  } catch (err) {
    console.warn('API /api/data network error:', err);
    return null;
  }
}

export async function fetchAllData() {
  return await api('fetchAll');
}

export async function saveMember(m) {
  const res = await api('saveMember', m);
  return !!res?.success;
}

export async function deleteMember(id) {
  const res = await api('deleteMember', { id });
  return !!res?.success;
}

export async function saveTransaction(t) {
  const res = await api('saveTransaction', t);
  return !!res?.success;
}

export async function deleteTransaction(id) {
  const res = await api('deleteTransaction', { id });
  return !!res?.success;
}

export async function saveAttendanceLog(a) {
  const res = await api('saveAttendance', a);
  return !!res?.success;
}

export async function deleteAttendanceLog(id) {
  const res = await api('deleteAttendance', { id });
  return !!res?.success;
}

export async function saveExpense(e) {
  const res = await api('saveExpense', e);
  return !!res?.success;
}

export async function deleteExpense(id) {
  const res = await api('deleteExpense', { id });
  return !!res?.success;
}

export async function saveDailyVisitor(d) {
  const res = await api('saveDailyVisitor', d);
  return !!res?.success;
}

export async function deleteDailyVisitor(id) {
  const res = await api('deleteDailyVisitor', { id });
  return !!res?.success;
}

export async function savePackage(p) {
  const res = await api('savePackage', p);
  return !!res?.success;
}

export async function deletePackage(id) {
  const res = await api('deletePackage', { id });
  return !!res?.success;
}

export async function saveProduct(p) {
  const res = await api('saveProduct', p);
  return !!res?.success;
}

export async function deleteProduct(id) {
  const res = await api('deleteProduct', { id });
  return !!res?.success;
}

export async function saveSetting(key, value) {
  const res = await api('saveSetting', { key, value });
  return !!res?.success;
}
