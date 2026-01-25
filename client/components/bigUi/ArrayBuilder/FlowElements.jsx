import React, { Fragment } from 'react';

export const branchOptions = ( branchSelect, trackOption )=> {
  
  const branchFilter = branchSelect === 'other' ?
                  trackOption.filter( x => !x.branchKey || x.branchKey === '') :
                  trackOption.filter( x => x.branchKey === branchSelect);
  
  let optionsSort = branchFilter.sort((t1, t2)=>
                  t1.step < t2.step ? -1 : t1.step > t2.step ? 1 : 0 );
                 
  return optionsSort;
};

export const FinishOptions = ()=> (
  <Fragment>
    <option value='finish'>Finish</option>
    <option value='pack'>Pack</option>
    <option value='pack-ship'>Pack & Ship</option>
    <option value='stock'>Stock</option>
    <option value='supply'>Supply</option>
  </Fragment>
);