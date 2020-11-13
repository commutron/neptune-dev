import React from 'react';
import moment from 'moment';
import Pref from '/client/global/pref.js';
import { toast } from 'react-toastify';

import Model from '/client/components/smallUi/Model.jsx';


const BatchEdit = ({ 
  batchId, batchNow, versionKey, allVariants, 
  salesOrder, start, end, quoteTimeBudget,
  lock, noText
})=> {

  function save(e) {
    e.preventDefault();
    
    const vKey = e.target.vrsn.value;
    const batchNum = e.target.oNum.value.trim().toLowerCase();
    const salesNum = e.target.soNum.value.trim().toLowerCase();
    const startDate = e.target.sDate.value;
    const corStart = moment(startDate).startOf('day').format();

    Meteor.call('editBatch', 
      batchId, batchNum, vKey, salesNum, corStart, 
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
  
  const qtB = !quoteTimeBudget || !quoteTimeBudget.length > 0 ? 
    0 : quoteTimeBudget[0];
    
  return (
    <Model
      button={'Edit ' + Pref.batch}
      title={`edit ${Pref.batch} ${batchNow}`}
      color='greenT'
      icon='fa-cubes'
      lock={!Roles.userIsInRole(Meteor.userId(), 'edit') || lock}
      noText={noText}>
      <form className='centre' onSubmit={(e)=>save(e)}>
        <p>
          <label htmlFor='vrsn'>{Pref.variant}</label><br />
          <select
            id='vrsn'
            className='numberSet'
            defaultValue={versionKey}
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
          <label htmlFor='oNum' className='breath'>{Pref.batch} number<br />
          <input
            type='number'
            id='oNum'
            className='numberSet indenText'
            pattern='[00000-99999]*'
            maxLength='5'
            minLength='5'
            max='99999'
            min='00001'
            step='1'
            inputMode='numeric'
            defaultValue={batchNow}
            placeholder={batchNow}
            autoFocus={true}
            required 
          /></label>
        
          <label htmlFor='soNum' className='breath'>{Pref.salesOrder}<br />
          <input
            type='text'
            id='soNum'
            className='numberSet indenText'
            maxLength='32'
            minLength='1'
            defaultValue={salesOrder}
            placeholder={salesOrder}
            required
          /></label>
        </div>
        
        <div className='centreRow vmargin'>
          <label htmlFor='sDate' className='breath'>{Pref.start}<br />
          <input
            type='date'
            id='sDate'
            className='numberSet'
            defaultValue={moment(start).format('YYYY-MM-DD')}
            pattern='[0-9]{4}-[0-9]{2}-[0-9]{2}'
            required 
          /></label>
          <label htmlFor='eDate' className='breath'>{Pref.end}<br />
          <input
            type='date'
            id='eDate'
            className='numberSet'
            defaultValue={moment(end).format('YYYY-MM-DD')}
            disabled={true}
            required 
          /></label>
        </div>
        <div className='centreRow vmargin fade'>
          <label htmlFor='qUnum' className='breath'>Quantity<br />
          <input
            type='number'
            id='qUnum'
            className='numberSet indenText'
            maxLength='5'
            minLength='1'
            placeholder=''
            disabled={true}
            //required
          /></label>
          <label className='breath'>Serialize<br />
            <label htmlFor='srlz' className='beside mockInputBoxOFF'>
            <input
              type='checkbox'
              id='srlz'
              title='for future release'
              className='indenText inlineCheckbox'
              defaultChecked={true}
              disabled={true}
              //required 
            /><i className='medBig'>Use {Pref.itemSerial} numbers</i></label>
          </label>
        </div>
        
        <div className='centreRow vmargin'>
          <label htmlFor='hourNum' className='breath'>{Pref.timeBudget}<br />
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
            defaultValue={qtB}
            disabled={true}
            required 
          /></label>
        </div>
        
        <div className='vmargin'>
          <button 
            type='submit' 
            className='action clear greenHover'
          >Save</button>
        </div>
      </form>
    </Model>
  );
};

export default BatchEdit;