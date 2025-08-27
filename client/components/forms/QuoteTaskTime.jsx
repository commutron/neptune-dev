import React, { useState, useEffect } from 'react';
import moment from 'moment';
import Pref from '/client/global/pref.js';
import { toast } from 'react-toastify';

import ModelNative from '/client/layouts/Models/ModelNative';

import { toCap } from '/client/utility/Convert';

const QuoteTaskTime = ({ 
  id, flowKey, existFlows, app, access, clearOnClose
})=> {
  
  const [ warn, warnSet ] = useState(false);
  const [ base, baseSet ] = useState(false);
  
  const [ inputOps, inputOpsSet ] = useState([]);
  const [ breakState, breakSet ] = useState({});
  const [ subsumState, subsumSet ] = useState(0);
  
  
  const [ flow, flowSet ] = useState(false);
  
   useEffect( ()=> {
    if(!flowKey) {
      warnSet(false);
      baseSet(false);
      flowSet(false);
    }else{
      const fill = existFlows.find( f => f.flowKey === flowKey );
      fill ? baseSet(fill) : null;
      
      Meteor.call('activeFlowCheck', flowKey, (error, reply)=>{
        error && console.log(error);
        warnSet(reply);
      });
    }
  }, [flowKey]);
  
  useEffect( ()=>{
    const qtS = app.qtTasks.sort( (a,b)=> a.position > b.position ? -1 : a.position < b.position ? 1 : 0);
    let ops = [];
    for( let qt of qtS ) {
      const qtbr = app.branches.find( b => b.brKey === qt.brKey );
      if(qtbr && qtbr.open && qtbr.pro ) {
        ops.push( [ qt.qtKey, qt.qtTask, qt.subTasks.join(', '), 0 ] );
      }
    }
    inputOpsSet(ops);
    
    // const opsObj = ops.reduce((acc, curr) =>(acc[curr[0]] = curr[3], acc), {});
    // breakSet(opsObj);
  }, []);
  
  // useEffect( ()=>{
  //   const objArr = Object.entries(breakState);
  //   const arrTtl = objArr.reduce((x,y)=> x + y[3], 0);
  //   subsumSet( arrTtl );
  // }, [breakState]);
  
  const inputMinutes = (e) => {
    const val = e.target.value;
    const inMin = parseFloat(val);
    breakSet({
      ...breakState,
      [e.target.name]: inMin
    });
  };
  
  const setQtFlow = (e)=> {
    e.preventDefault();
    const brkArray = Object.entries(breakState).filter( x => x[1] > 0);
    
    if(access) {
      Meteor.call('setFlowQuoteTime', id, flowKey, brkArray, (err, re)=>{
        err && console.log(err);
        if(re) {
          toast.success('Saved');
        }else{
          toast.error('Server Error');
        }
      });
    }else{ toast.error('NO Permission'); }
  };
  
  const aT = !access ? Pref.norole : '';
  const lT = !access ? `${toCap(Pref.xBatch, true)} is locked` : '';

  const fTitle = base ? base.title : '';
  const fFlow = base ? base.flow : false;

  return(
    <ModelNative
      dialogId={id+'_flowquote_form'}
      title='Assign Quoted Time'
      icon='fa-solid fa-gem'
      colorT='blueT'
      closeFunc={()=>clearOnClose()}>
      <div className='centre'>
        {access ? null : <p>{aT} {lT}</p>}
        
        <h3>{toCap(Pref.timeBudget, true)} Qt-Task Budget</h3>
        <p><em>Set in minutes</em></p>
       
        <form
          id='qttbgt'
          className='centre overscroll'
          onSubmit={(e)=>setQtFlow(e)}
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
            <label className='bold'>Qt-Task Sum</label>
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
            <label>{op[1]}</label>
            <span className='beside'>
              {/*<label className='gapL min6'>
                <i className='numberSet liteToolOff beside'
                >{moment.duration(breakState[op[0]] || 0, 'minutes').asHours().toFixed(2,10)}</i>
              </label>*/}
              <label className='gapL'>
                <input
                    type='number'
                    id={op[0]}
                    name={op[1]}
                    className='numberSet miniIn8'
                    pattern="^\d*(\.\d{0,2})?$"
                    maxLength='8'
                    minLength='1'
                    max='100000'
                    min='0'
                    step=".1"
                    inputMode='numeric'
                    defaultValue={op[3] || null}
                    disabled={!access}
                    onChange={(e)=>inputMinutes(e)}
                  />
              </label>
              <label className='gapL min8'>
                <i className='numberSet liteToolOff beside'
                >{moment.duration(breakState[op[3]] || 0, 'minutes').asSeconds().toFixed(0,10)}</i>
              </label>
            </span>
            </div>
          ))}
          <p className='vmargin'>
            <button
              type='submit'
              formMethod='dialog'
              id='goQTTB'
              className='action nSolid numberSet minIn7'
              disabled={!access}
            >Update {toCap(Pref.timeBudget, true)}</button>
          </p>
        </form>
      </div>
    </ModelNative>
  );
};

export default QuoteTaskTime;