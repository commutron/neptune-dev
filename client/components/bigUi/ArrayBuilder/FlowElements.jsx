import React, { Fragment } from 'react';
import { flexSort } from '/client/utility/Arrays.js';

export const branchOptions = ( branchSelect, trackOption )=> {
  
  const branchFilter = branchSelect === 'other' ?
                  trackOption.filter( x => !x.branchKey || x.branchKey === '') :
                  trackOption.filter( x => x.branchKey === branchSelect);
  
  let optionsSort = flexSort(branchFilter, 'step');
                 
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