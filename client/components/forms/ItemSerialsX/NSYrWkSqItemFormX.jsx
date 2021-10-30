import React, { useRef, useState, useEffect } from 'react';
import moment from 'moment';
import Pref from '/client/global/pref.js';


const NSYrWkSqItemFormX = ({ 
  bID, seriesId, quantity,
  app, isDebug, quantityCheck, showToast, updateToast
})=> {
  
  const thingMounted = useRef(true);
  
  useEffect(() => {
    return () => { thingMounted.current = false; };
  }, []);
  
  const thisYear = moment().weekYear().toString().slice(-2);
  const thisWeek = moment().week().toString().padStart(2, 0);
  
  const [ flrWarn, flrWarnSet ] = useState(false);
  const [ quWarn, quWarnSet ] = useState(false);
  
  const [ createLock, lockSet ] = useState(true);
  
  const [ previewData, previewSet ] = useState([]);
  const [ resultMess, resultSet ] = useState(false);
  

	function handleCheck(e) {
    e.preventDefault();
    resultSet(false);
    
    const manNum = '03';
    
    const lotVal = this.lotDigits.value; // 1234
    
    const yearVal = this.yrDigits.value;
    const weekVal = this.wkDigits.value.padStart(2, 0);
    
    const man_lot_year_week = manNum + lotVal + '-' + yearVal + weekVal;
    
    const seqStVal = this.seqStDigits.value;
    
    const weekQuVal = this.quantDigits.value;
    
    const startLoop = seqStVal.padStart(3, 0);
    const startLoopNum = parseInt(startLoop, 10);
    
    const endNum = parseInt(seqStVal, 10) + parseInt(weekQuVal, 10) - 1;
    const stopLoop = endNum.toString().padStart(3, 0);
    const stopLoopNum = parseInt(stopLoop, 10);
    
    let tryData = [];
    
    if(stopLoop.length !== 3) {
      previewSet([]);
      flrWarnSet(`Sequence maximum (999) exceeded`);
      quWarnSet(`${man_lot_year_week + startLoop} to 
                 ${man_lot_year_week + stopLoop} > serial limit`);       
      lockSet(true);
    }else{
      
      for(let tick = startLoopNum; tick <= stopLoopNum; tick++) {
        const serial = man_lot_year_week + tick.toString().padStart(3, 0);
        tryData.push(serial);
      }
      
      previewSet(tryData);
      
      const quChk = quantityCheck(tryData.length, quantity, startLoop, stopLoop);
      quWarnSet(quChk);
      lockSet(!!quChk);
    }
    
    // const regexNS = RegExp(/^(\d{6}\-\d{7})$/);
    isDebug && console.log({ 
        man_lot_year_week, seqStVal, weekQuVal,
        startLoopNum, stopLoopNum, tryData
      });
	}
	
	
	function handleAdd(e) {
    if(previewData.length > 0) {
      lockSet(true);
      showToast();
      Meteor.call('addSourceYearWeekSeqItemsX', bID, seriesId, previewData, 
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
    <div className='balance gapsC'>
      <form 
        className='fill'
        onSubmit={(e)=>handleCheck(e)} 
        autoComplete='off'>
        <p>
          <input
            id='manDigits'
            className='miniIn18'
            pattern='[\d\d]*'
            maxLength='2'
            minLength='2'
            defaultValue='03'
            inputMode='numeric'
            disabled />
          <label htmlFor='manDigits'>Manufacture Number</label>
        </p>
        <p>
          <input
            id='lotDigits'
            className='miniIn18'
            pattern='[\d\d\d\d]*'
            maxLength='4'
            minLength='4'
            placeholder='from the sales order'
            inputMode='numeric'
            required />
          <label htmlFor='lotDigits'>Lot Number</label>
        </p>
        {/* DASH CHARACTER */}
        <p>
          <input
            id='yrDigits'
            className='miniIn18'
            pattern='[\d\d]*'
            maxLength='2'
            minLength='2'
            defaultValue={thisYear}
            placeholder={thisYear}
            inputMode='numeric'
            required />
          <label htmlFor='yrDigits'>Year Number</label>
        </p>
        <p>
          <input
            id='wkDigits'
            className='miniIn18'
            pattern='[\d\d]*'
            maxLength='2'
            minLength='2'
            defaultValue={thisWeek}
            placeholder={thisWeek}
            inputMode='numeric'
            required />
          <label htmlFor='wkDigits'>Week Number</label>
        </p>
        
        <p>
          <input
            id='seqStDigits'
            className='miniIn18'
            pattern='[\d\d\d]*'
            maxLength='3'
            minLength='3'
            defaultValue='001'
            placeholder='001'
            inputMode='numeric'
            required />
          <label htmlFor='seqStDigits'>Sequence Number Starts At</label>
        </p>
            
        <p>
          <input
            id='quantDigits'
            className='miniIn18'
            pattern='[000-999]*'
            maxLength='3'
            minLength='1'
            max={999}
            min={1}
            defaultValue={1}
            placeholder={1}
            inputMode='numeric'
            required />
          <label htmlFor='quantDigits'>Number of Serial Numbers</label>
        </p>
        
        <p className='centre'>
          <button
            id='goYrWk'
            disabled={false}
            className='action clearBlack'
            type='submit'
          >Check</button>
        </p>
      </form>
        
      <div className='centre vspace numFont'>
        <dl className='letterSpaced noindent'>
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
        
        <p className='medBig'><i className='big'>{previewData.length}</i> {Pref.itemSerial}s</p>
        <p className='centreText'><em>duplicate checking is done on the server</em></p>
        <p className='centre'>
          <button
            id='goNS13Save'
            disabled={createLock}
            className='action clearBlue'
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
  
export default NSYrWkSqItemFormX;