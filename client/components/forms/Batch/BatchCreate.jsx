import React from 'react';
import moment from 'moment';
import Pref from '/client/global/pref.js';
import { toast } from 'react-toastify';

import Model from '/client/components/smallUi/Model.jsx';

// import PrioritySquareData from '/client/components/smallUi/StatusBlocks/PrioritySquare.jsx';


const BatchCreate = ({ widgetId, versionKey, allVariants, lock })=> {

  function save(e) {
    e.preventDefault();
    
    const wId = widgetId;
    const vKey = e.target.vrsn.value;
    const batchNum = e.target.oNum.value.trim().toLowerCase();
    const salesNum = e.target.soNum.value.trim().toLowerCase();
    const startDate = e.target.sDate.value;
    const endDate = e.target.eDate.value;
    
    const quoteTimeInput = e.target.hourNum.value;
    const inHours = parseFloat( quoteTimeInput );
    const inMinutes = moment.duration(inHours, 'hours').asMinutes();
    const quoteTime = isNaN(inMinutes) ? false : inMinutes;
    
    Meteor.call('addBatch', 
      batchNum, wId, vKey, salesNum, startDate, endDate, quoteTime,
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

  return (
    <Model
      button={'New ' + Pref.batch}
      title={'Create a new ' + Pref.batch}
      color='greenT'
      icon='fa-cubes'
      lock={!Roles.userIsInRole(Meteor.userId(), 'create') || lock}>
      <form className='centre' onSubmit={(e)=>save(e)}>
        <p>
          <label htmlFor='vrsn'>{Pref.variant}</label><br />
          <select
            id='vrsn'
            className='numberSet'
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
            placeholder='17947'
            autoFocus={true}
            required 
          /></label>
          
          <label htmlFor='soNum' className='breath'>{Pref.salesOrder} Alphanumeric<br />
          <input
            type='text'
            id='soNum'
            className='numberSet indenText'
            pattern='[A-Za-z0-9 \._-]*'
            maxLength='32'
            minLength='1'
            placeholder='xx00at70b'
            required
          /></label>
        </div>
        
        <div className='centreRow vmargin'>
          <label htmlFor='sDate' className='breath'>{Pref.start}<br />
          <input
            type='date'
            id='sDate'
            className='numberSet'
            defaultValue={moment().format('YYYY-MM-DD')}
            pattern='[0-9]{4}-[0-9]{2}-[0-9]{2}'
            required 
          /></label>
          <label htmlFor='eDate' className='breath'>{Pref.end}<br />
          <input
            type='date'
            id='eDate'
            className='numberSet'
            pattern='[0-9]{4}-[0-9]{2}-[0-9]{2}'
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
          /></label>
          
           {/*
            <PrioritySquareData
              batchID={batchId}
              app={app}
              mockDay={endDateState}
              showExtra={true} />
            */}
            
            
        </div>
        
        
        <div className='vmargin'>
          <button 
            type='submit' 
            className='action clear greenHover'
          >Create</button>
        </div>
      </form>
    </Model>
  );
};

export default BatchCreate;