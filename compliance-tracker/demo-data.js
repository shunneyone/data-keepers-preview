import {CATEGORIES,shiftDate} from './model.js';
export function demoData(today) {
  const names = ['Contractor licence — civil works','Public liability insurance','Confined space competency','Excavator inspection certificate','Quality management accreditation','Mobile crane inspection'];
  const people = ['Alex Banks','Sam Rivers','Taylor Vale','Casey Field','Jordan Brook','Morgan Hill'];
  return names.map((name,i) => ({id:`demo-${i}`,name,category:CATEGORIES[i%5],responsiblePerson:people[i],issueDate:shiftDate(today,-180),expiryDate:shiftDate(today,[95,18,-7,30,220,0][i])}));
}
