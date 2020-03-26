import React, { useState } from 'react';
import moment from 'moment';
import Pref from '/client/global/pref.js';
import { toast } from 'react-toastify';

// required data
//// batch id as props.id
/// items array as props.items
/// props.more as true or false

const YrWkPnItemForm = ({ id, items, more, unit, app, noText })=> {
  
  const thisYear = moment().weekYear().toString().slice(-2);
  const thisWeek = moment().week();
  
  const [ previewData, previewSet ] = useState([]);
  const [ resultMess, resultSet ] = useState(false);
  

	function handleCheck(e) {
    e.preventDefault();
    resultSet(false);
    
    const yearVal = this.yrDigits.value;
    const weekVal = this.wkDigits.value;
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
    
    Roles.userIsInRole(Meteor.userId(), 'debug') &&
      console.log({ 
        year_week, itemPerVal, panelQuVal,
        startLoopNum, stopLoopNum, itemLoop, tryData
      });
	}
	
	
	function handleAdd(e) {
    if(previewData.length > 0) {
      Meteor.call('addYearWeekPanelItems', id, previewData, (error, reply)=>{
        if(error)
          console.log(error);
        if(reply.success === true) {
          toast.success('Saved');
          resultSet(reply.dupes);
        }else{
          toast.warning('There was a problem...');
        }
      });
    }
	}
  
  const previewListStart = previewData.length > 20 ?
                            previewData.slice(0, 10) : previewData;
  
  const previewJoin = previewData.length > 20 ? '............' : '';
  
  const previewListEnd = previewData.length > 20 ?
                            previewData.slice(-5) : [];
    
  return(
    <div>
      <div className='balance'>
        <form onSubmit={(e)=>handleCheck(e)} autoComplete='off'>
          <p>
            <input
              type='number'
              id='yrDigits'
              pattern='[00-99]*'
              maxLength='2'
              minLength='2'
              max='99'
              min='01'
              defaultValue={thisYear}
              placeholder={thisYear}
              inputMode='numeric'
              required />
            <label htmlFor='yrDigits'>Year Number</label>
          </p>
          <p>
            <input
              type='number'
              id='wkDigits'
              pattern='[00-99]*'
              maxLength='2'
              minLength='2'
              max='99'
              min='01'
              defaultValue={thisWeek}
              placeholder={thisWeek}
              inputMode='numeric'
              required />
            <label htmlFor='wkDigits'>Week Number</label>
          </p>
          
          <p>
            <input
              type='number'
              id='pnlStDigits'
              pattern='[000-999]*'
              maxLength='3'
              minLength='3'
              max='999'
              min='001'
              defaultValue={001}
              placeholder={001}
              inputMode='numeric'
              required />
            <label htmlFor='pnlStDigits'>Panel Number Starts At</label>
          </p>
          
          <p>
            <input
              type='number'
              id='pnlDigits'
              pattern='[0-9]*'
              maxLength='1'
              minLength='1'
              max='9'
              min='2'
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
              maxLength='3'
              minLength='3'
              max='999'
              min='001'
              defaultValue={1}
              placeholder={1}
              inputMode='numeric'
              required />
            <label htmlFor='quantDigits'>Number of panels</label>
          </p>
          
          <br />
          
          <p className='centre'>
            <button
              id='goYrWk'
              disabled={false}
              className='action clearGreen'
              type='submit'
            >Check</button>
          </p>
        </form>
        <div className='space'>
          <dl>
            <dt>{previewData.length} {Pref.itemSerial}s</dt>
            {previewListStart.map( (ent, ix)=>{
              return(<dd key={ix+'s'}>{ent}</dd>);
            })}
            <dd>{previewJoin}</dd>
            <dd>{previewJoin}</dd>
            {previewListEnd.map( (ent, ix)=>{
              return(<dd key={ix+'e'}>{ent}</dd>);
            })}
          </dl>
        
        </div>
      </div>
      
      <div>
        <p className='centreText'><em>duplicate checking is done on the server</em></p>
        <p className='centre'>
          <button
            id='goYrWkSave'
            disabled={previewData.length === 0}
            className='action clearGreen'
            onClick={(e)=>handleAdd(e)}
          >ADD</button>
        </p>
        <p>{resultMess && resultMess.length > 0 ? 'DUPLICATES' : ''}</p>
        <p>{resultMess ? resultMess.toString() : ''}</p>
      </div>
    </div>
  );
};
  
export default YrWkPnItemForm;