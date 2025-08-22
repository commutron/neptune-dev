import React, { useState, useEffect } from 'react';
import moment from 'moment';
import Pref from '/client/global/pref.js';
import { toast } from 'react-toastify';

import ModelMedium from '/client/layouts/Models/ModelMedium';
import { toCap } from '/client/utility/Convert';

const QuoteTaskTime = ({ wID, flowKey, qtbB, lockOut, brancheS })=> {
  
  const access = Roles.userIsInRole(Meteor.userId(), ['sales', 'admin']);
  
  return(
    <ModelMedium
      button={Pref.timeBudget}
      title={Pref.timeBudget}
      color='blueT'
      icon='fa-money-check-dollar gapR'
      lgIcon={true}
      inline={true}
      lock={!access}>
      <QuoteTaskTimeForm
        wID={wID}
        flowKey={flowKey}
        qtbB={qtbB}
        auth={access}
        lockOut={lockOut}
        brancheS={brancheS}
      />
    </ModelMedium>
  );
};

export default QuoteTaskTime;

const QuoteTaskTimeForm = ({ wID, flowKey, qtbB, auth, lockOut, brancheS })=> {
  
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
  
  const inputMinutes = (e) => {
    const val = e.target.value;
    const inMin = parseFloat(val);
    breakSet({
      ...breakState,
      [e.target.name]: inMin
    });
  };

  
  const setBreakdown = (e)=> {
    e.preventDefault();
    const brkArray = Object.entries(breakState).filter( x => x[1] > 0);
    
    if(auth) {
      Meteor.call('setFlowQuoteTime', wID, flowKey, brkArray, (err, re)=>{
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
      
      <h3>{toCap(Pref.timeBudget, true)} Sub-Task Breakdown</h3>
      <p><em>Set in minutes</em></p>
     
      <form
        id='brkdwnqtb'
        className='centre overscroll'
        onSubmit={(e)=>setBreakdown(e)}
      >
        <div className='rightRow doJustWeen'>
          <label></label>
          <span className='beside'>
            {/*<label className='min6'>Hours</label>*/}
            <label className='min8'>Minutes</label>
            <label className='min8'>Seconds</label>
          </span>
        </div>
        <div className='rightRow doJustWeen vspace'>
          <label className='bold'>Sub-Task Sum</label>
          <span className='beside'>
            {/*<label className='gapL min6'>
              <i className='numberSet liteToolOff beside'
              >{moment.duration(breakState[op[0]] || 0, 'minutes').asHours().toFixed(2,10)}</i>
            </label>*/}
            <label className='gapL min8'>
              <i className={`numberSet liteToolOff beside`}
              >{subsumState.toFixed(1,10)}</i>
            </label>
            <label className='gapL min8'>
              <i className={`numberSet liteToolOff beside`}
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
          <span className='beside'>
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
