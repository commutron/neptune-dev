import React, { useRef, useState, useEffect } from 'react';
import moment from 'moment';
import Pref from '/client/global/pref.js';
import { toast } from 'react-toastify';


const YMDItemForm = ({ 
  bID, seriesId, more, unit, app, 
  showToast, updateToast
})=> {
  
  const thingMounted = useRef(true);
  
  useEffect(() => {
    return () => { thingMounted.current = false; };
  }, []);
  
  const thisYear = moment().weekYear().toString().slice(-2);
  const thisMonth = ( moment().month() + 1 ).toString().padStart(2, 0);
  const thisDay = moment().date().toString().padStart(2, 0);
  
  const [ digitState, digitSet ] = useState(10);
  const [ flrWarn, flrWarnSet ] = useState('');
  const [ quWarn, quWarnSet ] = useState('');
  
  const [ previewData, previewSet ] = useState([]);
  const [ resultMess, resultSet ] = useState(false);
  

	function handleCheck(e) {
    e.preventDefault();
    resultSet(false);
    
    const tenDg = digitState === 10;
    
    const padSqu = (v)=> tenDg ? v.padStart(4, 0) : v.padStart(3, 0);
  
    const yearVal = this.yrDigits.value;
    const monthVal = this.moDigits.value.padStart(2, 0);
    const dayVal = this.dyDigits.value.padStart(2, 0);
    const year_month_day = yearVal + monthVal + dayVal;
    
    const sqStartVal = this.sqStDigits.value;
    const realStartVal = padSqu(sqStartVal);
    
    const quVal = this.quantDigits.value;
    
    const startLoop = year_month_day + realStartVal;
    const startLoopNum = parseInt(startLoop, 10);
    
    const endNum = parseInt(sqStartVal, 10) + parseInt(quVal, 10) - 1;
    const stopLoop = year_month_day + padSqu( endNum.toString() );
    const stopLoopNum = parseInt(stopLoop, 10);
    
    let tryData = [];
    
  	for(let tick = startLoopNum; tick <= stopLoopNum; tick++) {
      const serial = tick.toString();
      tryData.push(serial);
    }
  	
    previewSet(tryData);

    const floor = tenDg ? app.latestSerial.tenDigit :
                          app.latestSerial.nineDigit;
                          
    const flrChk = startLoopNum > floor ? false :
                   `Not in sequence (Below ${floor})`;
    flrWarnSet(flrChk);
    
    const quChk = tryData.length > 0 && tryData.length < 5000 ? 
                  false : 'Invalid Range';
    quWarnSet(quChk);       
                   
    !quChk ? this.goYMDSave.disabled = false : null;
    
    Roles.userIsInRole(Meteor.userId(), 'debug') &&
      console.log({ 
        year_month_day, quVal,
        startLoopNum, stopLoopNum, tryData
      });
	}
	
	
	function handleAdd(e) {
    if(previewData.length > 0) {
      this.goYMDSave.disabled = true;
      
      const seqLth = digitState;
      const unitVal = this.unitInput.value.trim();
      
      showToast();
      Meteor.call('addYearMonthDayItems', bID, seriesId, seqLth, previewData, unitVal,
      (error, reply)=>{
        if(error)
          console.log(error);
        if(reply.success === true) {
          updateToast();
          if(thingMounted.current) { resultSet(reply.dupes); }
        }else{
          toast.error('There was a problem...');
        }
      });
    }
	}
  
  const previewListStart = previewData.length > 20 ?
                            previewData.slice(0, 10) : previewData;
  
  const previewJoin = previewData.length > 20 ? '............' : '';
  
  const previewListEnd = previewData.length > 20 ?
                            previewData.slice(-3) : [];
    
  return(
    <div className='balance'>
        <form 
          className='fill'
          onSubmit={(e)=>handleCheck(e)} 
          autoComplete='off'>
          <p className='centreRow'>
            <label htmlFor='nineDigit' className='beside'>
              <input
                type='radio'
                id='nineDigit'
                name='digit'
                defaultChecked={digitState === 9}
                onChange={()=>digitSet(9)}
                required
              />9 digits</label>
            <label htmlFor='tenDigit' className='beside'>
              <input
                type='radio'
                id='tenDigit'
                name='digit'
                defaultChecked={digitState === 10}
                onChange={()=>digitSet(10)}
                required
              />10 digits</label>
          </p>
          
          <p>
            <input
              type='number'
              id='unitInput'
              className='miniIn18'
              pattern='[000-999]*'
              maxLength='3'
              minLength='1'
              max='250'
              min='1'
              defaultValue={unit}
              placeholder='1-250'
              inputMode='numeric'
              required />
            <label htmlFor='unitInput'
            >{Pref.unit}s <em>per serial number</em></label>
          </p>
          
          <p className='leftRow'>
            
            <label htmlFor='yrDigits'>
              <input
                id='yrDigits'
                className='miniIn6'
                pattern='[\d\d]*'
                maxLength='2'
                minLength='2'
                defaultValue={thisYear}
                placeholder={thisYear}
                inputMode='numeric'
                required 
              /><br />Year</label>
          
            <label htmlFor='wkDigits'>
              <input
                id='moDigits'
                className='miniIn6'
                pattern='[\d\d]*'
                maxLength='2'
                minLength='2'
                defaultValue={thisMonth}
                placeholder={thisMonth}
                inputMode='numeric'
                required
              /><br />Month</label>
         
            <label htmlFor='dyDigits'>
              <input
                id='dyDigits'
                className='miniIn6'
                pattern='[\d\d]*'
                maxLength='2'
                minLength='2'
                defaultValue={thisDay}
                placeholder={thisDay}
                inputMode='numeric'
                required
              /><br />Day</label>
          </p>
          
          <p>
            <input
              id='sqStDigits'
              className='miniIn18'
              pattern={digitState === 10 ? '[0000-9999]*' : '[000-999]*'}
              maxLength={digitState === 10 ? '4' : '3'}
              minLength='1'
              defaultValue={digitState === 10 ? 0001 : 001}
              placeholder={digitState === 10 ? 0001 : 001}
              inputMode='numeric'
              required />
            <label htmlFor='sqStDigits'
            >Sequence Starts At</label>
         </p>
            
          <p>
            <input
              id='quantDigits'
              className='miniIn18'
              pattern='[000-999]*'
              maxLength={digitState === 10 ? '4' : '3'}
              minLength='1'
              max={digitState === 10 ? 9999 : 999}
              min={1}
              defaultValue={1}
              placeholder={1}
              inputMode='numeric'
              required />
            <label htmlFor='quantDigits'>Total {Pref.items}</label>
          </p>
          
          <p className='centre'>
            <button
              id='goYMD'
              disabled={false}
              className='action clearGreen'
              type='submit'
            >Check</button>
          </p>
        </form>
        
      <div className='centre vspace'>
        <dl className='numFont letterSpaced noindent'>
          {previewListStart.map( (ent, ix)=>{
            return(<dd key={ix+'s'}>{ent}</dd>);
          })}
          <dd>{previewJoin}</dd>
          {previewListEnd.map( (ent, ix)=>{
            return(<dd key={ix+'e'}>{ent}</dd>);
          })}
        </dl>
        
        {flrWarn && <p>{flrWarn}</p>}
        {quWarn && <p>{quWarn}</p>}
        
        <p className='medBig'><i className='numFont big'>{previewData.length}</i> {Pref.itemSerial}s</p>
        <p className='centreText'><em>duplicate checking is done on the server</em></p>
        <p className='centre'>
          <button
            id='goYMDSave'
            disabled={false}
            className='action clearGreen'
            onClick={(e)=>handleAdd(e)}
          >Create</button>
        </p>
        <p>{resultMess && resultMess.length > 0 ? 
           'Duplicates / Bad Serial Numbers' : ''}
        </p>
        <p className='stringFit'>{resultMess ? resultMess.join(', ') : ''}</p>
      </div>
    </div>
  );
};
  
export default YMDItemForm;