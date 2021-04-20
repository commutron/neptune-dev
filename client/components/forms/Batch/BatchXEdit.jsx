import React from 'react';
import moment from 'moment';
import Pref from '/client/global/pref.js';
import { toast } from 'react-toastify';

import ModelMedium from '/client/components/smallUi/ModelMedium';

const BatchXEdit = ({ batchData, seriesData, allVariants, lock })=> (
  <ModelMedium
    button={'Edit ' + Pref.xBatch}
    title={'Edit ' + Pref.xBatch}
    color='greenT'
    icon='fa-cubes'
    lock={!Roles.userIsInRole(Meteor.userId(), 'create') || lock}
    // menuItem={true}
  >
  <BXEditForm 
    batchData={batchData}
    seriesData={seriesData}
    allVariants={allVariants}
  />
  </ModelMedium>
);

export default BatchXEdit;


const BXEditForm = ({ batchData, seriesData, allVariants, selfclose })=> {

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

  return(
    <form className='centre' onSubmit={(e)=>save(e)}>
      <p>
        <select
          id='vrsn'
          defaultValue={bDt.versionKey}
          required>
        {allVariants.map( (entry)=>{
          if(entry.live) {
            return(
              <option value={entry.versionKey} key={entry.versionKey}>
                {entry.variant}
              </option>
            )}})}
        </select>
        <label htmlFor='vrsn'>{Pref.version}</label>
      </p>
      
      <div className='centreRow vmargin'>
        <label htmlFor='oNum' className='breath'>{Pref.xBatch} number<br />
        <input
          type='text'
          id='oNum'
          pattern='[00000-99999]*'
          maxLength='5'
          minLength='5'
          inputMode='numeric'
          defaultValue={bDt.batch}
          placeholder='17947'
          autoFocus={true}
          required
        /></label>

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
        <label htmlFor='sDate' className='breath'>{Pref.start} date<br />
        <input
          type='date'
          id='sDate'
          defaultValue={moment(bDt.salesStart).format('YYYY-MM-DD')}
          pattern='[0-9]{4}-[0-9]{2}-[0-9]{2}'
          required 
        /></label>

        <label htmlFor='eDate' className='breath'>{Pref.end} date<br />
        <input
          type='date'
          id='eDate'
          defaultValue={moment(bDt.salesEnd).format('YYYY-MM-DD')}
          pattern='[0-9]{4}-[0-9]{2}-[0-9]{2}'
          disabled={true}
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
          <label htmlFor='srlz' className='beside mockInputBoxOFF'>
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
        <button
          type='submit'
          className='action clearGreen'
        >Save</button>
      </div>
    </form>
  );
};