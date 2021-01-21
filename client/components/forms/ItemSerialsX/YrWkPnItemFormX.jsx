import React, { useState } from 'react';
import moment from 'moment';
import Pref from '/client/global/pref.js';
import { toast } from 'react-toastify';


const YrWkPnItemFormX = ({ bID, seriesId, items, more, unit, app })=> {
  
  const thisYear = moment().weekYear().toString().slice(-2);
  const thisWeek = moment().week().toString().padStart(2, 0);
  
  const [ previewData, previewSet ] = useState([]);
  const [ resultMess, resultSet ] = useState(false);
  

	function handleCheck(e) {
    e.preventDefault();
    resultSet(false);
    
    const yearVal = this.yrDigits.value;
    const weekVal = this.wkDigits.value.padStart(2, 0);
    const year_week = yearVal + weekVal;
    
    const panelStartVal = this.pnlStDigits.value;
    
    const itemPerVal = this.pnlDigits.value;
    const itemPerNum = parseInt(itemPerVal, 10);
    
    const panelQuVal = this.quantDigits.value;
    
    const startLoop = year_week + panelStartVal.padStart(3, 0);
    const startLoopNum = parseInt(startLoop, 10);
    
    const endNum = parseInt(panelStartVal, 10) + parseInt(panelQuVal, 10) - 1;
    const stopLoop = year_week + endNum.toString().padStart(3, 0);
    const stopLoopNum = parseInt(stopLoop, 10);
    
    let itemLoop = [];
    for(let it = 1; it <= itemPerNum; it++) {
      itemLoop.push(it.toString());
    }
    
    let tryData = [];
    for(let tick = startLoopNum; tick <= stopLoopNum; tick++) {
      for( let tock of itemLoop ) {
        const serial = tick.toString() + tock.toString();
        tryData.push(serial);
      }
    }
    
    previewSet(tryData);
    
    this.goYrWkSave.disabled = false;
    
    Roles.userIsInRole(Meteor.userId(), 'debug') &&
      console.log({ 
        year_week, itemPerVal, panelQuVal,
        startLoopNum, stopLoopNum, itemLoop, tryData
      });
	}
	
	
	function handleAdd(e) {
    if(previewData.length > 0) {
      this.goYrWkSave.disabled = true;
      toast.warn('Please Wait For Confirmation...', {
          toastId: ( previewData[0] + 'pOp' ),
          autoClose: false
        });
      Meteor.call('addYearWeekPanelItemsX', bID, seriesId, previewData, (error, reply)=>{
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
              id='pnlStDigits'
              pattern='[\d\d\d]*'
              maxLength='3'
              minLength='3'
              defaultValue={001}
              placeholder={001}
              inputMode='numeric'
              required />
            <label htmlFor='pnlStDigits'>Panel Number Starts At</label>
          </p>
          
          <p>
            <input
              id='pnlDigits'
              pattern='[\d]*'
              maxLength='1'
              minLength='1'
              defaultValue={2}
              placeholder={2}
              inputMode='numeric'
              required />
            <label htmlFor='pnlDigits'>Number of {Pref.items} per panel</label>
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
            <label htmlFor='quantDigits'>Number of panels</label>
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
            id='goYrWkSave'
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
  
export default YrWkPnItemFormX;