import {CATEGORIES,STATUSES,localToday,status,formatDate,dayIndex,counts,filterRecords,saveRecord,deleteRecord} from './model.js';
import {demoData} from './demo-data.js';
const $ = id => document.getElementById(id);
let records = demoData(localToday()), editId = null, deleteId = null, trigger = null;
const fields = ['name','category','responsiblePerson','issueDate','expiryDate'];
for (const id of ['category','filter-category']) for (const category of CATEGORIES) $(id).add(new Option(category,category));
for (const value of STATUSES) $('filter-status').add(new Option(value,value));
function node(tag,text,className) { const el=document.createElement(tag); if(text !== undefined) el.textContent=text; if(className) el.className=className; return el; }
function announce(text) { $('announcement').textContent=text; }
function clearErrors() { for(const field of fields){$(field).removeAttribute('aria-invalid');$(`${field}-error`).textContent='';} }
function closeFlow(restore = true) {
  $('editor').hidden=true; $('confirmation').hidden=true; editId=null;deleteId=null;$('add').disabled=false;
  document.querySelectorAll('[data-action]').forEach(b=>b.disabled=false);
  if(restore) (trigger?.isConnected ? trigger : $('add')).focus();
}
function begin(triggerButton) { closeFlow(false);trigger=triggerButton;$('add').disabled=true;document.querySelectorAll('[data-action]').forEach(b=>b.disabled=true); }
function openEditor(record,button) {
  begin(button); editId=record?.id || null; $('form').reset();clearErrors();
  $('editor-title').textContent=record ? `Edit: ${record.name}` : 'Add document';
  if(record) for(const field of fields) $(field).value=record[field];
  $('editor').hidden=false;$('name').focus();
}
function render() {
  const today=localToday();$('today').textContent=formatDate(today);
  const totals=counts(records,today);$('dashboard').replaceChildren();
  for(const [label,value] of Object.entries(totals)) { const card=node('div',undefined,`metric ${label===STATUSES[1]?'warning':label===STATUSES[2]?'expired':''}`);card.append(node('span',label==='total'?'Total documents':label),node('strong',String(value)));$('dashboard').append(card); }
  const visible=filterRecords(records,{search:$('search').value,category:$('filter-category').value,expiryStatus:$('filter-status').value},today);
  $('results').textContent=`Showing ${visible.length} of ${records.length} documents`;$('records').replaceChildren();
  if(!visible.length) $('records').append(node('p',records.length?'No matching documents. Use Clear filters to see the full register.':'No documents yet. Add a document to start your register.'));
  for(const record of visible) {
    const state=status(record.expiryDate,today), days=dayIndex(record.expiryDate)-dayIndex(today);
    const card=node('article',undefined,'record');card.append(node('span',state,`badge ${state===STATUSES[1]?'warning':state===STATUSES[2]?'expired':''}`),node('h3',record.name));
    const dl=node('dl');for(const [label,value] of [['Category',record.category],['Responsible person',record.responsiblePerson],['Issue date',formatDate(record.issueDate)],['Expiry date',formatDate(record.expiryDate)]]){const group=node('div');group.append(node('dt',label),node('dd',value));dl.append(group);}card.append(dl);
    if(days<=30) card.append(node('p',days<0?`Expired ${-days} calendar day${days===-1?'':'s'} ago.`:days===0?'Expires today. Action required.':`Expires in ${days} calendar days. Review renewal.`, 'subtle'));
    const actions=node('div',undefined,'actions');
    for(const action of ['Edit','Delete']) { const button=node('button',action,'secondary');button.type='button';button.dataset.action=action;button.setAttribute('aria-label',`${action} ${record.name}`);button.disabled=!$('editor').hidden || !$('confirmation').hidden;button.addEventListener('click',()=>{if(action==='Edit')openEditor(record,button);else{begin(button);deleteId=record.id;$('delete-detail').textContent=`Delete “${record.name}”? This removes the register entry for this session.`;$('confirmation').hidden=false;$('cancel-delete').focus();}});actions.append(button); }card.append(actions);$('records').append(card);
  }
}
$('add').addEventListener('click',()=>openEditor(null,$('add')));
$('cancel-edit').addEventListener('click',()=>{closeFlow();announce('Changes cancelled.');});
$('cancel-delete').addEventListener('click',()=>{closeFlow();announce('Deletion cancelled.');});
$('form').addEventListener('submit',event=>{
  event.preventDefault();clearErrors();const draft=Object.fromEntries(fields.map(field=>[field,$(field).value]));
  const result=saveRecord(records,draft,editId,editId?null:crypto.randomUUID());
  if(Object.keys(result.errors).length){for(const [field,message] of Object.entries(result.errors)){$(field).setAttribute('aria-invalid','true');$(`${field}-error`).textContent=message;}$(fields.find(field => result.errors[field])).focus();announce('Document not saved. Check the indicated fields.');return;}
  const edited=Boolean(editId);records=result.records;closeFlow(false);render();$('add').focus();announce(`${draft.name.trim()} ${edited?'updated':'added'}.`);
});
$('confirm-delete').addEventListener('click',()=>{const name=records.find(r=>r.id===deleteId).name;records=deleteRecord(records,deleteId,true);closeFlow(false);render();$('add').focus();announce(`${name} deleted.`);});
for(const id of ['search','filter-category','filter-status']) $(id).addEventListener('input',render);
$('clear').addEventListener('click',()=>{$('search').value='';$('filter-category').value='';$('filter-status').value='';render();announce('Filters cleared.');});
render();
