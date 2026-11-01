import test from 'node:test';
import assert from 'node:assert/strict';
export function validateJournal(lines) {
 if (!Array.isArray(lines)||lines.length<2) throw new Error('Journal requires at least two lines');
 let debit=0,credit=0;
 for(const l of lines){
  if(!l.accountId||!Number.isFinite(l.debit)||!Number.isFinite(l.credit)||l.debit<0||l.credit<0||(l.debit>0&&l.credit>0)||(l.debit===0&&l.credit===0)) throw new Error('Invalid journal line');
  debit+=l.debit;credit+=l.credit;
 }
 if(Math.round(debit*100)!==Math.round(credit*100)) throw new Error('Journal is not balanced');
 return Object.freeze({debit:Math.round(debit*100)/100,credit:Math.round(credit*100)/100,balanced:true});
}
export function reversalLines(originalLines) {
 if(!Array.isArray(originalLines)||originalLines.length<2) throw new Error('Original journal lines required');
 return originalLines.map(l=>Object.freeze({...l,debit:l.credit,credit:l.debit}));
}
test('balanced journal is accepted',()=>{
 assert.deepEqual(validateJournal([{accountId:'CASH',debit:100,credit:0},{accountId:'SALES',debit:0,credit:100}]),{debit:100,credit:100,balanced:true});
});
test('unbalanced journal is rejected',()=>{
 assert.throws(()=>validateJournal([{accountId:'CASH',debit:100,credit:0},{accountId:'SALES',debit:0,credit:90}]));
});
test('reversal swaps debit and credit without mutating original',()=>{
 const original=[{accountId:'CASH',debit:10,credit:0},{accountId:'SALES',debit:0,credit:10}];
 assert.deepEqual(reversalLines(original).map(x=>[x.debit,x.credit]),[[0,10],[10,0]]);
 assert.equal(original[0].debit,10);
});