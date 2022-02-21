import React, { useState, useEffect } from 'react';
import moment from 'moment';
import Pref from '/client/global/pref.js';
import { toast } from 'react-toastify';

import ModelMedium from '../smallUi/ModelMedium';
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

const QuoteTimeBudgetForm = ({ bID, qtB, qtbB, auth, lockOut, brancheS, selfclose })=> {
  
  const [ totalState, totalSet ] = useState(qtB || 0);
  
  const [ inputOps, inputOpsSet ] = useState([]);
  const [ breakState, breakSet ] = useState({});
  
  useEffect( ()=>{
    let ops = qtbB || [];
    for( let br of brancheS ) {
      if(br.subTasks) {
        for( let sb of br.subTasks ) {
          if(!ops.find( x => x[0] === br.branch+"|"+sb )) {
            ops.push( [ br.branch+"|"+sb, 0 ] );
          }
        }
      }
    }
    const opS = ops.sort( (a,b)=> a[0] > b[0] ? 1 : a[0] < b[0] ? -1 : 0);
    inputOpsSet(opS);
    
    const opsObj = opS.reduce((acc, curr, index) =>(acc[curr[0]] = curr[1], acc), {});
    breakSet(opsObj);
    
    // for(let op in opsObj) {
    //   const df = qtbB.find( x => x[0] === op );
    //   if(df) {
    //     opsObj[op] = df[1];
    //   }
    // }
    // console.log(opsObj);
    
  }, []);
  
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
          toast.success('Saved');// selfclose();
        }else{
          toast.error('Server Error');
        }
      });
      e.target.hourNum.value = '';
    }else{ toast.error('NO Permission'); }
  };
  
  const setBreakdown = (e)=> {
    e.preventDefault();
    
    const brkArray = Object.entries(breakState).filter( x => x[1] > 0);
    
    if(auth) {
      Meteor.call('setBatchXTimeBreakdown', bID, brkArray, (err, re)=>{
        err && console.log(err);
        if(re) {
          toast.success('Saved');// selfclose();
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
      <h4>{toCap(Pref.timeBudget, true)} Total</h4>
      <p>Set in hours, to 2 decimal places</p>
      <form
        id='totalqtb'
        className='overscroll'
        onSubmit={(e)=>setTimeInHours(e)}
      >
        <p className='inlineForm'>
          <label>Hours<br />
          <input
            type='number'
            id='hourNum'
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
            onInput={(e)=>inputHours(this.hourNum.value)}
            required
          /></label>
          <label className='gapL min6'
          >Minutes<br /><i className='numberSet liteToolOff beside'>{totalState}</i>
          </label>
        </p>
        <p>
          <button
            type='submit'
            id='goQTB'
            className='action clearBlue numberSet minIn7'
            disabled={!auth || lockOut}
          >Update Total {toCap(Pref.timeBudget, true)}</button>
        </p>
      </form>
      
      <h4>{toCap(Pref.timeBudget, true)} Breakdown</h4>
      <p>Set in minutes</p>
      <form
        id='brkdwnqtb'
        className='centre overscroll'
        onSubmit={(e)=>setBreakdown(e)}
      >
        <div className='rightRow doJustWeen'>
          <label>Sub-task</label>
          <span className='middle'>
            <label className='min6'>Hours</label>
            <label className='min8'>Minutes</label>
          </span>
        </div>
        {inputOps.map( (op, index)=>(
          <div 
            key={index}
            className='rightRow doJustWeen breaklines'
          >
          <label>{op[0].split('|')[0]} {op[0].split('|')[1]}</label>
          <span className='middle'>
          <label className='gapL'>
            <i className='numberSet liteToolOff beside'
            >{moment.duration(breakState[op[0]] || 0, 'minutes').asHours().toFixed(2,10)}</i>
          </label>
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
          </span>
          </div>
        ))}
        <p>
          <button
            type='submit'
            id='goQTBB'
            className='action clearBlue numberSet minIn7'
            disabled={!auth || lockOut}
          >Update {toCap(Pref.timeBudget, true)} Breakdown</button>
        </p>
      </form>
    </div>
  );
};
