export const CATEGORIES = ['Licences', 'Insurances', 'Employee competencies', 'Equipment certificates', 'Company accreditations'];
export const STATUSES = ['Current', 'Expiring within 30 days', 'Expired'];
export function dayIndex(value) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return NaN;
  const [y,m,d] = value.split('-').map(Number);
  const date = new Date(0); date.setUTCFullYear(y,m-1,d); date.setUTCHours(0,0,0,0);
  return y >= 1 && date.getUTCFullYear() === y && date.getUTCMonth() === m-1 && date.getUTCDate() === d ? date.getTime()/86400000 : NaN;
}
export function localToday(date = new Date()) {
  return `${date.getFullYear().toString().padStart(4,'0')}-${String(date.getMonth()+1).padStart(2,'0')}-${String(date.getDate()).padStart(2,'0')}`;
}
export function shiftDate(date, days) { return new Date((dayIndex(date)+days)*86400000).toISOString().slice(0,10); }
export function status(expiry, today) {
  const days = dayIndex(expiry)-dayIndex(today);
  if (!Number.isFinite(days)) throw new Error('Invalid calendar date');
  return days < 0 ? STATUSES[2] : days <= 30 ? STATUSES[1] : STATUSES[0];
}
export function formatDate(value) {
  const [y,m,d] = value.split('-').map(Number);
  return `${d} ${['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'][m-1]} ${y}`;
}
export function validate(draft) {
  const value = Object.fromEntries(['name','category','responsiblePerson','issueDate','expiryDate'].map(key => [key,String(draft[key] ?? '').trim()]));
  const errors = {};
  if (!value.name) errors.name = 'Enter a document name.';
  if (!value.responsiblePerson) errors.responsiblePerson = 'Enter a responsible person.';
  if (!CATEGORIES.includes(value.category)) errors.category = 'Choose a category.';
  for (const key of ['issueDate','expiryDate']) if (!Number.isFinite(dayIndex(value[key]))) errors[key] = 'Enter a valid calendar date.';
  if (!errors.issueDate && !errors.expiryDate && dayIndex(value.expiryDate) < dayIndex(value.issueDate)) errors.expiryDate = 'Expiry must be on or after the issue date.';
  return {value, errors};
}
export function saveRecord(records, draft, id, newId) {
  const {value,errors} = validate(draft);
  if (Object.keys(errors).length) return {records, errors};
  if (id && !records.some(r => r.id === id)) throw new Error('Record not found');
  if (!id && (!newId || records.some(r => r.id === newId))) throw new Error('Unique ID required');
  const record = {...value,id: id || newId};
  return {records: id ? records.map(r => r.id === id ? record : r) : [...records,record],errors:{}};
}
export function deleteRecord(records,id,confirmed) { return confirmed ? records.filter(r => r.id !== id) : records; }
export function counts(records,today) {
  const result = {total:records.length,...Object.fromEntries(STATUSES.map(s => [s,0]))};
  records.forEach(r => result[status(r.expiryDate,today)]++); return result;
}
export function filterRecords(records,{search='',category='',expiryStatus=''} = {},today) {
  const query = search.trim().toLowerCase();
  return records.filter(r => (!query || `${r.name}\n${r.responsiblePerson}`.toLowerCase().includes(query)) && (!category || r.category === category) && (!expiryStatus || status(r.expiryDate,today) === expiryStatus));
}
