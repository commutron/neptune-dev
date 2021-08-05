import React, { useState, useEffect } from 'react';
import moment from 'moment';
// import 'moment-business-time';
import 'moment-timezone';
import Pref from '/client/global/pref.js';
import { toast } from 'react-toastify';

import ModelMedium from '/client/components/smallUi/ModelMedium';

const BatchXCreate = ({ groupId, widgetId, allVariants, lock })=> {
  const access = Roles.userIsInRole(Meteor.userId(), 'create');
  const aT = !access ? Pref.norole : '';
  const lT = lock ? lock : '';
  const title = access && !lock ? 'Create new ' + Pref.xBatch : `${aT}\n${lT}`;
  return(
    <ModelMedium
      button={'New ' + Pref.xBatch}
      title={title}
      color='blueT'
      icon='fa-cubes'
      lock={!access || lock}
    >
      <BXCreateForm
        groupId={groupId}
        widgetId={widgetId}
        allVariants={allVariants}
      />
    </ModelMedium>
  );
};

export default BatchXCreate;

const BXCreateForm = ({ groupId, widgetId, allVariants })=> {
  
  const [ nxtNum, nxtSet ] = useState(false);
  
  useEffect( ()=>{
    Meteor.call('getNextBatch', (err, re)=>{
      err && console.log(err);
      re && nxtSet(re);
     }); 
   }, []);
   
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
    
    const doSerialize = this.srlz.checked;
    const quoteTimeInput = this.hourNum.value;
    
    Meteor.call('addBatchX', 
      batchNum, groupId, widgetId, vKey, 
      salesNum, corStart, corEnd,
      quantity, doSerialize, quoteTimeInput,
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
  
  return(
    <form className='centre' onSubmit={(e)=>save(e)}>
      <p>
        <label htmlFor='vrsn'>{Pref.version}</label><br />
        <select
          id='vrsn'
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
          list='nextbatch'
          pattern='[00000-99999]*'
          maxLength='5'
          minLength='5'
          inputMode='numeric'
          placeholder={nxtNum || '21356'}
          autoFocus={true}
          required
          autoComplete={navigator.userAgent.includes('Firefox/') ? "off" : ""}
        /></label>
        
        <datalist id='nextbatch'>
          {nxtNum ? <option value={nxtNum}>{nxtNum}</option> : null}
        </datalist>
      
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
          max={moment().format('YYYY-MM-DD')}
          defaultValue={moment().format('YYYY-MM-DD')}
          pattern='[0-9]{4}-[0-9]{2}-[0-9]{2}'
          required 
        /></label>

        <label htmlFor='eDate' className='breath'>{Pref.end} date<br />
        <input
          type='date'
          id='eDate'
          className='numberSet'
          min={moment().format('YYYY-MM-DD')}
          pattern='[0-9]{4}-[0-9]{2}-[0-9]{2}'
          required
        /></label>
      
      </div>
      
      <div className='centreRow vmargin'>
        <label htmlFor='quant' className='breath'>Quantity<br />
        <input
          type='text'
          id='quant'
          pattern='[00000-99999]*'
          maxLength='5'
          minLength='1'
          inputMode='numeric'
          placeholder='10000'
          required 
        /></label>
        
        <label className='breath'>Serialize<br />
          <label htmlFor='srlz' className='beside'>
          <input
            type='checkbox'
            id='srlz'
            className='indenText inlineCheckbox'
            defaultChecked={false}
          /><i>Use {Pref.itemSerial} numbers</i></label>
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
          maxLength='7'
          minLength='1'
          max='10000'
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
          className='action clearBlue'
        >Create</button>
      </div>
    </form>
  );
};