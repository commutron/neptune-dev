import React, { Fragment } from 'react';

export const branchOptions = ( branchSelect, trackOption )=> {

  let optionsSort = trackOption.sort((t1, t2)=>
                  t1.step < t2.step ? -1 : t1.step > t2.step ? 1 : 0 );
               
  const branchArr = branchSelect === 'other' ?
                  optionsSort.filter( x => !x.branchKey || x.branchKey === '') :
                  optionsSort.filter( x => x.branchKey === branchSelect);
                
  return branchArr;
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