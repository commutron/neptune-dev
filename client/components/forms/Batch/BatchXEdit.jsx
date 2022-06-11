import React, { useState, useEffect } from 'react';
import moment from 'moment';
import Pref from '/client/global/pref.js';
import { toast } from 'react-toastify';
import { min2hr } from '/client/utility/Convert';

import ModelMedium from '/client/components/smallUi/ModelMedium';

const BatchXEdit = ({ batchData, seriesData, allVariants, lock })=> {
  
  const canRun = Roles.userIsInRole(Meteor.userId(), 'run');
  const canEdit = Roles.userIsInRole(Meteor.userId(), 'edit');
  const isDebug = Roles.userIsInRole(Meteor.userId(), 'debug');
  
  const aT = !(canEdit || canRun) ? Pref.norole : '';
  const lT = lock ? lock : '';
  const title = (canEdit || canRun) && !lock ? `Edit ${Pref.xBatch}` : `${aT}\n${lT}`;
  
  return(
    <ModelMedium
      button={'Edit ' + Pref.xBatch}
      title={title}
      color='blueT'
      icon='fa-cubes'
      lock={!(canEdit || canRun) || (lock && !isDebug)}
    >
    <BXEditForm 
      batchData={batchData}
      seriesData={seriesData}
      allVariants={allVariants}
      canEdit={canEdit}
    />
    </ModelMedium>
  );
};

export default BatchXEdit;


const BXEditForm = ({ batchData, seriesData, allVariants, canEdit, selfclose })=> {
  
  const [ nxtNum, nxtSet ] = useState(false);
  
  useEffect( ()=>{
    Meteor.call('getNextBatch', (err, re)=>{
      err && console.log(err);
      re && nxtSet(re);
     }); 
  }, []);
   
  function save(e) {
    e.preventDefault();
    const batchId = batchData._id;
    
    const vKey = this.vrsn.value;
    const batchNum = this.oNum.value.trim().toLowerCase();
    const salesNum = this.soNum.value.trim().toLowerCase();
    
    const startDate = this.sDate.value;
    const corStart = moment(startDate).startOf('day').format();

    const quantity = this.quant.value.trim().toLowerCase();

    Meteor.call('editBatchX', batchId, batchNum, vKey, salesNum, corStart, quantity, 
    (error, reply)=>{
      if(error) {
        console.log(error);
        toast.error('Server Error');
      }
      if(reply) {
        toast.success('Saved');
        if(batchData.batch !== batchNum) {
          FlowRouter.go('/data/batch?request=' + batchNum);
        }else{
          selfclose();
        }
      }else{
        toast.warning(`Duplicate or In Use.\n
          Changing the ${Pref.xBatch} number while recording time will cause errors`);
      }
    });
  }
  
  const bDt = batchData;
  const gtb = bDt.quoteTimeBudget[0] ? min2hr(bDt.quoteTimeBudget[0].timeAsMinutes) : 0;

  return(
    <form className='centre' onSubmit={(e)=>save(e)}>
      <div className='centreRow'>
        <label className='breath' htmlFor='vrsn'>{Pref.variant}<br />
          <select
            id='vrsn'
            defaultValue={bDt.versionKey}
            disabled={!canEdit}
            required>
          {allVariants.map( (entry)=>{
            if(entry.live || entry.versionKey === bDt.versionKey) {
              return(
                <option value={entry.versionKey} key={entry.versionKey}>
                  {entry.variant}
                </option>
              )}})}
          </select>
        </label>
      </div>
      
      <div className='centreRow vmargin'>
        <label htmlFor='oNum' className='breath'>{Pref.xBatch} number<br />
        <input
          type='text'
          id='oNum'
          list='nextbatch'
          pattern='[00000-99999]*'
          maxLength='5'
          minLength='5'
          inputMode='numeric'
          defaultValue={bDt.batch}
          placeholder={bDt.batch}
          autoFocus={true}
          disabled={!canEdit}
          required
        /></label>
        
        <datalist id='nextbatch'>
          <option value={bDt.batch}>{bDt.batch}</option>
          {nxtNum ? <option value={nxtNum}>{nxtNum}</option> : null}
        </datalist>
        
        <label htmlFor='soNum' className='breath'>{Pref.salesOrder} number<br />
        <input
          type='text'
          id='soNum'
          maxLength='32'
          minLength='1'
          defaultValue={bDt.salesOrder}
          placeholder='179470b'
          required
        /></label>
      </div>
      
      <div className='centreRow vmargin'>
        <label htmlFor='quant' className='breath'>Quantity<br />
        <input
          type='number'
          id='quant'
          pattern='[00000-99999]*'
          maxLength='5'
          minLength='1'
          max={99999}
          min={seriesData ? seriesData.items.length : 0}
          inputMode='numeric'
          defaultValue={bDt.quantity}
          placeholder='10000'
          required 
        /></label>
        
        <label className='breath'>Serialize<br />
          <label htmlFor='srlz' className='beside'>
          <input
            type='checkbox'
            id='srlz'
            title='for future release'
            className='indenText inlineCheckbox'
            defaultChecked={bDt.serialize}
            disabled={true}
          /><i>Use {Pref.itemSerial} numbers</i></label>
        </label>
      </div>
      
      <div className='centreRow vmargin'>
        <label htmlFor='sDate' className='breath'>{Pref.salesOrder} {Pref.start}<br />
        <input
          type='date'
          id='sDate'
          max={moment(bDt.createdAt).format('YYYY-MM-DD')}
          defaultValue={moment(bDt.salesStart).format('YYYY-MM-DD')}
          pattern='[0-9]{4}-[0-9]{2}-[0-9]{2}'
          required 
        /></label>
        
        <label htmlFor='hourNum' className='breath'>{Pref.timeBudget} (in hours)<br />
          <input
            type='number'
            id='hourNum'
            title={`update quoted time budget\n in hours to 2 decimal places`}
            className='numberSet indenText miniIn18'
            defaultValue={gtb}
            disabled={true}
          /></label>
      </div>
      
      
      <div className='centreRow vmargin'>
        <button
          type='submit'
          className='action nSolid'
        >Save</button>
      </div>
    </form>
  );
};