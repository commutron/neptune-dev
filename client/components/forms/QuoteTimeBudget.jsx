import React, { useState, useEffect } from 'react';
import moment from 'moment';
import Pref from '/client/global/pref.js';
import { toast } from 'react-toastify';

import ModelMedium from '/client/layouts/Models/ModelMedium';
import { toCap } from '/client/utility/Convert';

const QuoteTimeBudget = ({ bID, qtB, qtbB, lockOut, brancheS })=> {
  
  const access = Roles.userIsInRole(Meteor.userId(), ['sales', 'edit']);
  
  return(
    <ModelMedium
      button={Pref.timeBudget}
      title={Pref.timeBudget}
      color='blueT'
      icon='fa-hourglass-half gapR'
      lgIcon={true}
      inline={true}
      lock={!access}>
      <QuoteTimeBudgetForm
        bID={bID}
        qtB={qtB}
        qtbB={qtbB}
        auth={access}
        lockOut={lockOut}
        brancheS={brancheS}
      />
    </ModelMedium>
  );
};

export default QuoteTimeBudget;

const QuoteTimeBudgetForm = ({ bID, qtB, qtbB, auth, lockOut, brancheS })=> {
  
  const [ totalState, totalSet ] = useState(qtB || 0);
  
  const [ inputOps, inputOpsSet ] = useState([]);
  const [ breakState, breakSet ] = useState({});
  const [ subsumState, subsumSet ] = useState(0);
  
  useEffect( ()=>{
    let ops = qtbB || [];
    for( let br of brancheS.filter(b=>b.pro) ) {
      if(br.subTasks) {
        for( let sb of br.subTasks ) {
          if(!ops.find( x => x[0] === br.branch+"|"+sb )) {
            ops.push( [ br.branch+"|"+sb, 0 ] );
          }
        }
      }else{
        if(!ops.find( x => x[0] === br.branch+"|!X" )) {
          ops.push( [ br.branch+"|!X", 0 ] );
        }
      }
    }
    const opS = ops.sort( (a,b)=> a[0] > b[0] ? 1 : a[0] < b[0] ? -1 : 0);
    inputOpsSet(opS);
    
    const opsObj = opS.reduce((acc, curr, index) =>(acc[curr[0]] = curr[1], acc), {});
    breakSet(opsObj);
  }, []);
  
  useEffect( ()=>{
    const objArr = Object.entries(breakState);
    const arrTtl = objArr.reduce((x,y)=> x + y[1], 0);
    subsumSet( arrTtl );
  }, [breakState]);
  
  const inputHours = (val) => {
    const inHours = parseFloat(val);
    const inMinutes = isNaN(inHours) ? 0 : moment.duration(inHours, 'hours').asMinutes();
    totalSet(inMinutes);
  };
  
  const inputMinutes = (e) => {
    const val = e.target.value;
    const inMin = parseFloat(val);
    breakSet({
      ...breakState,
      [e.target.name]: inMin
    });
  };

  const setTimeInHours = (e)=> {
    e.preventDefault();
    if(auth) {
      Meteor.call('pushBatchXTimeBudget', bID, totalState, (err, re)=>{
        err && console.log(err);
        if(re) {
          toast.success('Saved');
        }else{
          toast.error('Server Error');
        }
      });
    }else{ toast.error('NO Permission'); }
  };
  
  const setBreakdown = (e)=> {
    e.preventDefault();
    const brkArray = Object.entries(breakState).filter( x => x[1] > 0);
    
    if(auth) {
      Meteor.call('setBatchXTimeBreakdown', bID, brkArray, (err, re)=>{
        err && console.log(err);
        if(re) {
          toast.success('Saved');
        }else{
          toast.error('Server Error');
        }
      });
    }else{ toast.error('NO Permission'); }
  };
  
  const aT = !auth ? Pref.norole : '';
  const lT = lockOut ? `${toCap(Pref.xBatch, true)} is locked` : '';

  return(
    <div className='centre'>
      {auth && !lockOut ? null : <p>{aT} {lT}</p>}
      <h3>{toCap(Pref.timeBudget, true)} Total</h3>
      <p><em>Set in hours, to 2 decimal places</em></p>
      <form id='totalqtb' onSubmit={(e)=>setTimeInHours(e)}>
        <p className='inlineForm'>
          <label>Hours<br />
          <input
            type='number'
            id='globalHourNum'
            className='numberSet miniIn12'
            pattern="^\d*(\.\d{0,2})?$"
            maxLength='7'
            minLength='1'
            max='10000'
            min='0.01'
            step=".01"
            inputMode='numeric'
            defaultValue={moment.duration(qtB, 'minutes').asHours()}
            disabled={!auth || lockOut}
            onInput={(e)=>inputHours(e.target.value)}
            required
          /></label>
          <label className='gapL min6'
          >Minutes<br /><i className='numberSet liteToolOff beside'>{totalState}</i>
          </label>
          {/*<label className='gapL min6'
          >Seconds<br /><i className='numberSet liteToolOff beside'>{moment.duration(totalState, 'minutes').asSeconds().toFixed(0,10)}</i>
          </label>*/}
        </p>
        <p>
          <button
            type='submit'
            // formMethod='dialog'
            id='goQTB'
            className='action nSolid numberSet minIn7 vmargin'
            disabled={!auth || lockOut}
          >Update Total {toCap(Pref.timeBudget, true)}</button>
        </p>
      </form>
      
      <h3>{toCap(Pref.timeBudget, true)} Sub-Task Breakdown</h3>
      <p><em>Set in minutes</em></p>
      {subsumState > totalState ? 
        <p className='redT bold'>Sum of sub-tasks is greater than total {Pref.timeBudget}.</p>
        : null}
      <form
        id='brkdwnqtb'
        className='centre overscroll'
        onSubmit={(e)=>setBreakdown(e)}
      >
        <div className='rightRow doJustWeen'>
          <label></label>
          <span className='middle'>
            {/*<label className='min6'>Hours</label>*/}
            <label className='min8'>Minutes</label>
            <label className='min8'>Seconds</label>
          </span>
        </div>
        <div className='rightRow doJustWeen vspace'>
          <label className='bold'>Sub-Task Sum</label>
          <span className='middle'>
            {/*<label className='gapL min6'>
              <i className='numberSet liteToolOff beside'
              >{moment.duration(breakState[op[0]] || 0, 'minutes').asHours().toFixed(2,10)}</i>
            </label>*/}
            <label className='gapL min8'>
              <i className={`numberSet liteToolOff beside ${subsumState > totalState ? 'redT' : ''}`}
              >{subsumState.toFixed(1,10)}</i>
            </label>
            <label className='gapL min8'>
              <i className={`numberSet liteToolOff beside ${subsumState > totalState ? 'redT' : ''}`}
              >{moment.duration(subsumState || 0, 'minutes').asSeconds().toFixed(0,10)}</i>
            </label>
          </span>
        </div>
        {inputOps.map( (op, index)=>(
          <div 
            key={index}
            className='w100 split doJustWeen breaklines'
          >
          <label>{op[0].split('|')[0]} {op[0].split('|')[1] === '!X' ? null : op[0].split('|')[1]}</label>
          <span className='middle'>
            {/*<label className='gapL min6'>
              <i className='numberSet liteToolOff beside'
              >{moment.duration(breakState[op[0]] || 0, 'minutes').asHours().toFixed(2,10)}</i>
            </label>*/}
            <label className='gapL'>
              <input
                  type='number'
                  id={op[0]}
                  name={op[0]}
                  className='numberSet miniIn8'
                  pattern="^\d*(\.\d{0,2})?$"
                  maxLength='8'
                  minLength='1'
                  max='100000'
                  min='0'
                  step=".1"
                  inputMode='numeric'
                  defaultValue={op[1] || null}
                  disabled={!auth || lockOut}
                  onChange={(e)=>inputMinutes(e)}
                />
            </label>
            <label className='gapL min8'>
              <i className='numberSet liteToolOff beside'
              >{moment.duration(breakState[op[0]] || 0, 'minutes').asSeconds().toFixed(0,10)}</i>
            </label>
          </span>
          </div>
        ))}
        <p className='vmargin'>
          <button
            type='submit'
            // formMethod='dialog'
            id='goQTBB'
            className='action nSolid numberSet minIn7'
            disabled={!auth || lockOut}
          >Update {toCap(Pref.timeBudget, true)} Breakdown</button>
        </p>
      </form>
    </div>
  );
};
