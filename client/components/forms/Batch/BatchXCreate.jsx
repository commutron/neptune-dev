import React from 'react';
import moment from 'moment';
// import 'moment-business-time';
import 'moment-timezone';
import Pref from '/client/global/pref.js';
import { toast } from 'react-toastify';

import ModelLarge from '/client/components/smallUi/ModelLarge.jsx';

const BatchXCreate = ({ groupId, widgetId, versionKey, allVariants, lock })=> (
  <ModelLarge
    button={'New ' + Pref.xBatch}
    title={'Create New ' + Pref.xBatch}
    color='greenT'
    icon='fa-cubes'
    lock={!Roles.userIsInRole(Meteor.userId(), ['create', 'nightly']) || lock}>
    
    <BXCreateForm
      groupId={groupId}
      widgetId={widgetId}
      versionKey={versionKey}
      allVariants={allVariants}
    />
  </ModelLarge>
);

export default BatchXCreate;

const BXCreateForm = ({ groupId, widgetId, versionKey, allVariants })=> {

  function save(e) {
    e.preventDefault();
    
    const vKey = this.vrsn.value;
    const batchNum = this.oNum.value.trim().toLowerCase();
    const salesNum = this.soNum.value.trim().toLowerCase();
    
    const startDate = this.sDate.value;
    const corStart = moment(startDate).startOf('day').format();
    
    const endDate = this.eDate.value;
    const corEnd = moment(endDate).endOf('day').format();
    
    const quantity = this.quant.value.trim().toLowerCase();
    const quoteTimeInput = this.hourNum.value;

    Meteor.call('addBatchX', 
      batchNum, groupId, widgetId, vKey, 
      salesNum, corStart, corEnd,
      quantity, quoteTimeInput,
      (error, reply)=>{
        if(error) {
          console.log(error);
          toast.error('Server Error');
        }
        if(reply) {
          FlowRouter.go('/data/batch?request=' + batchNum);
        }else{
          toast.warning('Duplicate');
        }
    });
  }
  
  let eVer = !versionKey ? '' : versionKey;
  
  return(
    <form className='centre' onSubmit={(e)=>save(e)}>
      <p>
        <label htmlFor='vrsn'>{Pref.version}</label><br />
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
          placeholder='21947'
          autoFocus={true}
          required
        /></label>
      
        <label htmlFor='soNum' className='breath'>{Pref.salesOrder} number<br />
        <input
          type='text'
          id='soNum'
          className='numberSet indenText'
          pattern='[A-Za-z0-9 \._-]*'
          maxLength='32'
          minLength='1'
          placeholder='ab00ot70b'
          required
        /></label>
      
      </div>
      
      <div className='centreRow vmargin'>
      
        <label htmlFor='sDate' className='breath'>{Pref.start} date<br />
        <input
          type='date'
          id='sDate'
          className='numberSet'
          defaultValue={moment().format('YYYY-MM-DD')}
          pattern='[0-9]{4}-[0-9]{2}-[0-9]{2}'
          required 
        /></label>

        <label htmlFor='eDate' className='breath'>{Pref.end} date<br />
        <input
          type='date'
          id='eDate'
          className='numberSet'
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
      
      <div className='centreRow vmargin'>
        
        <label htmlFor='hourNum' className='breath'>{Pref.timeBudget} (in hours)<br />
        <input
          type='number'
          id='hourNum'
          title={`update quoted time budget\n in hours to 2 decimal places`}
          className='numberSet indenText'
          pattern="^\d*(\.\d{0,2})?$"
          maxLength='6'
          minLength='1'
          max='1000'
          min='0.01'
          step=".01"
          inputMode='numeric'
          placeholder='54.07'
          // required 
        /></label>
        
      </div>
      
      <div className='vmargin'>
        <button
          type='submit'
          className='action clear greenHover'
        >Create</button>
      </div>
    </form>
  );
};