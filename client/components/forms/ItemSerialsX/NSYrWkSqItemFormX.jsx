import React, { useState } from 'react';
import moment from 'moment';
import Pref from '/client/global/pref.js';
import { toast } from 'react-toastify';


const NSYrWkSqItemFormX = ({ bID, seriesId, items, more, unit, app, isDebug })=> {
  
  const thisYear = moment().weekYear().toString().slice(-2);
  const thisWeek = moment().week().toString().padStart(2, 0);
  
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
    for(let tick = startLoopNum; tick <= stopLoopNum; tick++) {
        const serial = man_lot_year_week + tick.toString().padStart(3, 0);
        tryData.push(serial);
    }
    
    previewSet(tryData);
    
    this.goNS13Save.disabled = false;
    // const regexNS = RegExp(/^(\d{6}\-\d{7})$/);
    // const found = regexNS.test(tryData[0]);
    
    isDebug && console.log({ 
      man_lot_year_week, seqStVal, weekQuVal,
      startLoopNum, stopLoopNum, tryData
    });
	}
	
	
	function handleAdd(e) {
    if(previewData.length > 0) {
      this.goNS13Save.disabled = true;
      toast.warn('Please Wait For Confirmation...', {
          toastId: ( previewData[0] + 'pOp' ),
          autoClose: false
        });
      Meteor.call('addSourceYearWeekSeqItemsX', bID, seriesId, previewData, (error, reply)=>{
        if(error)
          console.log(error);
        if(reply.success === true) {
          toast.update(( previewData[0] + 'pOp' ), {
            render: "Serials Created Successfully",
            type: toast.TYPE.SUCCESS,
            autoClose: 3000
          });
          resultSet(reply.dupes);
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
        <p>
          <input
            id='manDigits'
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
            type='number'
            id='quantDigits'
            pattern='[000-999]*'
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
        <p className='medBig'><i className='numFont big'>{previewData.length}</i> {Pref.itemSerial}s</p>
        <p className='centreText'><em>duplicate checking is done on the server</em></p>
        <p className='centre'>
          <button
            id='goNS13Save'
            disabled={previewData.length === 0}
            className='action clearGreen'
            onClick={(e)=>handleAdd(e)}
          >Create</button>
        </p>
        <p>{resultMess && resultMess.length > 0 ? 'DUPLICATES' : ''}</p>
        <p className='stringFit'>{resultMess ? resultMess.join(', ') : ''}</p>
      </div>
    </div>
  );
};
  
export default NSYrWkSqItemFormX;