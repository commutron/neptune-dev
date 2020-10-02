import React from 'react';
import moment from 'moment';
import Pref from '/client/global/pref.js';
import { toast } from 'react-toastify';

import ModelLarge from '/client/components/smallUi/ModelLarge.jsx';

const BatchXEdit = ({ 
  batchId, batchNow, versionKey, allVariants,
  salesOrder, start, end, quantity, lock
})=> (
  <ModelLarge
    button={'Edit ' + Pref.xBatch}
    title={'Edit ' + Pref.xBatch}
    color='blueT'
    icon='fa-cubes'
    lock={!Roles.userIsInRole(Meteor.userId(), ['create', 'nightly']) || lock}
  >
  <BXEditForm 
    batchId={batchId}
    batchNow={batchNow}
    versionKey={versionKey}
    allVariants={allVariants}
    salesOrder={salesOrder}
    start={start}
    end={end}
    quantity={quantity}
  />
  </ModelLarge>
);

export default BatchXEdit;


const BXEditForm = ({ 
  batchId, batchNow, versionKey, allVariants,
  salesOrder, start, end, quantity
})=> {

  function save(e) {
    e.preventDefault();
    const vKey = this.vrsn.value;
    const batchNum = this.oNum.value.trim().toLowerCase();
    const salesNum = this.soNum.value.trim().toLowerCase();
    const startDate = this.sDate.value;
    const endDate = this.eDate.value;
    const quantity = this.quant.value.trim().toLowerCase();

    Meteor.call('editBatchX', batchId, batchNum, vKey, salesNum, startDate, endDate, quantity, (error, reply)=>{
      if(error) {
        console.log(error);
        toast.error('Server Error');
      }
      if(reply) {
        toast.success('Saved');
        FlowRouter.go('/data/batch?request=' + batchNum);
      }else{
        toast.warning('Duplicate');
      }
    });
  }
    
  const ex = batchNow;
  let eNum = ex === 'new' ? '' : ex;
  
  const exV = versionKey;
  let eVer = !exV ? '' : exV;
  
  let eSO = salesOrder || '';
  let eS = start || moment().format('YYYY-MM-DD');
  let eE = end || '';
  let eQ = quantity || '';
    
  return(
    <form className='centre' onSubmit={(e)=>save(e)}>
      <p>
        <select
          id='vrsn'
          defaultValue={eVer}
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
          defaultValue={eNum}
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
          defaultValue={eSO}
          placeholder='179470b'
          required
        /></label>
      </div>
      
      <div className='centreRow vmargin'>
        <label htmlFor='sDate' className='breath'>{Pref.start} date<br />
        <input
          type='date'
          id='sDate'
          defaultValue={eS}
          pattern='[0-9]{4}-[0-9]{2}-[0-9]{2}'
          required 
        /></label>

        <label htmlFor='eDate' className='breath'>{Pref.end} date<br />
        <input
          type='date'
          id='eDate'
          defaultValue={eE}
          pattern='[0-9]{4}-[0-9]{2}-[0-9]{2}'
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
          min={0}
          inputMode='numeric'
          defaultValue={eQ}
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
            defaultChecked={false}
            disabled={true}
          /><i className='medBig'>Use {Pref.itemSerial} numbers</i></label>
        </label>
        
      </div>
     
      <button
        type='submit'
        className='action clearGreen'
      >Save</button>
    </form>
  );
};