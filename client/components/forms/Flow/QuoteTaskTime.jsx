import React, { useState, useEffect } from 'react';
import moment from 'moment';
import Pref from '/public/pref.js';
import { toast } from 'react-toastify';

import ModelNative from '/client/layouts/Models/ModelNative';
import { toCap } from '/client/utility/Convert';
import InUseCheck from './InUseCheck';

const QuoteTaskTime = ({ 
  id, flowKey, existFlows, app, access, isDebug, clearOnClose
})=> {
  
  const [ fTitle, fTitleSet ] = useState(false);
  
  const [ inputOps, inputOpsSet ] = useState([]);
  const [ qtArrState, qtArrSet ] = useState({});
  
  const [ subsumState, subsumSet ] = useState(0);
  
   useEffect( ()=> {
    if(!flowKey) {
      fTitleSet(false);
      inputOpsSet([]);
      qtArrSet({});
    }else{
      const fill = existFlows.find( f => f.flowKey === flowKey );
      if(fill) {
        fTitleSet(fill.title);
        const qtSaved = fill.qtTime || [];
  
        const qtS = app.qtTasks.sort( (a,b)=> a.position > b.position ? -1 : a.position < b.position ? 1 : 0);
        let ops = [];
        for( let qt of qtS ) {
          const qtbr = app.branches.find( b => b.brKey === qt.brKey );
          if(qtbr && qtbr.open && qtbr.pro ) {
            const qval = qtSaved.find( q => q[0] === qt.qtKey )?.[1] || 0;
            ops.push( [ qt.qtKey, qt.qtTask, qt.subTasks.join(', '), qval, qt.fixed ] );
          }
        }
        inputOpsSet(ops);
        
        const opsObj = ops.reduce((acc, curr) =>(acc[curr[0]] = curr[3], acc), {});
        qtArrSet(opsObj);
      }
    }
  }, [flowKey]);

  useEffect( ()=>{
    const objArr = Object.entries(qtArrState);
    const arrTtl = objArr.reduce((x,y)=> x + y[1], 0);
    subsumSet( arrTtl );
  }, [qtArrState]);
  
  const inputMinutes = (e) => {
    const val = e.target.value || 0;
    const inMin = parseFloat(val);
    qtArrSet({
      ...qtArrState,
      [ e.target.id ]: inMin
    });
  };
  
  const setQtFlow = (e)=> {
    e.preventDefault();
    const qttbArray = Object.entries(qtArrState).filter( x => x[1] > 0);
    if(access) {
      Meteor.call('setFlowQuoteTime', id, flowKey, qttbArray, (err, re)=>{
        err && console.log(err);
        if(re) {
          toast.success('Saved');
          document.getElementById(id+'_flowquote_form')?.close();
          clearOnClose();
        }else{
          toast.error('Server Error');
        }
      });
    }else{ toast.error('NO Permission'); }
  };

  return(
    <ModelNative
      dialogId={id+'_flowquote_form'}
      title='Assign Quoted Time'
      icon='fa-solid fa-gem'
      colorT='blueT'
      closeFunc={()=>clearOnClose()}>
      <div className='centre min750'>
        <InUseCheck
          flowtitle={fTitle}
          preFillKey={flowKey}
        />
          
        {access ? null : <p>{Pref.norole}</p>}
        
        <p><em>Default is Dynamic; enter as per one unit, will scale to order quantity.</em></p>
        <p><em>Static groups are one chunk of time for the whole order.</em></p>
       
        <form
          id='qttbgt'
          className='centre overscroll minH60'
          onSubmit={(e)=>setQtFlow(e)}
        >
          <div className='rightRow doJustWeen vspace'>
            <label className='bold'>Total Quoted Task Time</label>
            <span className='beside'>
              {isDebug ? <label className='gapR min8'>
                <i className='numberSet liteToolOff beside rightJust'
                >{moment.duration(subsumState || 0, 'minutes').asHours().toFixed(2,10)}</i>
              </label> : null}
              <label className='gapL min8'>
                <i className={`numberSet liteToolOff beside rightJust`}
                >{subsumState.toFixed(1,10)}</i>
              </label>
              <label className='gapL min8'>
                <i className={`numberSet liteToolOff beside rightJust`}
                >{moment.duration(subsumState || 0, 'minutes').asSeconds().toFixed(0,10)}</i>
              </label>
            </span>
          </div>
          <div className='w100 breaklines split doJustWeen'>
            <span></span>
            <span className='beside'>
              {isDebug ? <label className='min8 liteToolOff beside rightJust'>Hours</label> : null}
              <label className='miniIn10 gapL beside rightJust'>Minutes</label>
              <label className='gapL min8 liteToolOff beside rightJust'>Seconds</label>
            </span>
          </div>
          {inputOps.map( (op, index)=>(
            <div 
              key={index}
              className='w100 breaklines split doJustWeen'>
              <span className='max300'>
                <label>{op[1]}<sup className='bold smCap'>{op[4] ? 'STATIC' : ''}</sup></label>
                <div className='small'>{op[2]}</div>
              </span>
              <span className='beside'>
                {isDebug ? <label className='gapR min8'>
                  <i className='numberSet liteToolOff beside rightJust'
                  >{moment.duration(qtArrState[op[0]] || 0, 'minutes').asHours().toFixed(2,10)}</i>
                </label> : null}
                <label className='gapL'>
                  <input
                    type='text'
                    id={op[0]}
                    name={op[1]}
                    className='rightText numberSet miniIn10'
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
                  <i className='numberSet liteToolOff beside rightJust'
                  >{moment.duration(qtArrState[op[0]] || 0, 'minutes').asSeconds().toFixed(0,10)}</i>
                </label>
              </span>
            </div>
          ))}
          <p className='vmarginhalf'>Live {Pref.xBatchs} will be automatically updated.</p>
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