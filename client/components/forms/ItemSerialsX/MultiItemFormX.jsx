import React, { useState } from 'react';
import moment from 'moment';
import Pref from '/client/global/pref.js';
import { toast } from 'react-toastify';

const MultiItemFormX = ({ bID, seriesId, unit, app })=> {
  
  const [ digitState, digitSet ] = useState(10);
  const [ workState, workSet ] = useState(false);
  const [ resultMess, resultSet ] = useState(false);
  
  function checkRange(e) {
    const barStart = this.barNumStart.value.trim();
    const barEnd = this.barNumEnd.value.trim();
    const unitVal = this.unitInput.value.trim();
    
    const floor = digitState === 10 ? app.latestSerial.tenDigit :
                  digitState === 9 ? app.latestSerial.nineDigit :
                  app.latestSerial.eightDigit;
    
    let first = parseInt(barStart, 10);
    let last = parseInt(barEnd, 10);
    
    // get how many items to create and +1 corection
    let count = last - first + 1;
    
    // validate the count
    let valid = false;
    
    if(
      !isNaN(count)
      &&
      count >= 1 && count <= 5000
      &&
      unit <= 1000
    ) {
      valid = true;
    }else{
      valid = false;
    }
    
    // enable or disable submit button
    if(valid) {
      this.addGo.disabled = false;
    }else{
      this.addGo.disabled = true;
    }
    first <= floor ? 
      this.floorCheck.value = 'Please begin above ' + floor : 
      this.floorCheck.value = '';
    // display quantity
    let quantity = isNaN(count) ? 'Not a number' : 
                   count < 1 ? 'Invalid Range' :
      `${count} serial number${count == 1 ? '' : 's'} == 
        ${count*unitVal} ${Pref.item}${count*unitVal == 1 ? '' : 's'}`;
    this.message.value = quantity;
  }

	function addItem(e) {
    e.preventDefault();
    this.addGo.disabled = true;
    workSet(true);
    this.message.value = 'Working...';
    
    const batchId = bID;
    const seqLth = digitState;
    
    const barStart = this.barNumStart.value.trim();
    const barEnd = this.barNumEnd.value.trim();
    const unitVal = this.unitInput.value.trim();
  
    const barFirst = parseInt(barStart, 10);
    const barLast = parseInt(barEnd, 10);

    Meteor.call('addMultiItemsX', batchId, seriesId, seqLth, barFirst, barLast, unitVal, 
    (error, reply)=>{
      if(error)
        console.log(error);
      if(reply.success === true) {
        toast.success('Saved');
        this.unitInput.value = unit;
        this.barNumStart.value = moment().format('YYMMDD');
        this.barNumEnd.value = moment().format('YYMMDD');
        workSet(false);
        resultSet(reply.dupes);
        this.message.value = reply.message;
      }else{
        toast.warning('There was a problem...');
        resultSet(reply.dupes);
        this.message.value = reply.message;
        console.log(reply.message);
        workSet(false);
      }
    });
	}

  const today = moment().format('YYMMDD');
  let iconSty = workState ? 'workIcon' : 'transparent';
    
  return(
    <form className='centre' onSubmit={(e)=>addItem(e)} autoComplete='off'>
      <p>
        <input
          type='radio'
          id='eightDigit'
          name='digit'
          defaultChecked={digitState === 8}
          onChange={()=>digitSet(8)}
          required />
        <label htmlFor='eightDigit' className='beside'>8 digits</label>
      <br />
      <input
          type='radio'
          id='nineDigit'
          name='digit'
          defaultChecked={digitState === 9}
          onChange={()=>digitSet(9)}
          required />
        <label htmlFor='nineDigit' className='beside'>9 digits</label>
      <br />
        <input
          type='radio'
          id='tenDigit'
          name='digit'
          defaultChecked={digitState === 10}
          onChange={()=>digitSet(10)}
          required />
        <label htmlFor='tenDigit' className='beside'>10 digits</label>
      </p>
      <p>
        <input
          type='number'
          id='unitInput'
          pattern='[000-999]*'
          maxLength='3'
          minLength='1'
          max='250'
          min='1'
          defaultValue={unit}
          placeholder='1-250'
          inputMode='numeric'
          required
          onInput={(e)=>checkRange(e)} />
        <label htmlFor='unitInput'>{Pref.unit}s <em>Quantity per serial number</em></label>
      </p>
      <p>
        <input
          type='text'
          id='barNumStart'
          pattern='[0000000000-9999999999]*'
          maxLength={digitState}
          minLength={digitState}
          placeholder='1000000000-9999999999'
          defaultValue={today}
          inputMode='numeric'
          required
          onInput={(e)=>checkRange(e)} />
        <label htmlFor='barNumStart'>First {Pref.item} Number</label>
      </p>
      <p>
        <input
          type='text'
          id='barNumEnd'
          pattern='[0000000000-9999999999]*'
          maxLength={digitState}
          minLength={digitState}
          placeholder='1000000000-9999999999'
          defaultValue={today}
          inputMode='numeric'
          required
          onInput={(e)=>checkRange(e)} />
        <label htmlFor='barNumEnd'>Last {Pref.item} Number</label>
      </p>
      <br />
      <div className='centre'>
        <i className={iconSty}></i>
        <output id='floorCheck' value='' />
        <output id='message' value='' />
      </div>
      <br />
      <p className='centre'>
        <button
          id='addGo'
          disabled={true}
          className='action clearGreen'
          type='submit'
        >Add</button>
      </p>
      
      <p>{resultMess && resultMess.length > 0 ? 'DUPLICATES' : ''}</p>
      <p className='stringFit'>{resultMess ? resultMess.join(', ') : ''}</p>
      
    </form>
  );
};

export default MultiItemFormX;