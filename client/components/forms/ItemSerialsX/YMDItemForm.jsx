import React, { useRef, useState, useEffect } from 'react';
import moment from 'moment';
import Pref from '/client/global/pref.js';

const YMDItemForm = ({ 
  bID, seriesId, unit, quantity, 
  app, isDebug, quantityCheck, showToast, updateToast
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
  
  const [ createLock, lockSet ] = useState(true);
  
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
    
    if(stopLoop.length !== digitState) {
      previewSet([]);
      flrWarnSet(false);
      quWarnSet(`Format maximum (${tenDg ? "9999" : "999"}) exceeded`);     
      lockSet(true);
    }else{
      
    	for(let tick = startLoopNum; tick <= stopLoopNum; tick++) {
        const serial = tick.toString();
        tryData.push(serial);
      }
      previewSet(tryData);
  
      const floor = tenDg ? app.latestSerial.tenDigit :
                            app.latestSerial.nineDigit;
           
      const flrChk = startLoopNum > floor ? false :
                     `Warning: Out of sequence (Below ${floor})`;
      flrWarnSet(flrChk);
      
      const quChk = quantityCheck(tryData.length, quantity, startLoop, stopLoop);
      quWarnSet(quChk);       
      lockSet(!!quChk);
    }
    
    isDebug && console.log({ 
      year_month_day, quVal, startLoopNum, stopLoopNum, tryData
    });
	}
	
	function handleAdd() {
    if(previewData.length > 0) {
      lockSet(true);
      
      const seqLth = digitState;
      const unitVal = this.unitInput.value.trim();
      
      showToast();
      Meteor.call('addYearMonthDayItems', bID, seriesId, seqLth, previewData, unitVal,
      (error, reply)=>{
        error && console.log(error);
        updateToast(reply);
        if(thingMounted.current) { resultSet(reply.dupes); }
      });
    }
	}
  
  const previewListStart = previewData.length > 20 ?
                            previewData.slice(0, 10) : previewData;
  
  const previewJoin = previewData.length > 20 ? '............' : '';
  
  const previewListEnd = previewData.length > 20 ?
                            previewData.slice(-3) : [];
    
  return(
    <div className='balance gapsC min750'>
      <form 
        className='fill'
        onSubmit={(e)=>handleCheck(e)} 
        autoComplete='off'>
        <p className='centreRow'>
          <Radio
            id='nineDigit'
            name='digit'
            label='9 digits'
            dfVal={digitState === 9}
            chFunc={()=>digitSet(9)}
          />
          <Radio
            id='tenDigit'
            name='digit'
            label='10 digits'
            dfVal={digitState === 10}
            chFunc={()=>digitSet(10)}
          />
        </p>
          
          <p>
            <input
              type='number'
              id='unitInput'
              className='miniIn18'
              pattern='[0000-9999]*'
              maxLength='3'
              minLength='1'
              max={Pref.unitLimit}
              min='1'
              defaultValue={unit}
              placeholder='1-1000'
              inputMode='numeric'
              required />
            <label htmlFor='unitInput'
            >{Pref.unit}s <em>per serial number</em></label>
          </p>
          
          <p className='leftRow'>
            <TwoDigits
              id='yrDigits'
              label='Year'
              dfVal={thisYear}
            />
            <TwoDigits
              id='moDigits'
              label='Month'
              dfVal={thisMonth}
            />
            <TwoDigits
              id='dyDigits'
              label='Day'
              dfVal={thisDay}
            />
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
              className='action blackSolid'
              type='submit'
            >Check</button>
          </p>
        </form>
        
      <div className='centre vspace numFont max500'>
        <dl className='letterSpaced noindent'>
          {previewListStart.map( (ent, ix)=>{
            return(<dd key={ix+'s'}>{ent}</dd>);
          })}
          <dd>{previewJoin}</dd>
          {previewListEnd.map( (ent, ix)=>{
            return(<dd key={ix+'e'}>{ent}</dd>);
          })}
        </dl>
        
        {flrWarn && <p className='yellowGlow'>{flrWarn}</p>}
        {quWarn && <p className='redGlow'>{quWarn}</p>}
        
        <p className='medBig'><i className='big'>{previewData.length}</i> {Pref.itemSerial}s</p>
        <p className='centreText'><em>duplicate checking is done on the server</em></p>
        <p className='centre'>
          <button
            id='goYMDSave'
            disabled={createLock}
            className='action nSolid'
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

const TwoDigits = ({ id, label, dfVal })=>(
  <label htmlFor={id}>
    <input
      id={id}
      className='miniIn6'
      pattern='[\d\d]*'
      maxLength='2'
      minLength='2'
      defaultValue={dfVal}
      placeholder={dfVal}
      inputMode='numeric'
      required 
    /><br />{label}</label>
);

const Radio = ({ id, name, label, dfVal, chFunc })=> (
  <label htmlFor={id} className='beside'>
    <input
      type='radio'
      id={id}
      name={name}
      defaultChecked={dfVal}
      onChange={chFunc}
      required
    />{label}</label>
);