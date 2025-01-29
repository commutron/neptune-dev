import React, { useRef, useState, useEffect } from 'react';
import moment from 'moment';
import Pref from '/client/global/pref.js';


const YrWkPnItemFormX = ({ 
  bID, seriesId, quantity, 
  app, isDebug, quantityCheck, showToast, updateToast
})=> {
  
  const thingMounted = useRef(true);
  
  useEffect(() => {
    return () => { thingMounted.current = false; };
  }, []);
  
  const thisYear = moment().weekYear().toString().slice(-2);
  const thisWeek = moment().week().toString().padStart(2, 0);
  
  const [ isPnl, isPnlSet ] = useState(true);
  const [ flrWarn, flrWarnSet ] = useState(false);
  const [ quWarn, quWarnSet ] = useState(false);
  
  const [ createLock, lockSet ] = useState(true);
  
  const [ previewData, previewSet ] = useState([]);
  const [ resultMess, resultSet ] = useState(false);
  

	function handleCheck(e) {
    e.preventDefault();
    resultSet(false);
    
    const padSqu = (v)=> isPnl ? v.padStart(3, 0) : v.padStart(4, 0);
  
    const yearVal = this.yrDigits.value;
    const weekVal = this.wkDigits.value.padStart(2, 0);
    const year_week = yearVal + weekVal;
    
    const panelStartVal = this.pnlStDigits.value;
    const realStartVal = padSqu(panelStartVal);
    
    const itemPerVal = isPnl ? this.pnlDigits.value : '0';
    const itemPerNum = parseInt(itemPerVal, 10);
    
    const panelQuVal = this.quantDigits.value;
    
    const startLoop = year_week + realStartVal;
    const startLoopNum = parseInt(startLoop, 10);
    
    const endNum = parseInt(panelStartVal, 10) + parseInt(panelQuVal, 10) - 1;
    const stopLoop = year_week + padSqu( endNum.toString() );
    const stopLoopNum = parseInt(stopLoop, 10);
    
    let itemLoop = [];
    let tryData = [];
    
    if(stopLoop.length !== (isPnl ? 7 : 8)) {
      previewSet([]);
      flrWarnSet(false);
      quWarnSet(`Sequence maximum (${isPnl ? "999" : "9999"}) exceeded`); 
      lockSet(true);
    }else{
      
      if(isPnl) {
        for(let it = 1; it <= itemPerNum; it++) {
          itemLoop.push(it.toString());
        }
        for(let tick = startLoopNum; tick <= stopLoopNum; tick++) {
          for( let tock of itemLoop ) {
            const serial = tick.toString() + tock.toString();
            tryData.push(serial);
          }
        }
    	}else{
    	  for(let tick = startLoopNum; tick <= stopLoopNum; tick++) {
          const serial = tick.toString();
          tryData.push(serial);
        }
    	}
      previewSet(tryData);
      
      const firstInSqu = tryData.length > 0 ? tryData[0] : 10000000;
      const floor = app.latestSerial.eightDigit;
                            
      const flrChk = firstInSqu > floor ? false :
                     `Warning: Out of sequence (Below ${floor})`;
      flrWarnSet(flrChk);
      
      const quChk = quantityCheck(tryData.length, quantity, startLoop, stopLoop);
      quWarnSet(quChk);       
      lockSet(!!quChk);
    }
    
    isDebug && console.log({ 
      year_week, itemPerVal, panelQuVal,
      startLoopNum, stopLoopNum, itemLoop, tryData
    });
	}
	
	
	function handleAdd() {
    if(previewData.length > 0) {
      lockSet(true);
      showToast();
      Meteor.call('addYearWeekPanelItemsX', bID, seriesId, previewData,
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
          <TwoDigits
            id='yrDigits'
            dfVal={thisYear}
            label='Year Number'
          />
          <TwoDigits
            id='wkDigits'
            dfVal={thisWeek}
            label='Week Number'
          />
          
          <p className='centreRow'>
            <Radio
              id='yesPnl'
              name='ynPanlSelect'
              label='Panels'
              dfVal={isPnl === true}
              chFunc={()=>isPnlSet(true)}
            />
            <Radio
              id='noPnl'
              name='ynPanlSelect'
              label='Singles'
              dfVal={isPnl === false}
              chFunc={()=>isPnlSet(false)}
            />
          </p>
          
          <p>
            <input
              id='pnlStDigits'
              className='miniIn18'
              pattern={isPnl ? '[000-999]*' : '[0000-9999]*'}
              maxLength={isPnl ? '3' : '4'}
              minLength='1'
              defaultValue={isPnl ? 001 : 0001}
              placeholder={isPnl ? 001 : 0001}
              inputMode='numeric'
              required />
            <label htmlFor='pnlStDigits'
            >{isPnl ? 'Panel' : 'Sequence'} Starts At</label>
         </p>
         
         {isPnl ?
         <p>
            <input
              id='pnlDigits'
              className='miniIn18'
              pattern='[\d]*'
              maxLength='1'
              minLength='1'
              defaultValue={2}
              placeholder={2}
              inputMode='numeric'
              required />
            <label htmlFor='pnlDigits'
            >{Pref.items} Per Panel</label>
          </p>
          : null}
            
          <p>
            <input
              id='quantDigits'
              className='miniIn18'
              pattern='[000-999]*'
              maxLength={isPnl ? '3' : '4'}
              minLength='1'
              max={isPnl ? 999 : 9999}
              min={1}
              defaultValue={1}
              placeholder={1}
              inputMode='numeric'
              required />
            <label htmlFor='quantDigits'>Total {isPnl ? 'Panels' : Pref.items}</label>
          </p>
          
          <p className='centre'>
            <button
              id='goYrWk'
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
        
        {flrWarn && <p>{flrWarn}</p>}
        {quWarn && <p>{quWarn}</p>}
        
        <p className='medBig'><i className='big'>{previewData.length}</i> {Pref.itemSerial}s</p>
        <p className='centreText'><em>duplicate checking is done on the server</em></p>
        <p className='centre'>
          <button
            id='goYrWkSave'
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
  
export default YrWkPnItemFormX;

const TwoDigits = ({ id, dfVal, label })=> (
  <p>
    <input
      id={id}
      className='miniIn18'
      pattern='[\d\d]*'
      maxLength='2'
      minLength='2'
      defaultValue={dfVal}
      placeholder={dfVal}
      inputMode='numeric'
      required />
    <label htmlFor={id}>{label}</label>
  </p>
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