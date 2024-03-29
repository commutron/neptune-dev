import React, { useState, useEffect, Fragment } from 'react';
import moment from 'moment';
import Pref from '/client/global/pref.js';

import ReportStatsTable from '/client/components/tables/ReportStatsTable'; 
import NumLine from '/client/components/tinyUi/NumLine';
import PrintThis from '/client/components/tinyUi/PrintThis';


const BuildHistory = ({ allVariant, allWidget, allGroup })=> {
  
  const [ vPack, vPackSet ] = useState([]);

  const [ viewState, viewSet ] = useState([]);
  
  const [ scopeState, scopeSet ] = useState('group');
  
  const [ groupAState, groupASet ] = useState('');
  const [ widgetState, widgetSet ] = useState('');
  const [ answerState, answerSet ] = useState(undefined);
  
  const [ groupState, groupSet ] = useState('any');
  
  const [ wasState, wasSet ] = useState(true);
  const [ incState, incSet ] = useState('this');
  const [ numState, numSet ] = useState(1);
  const [ spanState, spanSet ] = useState(false);//'month');
  
  const fillG = (gID)=> allGroup.find( g => g._id === gID ).group;
  const fillW = (wID)=> allWidget.find( w => w._id === wID ).widget.toUpperCase();
  
  const allGroupS = allGroup.sort((x1, x2)=> 
	                    x1.alias > x2.alias ? 1 : x1.alias < x2.alias ? -1 : 0 );
  
  useEffect( ()=> {
    Meteor.call('getVariantOrderDates', (err, re)=> {
      err && console.log(err);
      re && vPackSet( re );
    });
  }, []);
  
  useEffect( ()=> {
    
    let daThing = null;
    
    if(scopeState === 'widget') {
      const clean = widgetState.toLowerCase();
      const match = allWidget.find( w => w.widget.toLowerCase() === clean );
      if(match) {
        const targetW = vPack.filter( v => v.widgetId === match._id );
        daThing = targetW;
      }else{answerSet(undefined)}
    }else{
      const clean = groupAState.toLowerCase();
      const match = allGroup.find( w => w.alias.toLowerCase() === clean );
      if(match) {
        const targetG = vPack.filter( v => v.groupId === match._id );
        daThing = targetG;
      }else{answerSet(undefined)}
    }
      
    if(daThing) {
      const targetDates = Array.from(daThing, t => t.dates);
      const dateArr = [].concat(...targetDates);
    
      const dateS = dateArr.sort((d1, d2)=> {
                if (d1 < d2) { return 1 }
                if (d1 > d2) { return -1 }
                return 0;
              });
      const lastDate = dateS.length === 0 ? false : dateS[0];
      answerSet(lastDate);
    }
  
  }, [vPack, widgetState, groupAState, scopeState]);
    
  
  useEffect( ()=> {
    
    const preGpFltr = groupState === 'any' ? vPack :
            vPack.filter( v => v.groupId === groupState );
            
    const spanPlural = spanState + 's';
    const numCntx = incState == 'this' ? 0 : numState;
    const lineinthesand = moment().subtract(numCntx, spanPlural);
    
    let result = [];
    if(!spanState) {
      null;
    }else if(wasState) {
      result = preGpFltr.filter( v => 
                    v.dates.find( d => 
                        moment(d).isSameOrAfter(lineinthesand, spanState) ) );
    }else{
      result = preGpFltr.filter( v => 
                    v.dates.every( d => 
                        moment(d).isBefore(lineinthesand, spanState) ) );
    }
    
    const arrayView = Array.from(result, r => [
                        fillG(r.groupId), fillW(r.widgetId), ('v. ' + r.variant)
                      ] );
    const arrayViewS = arrayView.sort((A1, A2)=> {
                let a10 = A1[0].toLowerCase();
                let a11 = A1[1].toLowerCase();
                let a20 = A2[0].toLowerCase();
                let a21 = A2[1].toLowerCase();
                if (a10 === a20 && a11 < a21) { return -1 }
                if (a10 === a20 && a11 > a21) { return 1 }
                if (a10 < a20) { return -1 }
                if (a10 > a20) { return 1 }
                return 0;
              });
    viewSet(arrayViewS);
    
  }, [vPack, groupState, wasState, incState, numState, spanState]);

  const blend = { width: '10ch', border: 'none', lineHeight: 2 };
  
  const insertGroup = 
          <GroupSelector
            groupState={groupState}
            groupSet={groupSet}
            allGroup={allGroupS}
            showANY={true} />;
            
  const insertWas = 
          <select
            style={blend}
            defaultValue={wasState}
            onChange={(e)=>wasSet(e.target.value === 'false' ? false : true)}>
            <option value={true}>were</option>
            <option value={false}>were not</option>
          </select>;
  
  const insertInc = 
          <select
            style={blend}
            defaultValue={incState}
            onChange={(e)=>incSet(e.target.value)}>
            <option value='this'>this</option>
            <option value='since'>in the last</option>
          </select>;
  
  const insertNum = 
          <input 
            type='number'
            min='1'
            max='99'
            inputMode='numeric'
            style={ { width: '5ch', border: 'none' } }
            defaultValue={numState}
            onChange={(e)=>numSet(e.target.value)}
          />;
          
  const mCntx = incState == 'this' || numState == 1 ? 'month' : 'months'; 
  const yCntx = incState == 'this' || numState == 1 ? 'year' : 'years';
  
  const insertSpan = 
          <select
            style={ { width: '8ch', border: 'none', lineHeight: 2 } }
            defaultValue={spanState}
            onChange={(e)=>spanSet(e.target.value)}>
            <option value={false}></option>
            <option value='month'>{mCntx}</option>
            <option value='year'>{yCntx}</option>
          </select>;
  
  const I = incState === 'since';
  const G = groupState === 'any' ? 'any' : fillG(groupState);
  
  return(
    <div>
      <div className='vspace'>

        <p>
          <i className='med line2x'>When was </i>
          
          <select
            style={blend}
            defaultValue={scopeState}
            onChange={(e)=>scopeSet(e.target.value)}>
            <option value='group'>{Pref.group}</option>
            <option value='widget'>{Pref.widget}</option>
          </select>
            
          <i className='med line2x'> </i>
      
          {scopeState === 'widget' ?
            <Fragment><input
              type='search'
              list='wdgtList'
              style={ { width: `${Pref.aliasMax+2}ch`, border: 'none' } }
              onChange={(e)=>widgetSet(e.target.value)} />
              <datalist id='wdgtList'>
                {allWidget.map( (e, ix)=>(
                  <option 
                    key={ix+'w'+e._id} 
                    value={e.widget.toUpperCase()}
                    className='cap'
                  >{fillG(e.groupId)}</option>
                ))}
              </datalist></Fragment>
            :
            <Fragment><input
              type='search'
              list='grpList'
              style={ { width: `${Pref.aliasMax+2}ch`, border: 'none' } }
              onChange={(e)=>groupASet(e.target.value)} />
              <datalist id='grpList'>
                {allGroupS.map( (e, ix)=>(
                  <option 
                    key={ix+'g'+e._id} 
                    value={e.alias.toUpperCase()}
                    className='cap'
                  >{e.group}</option>
                ))}
              </datalist></Fragment>}
            
          <i className='med line2x'> built last?</i>
        </p>
        
        <span className='overscroll minH60'>
          {answerState === undefined ? null :
            answerState === false ? <i className='big smCap'>Never</i> :
            <NumLine
              num={moment(answerState).format("dddd, MMMM Do YYYY")}
              name=''
              color='blueT'
              big={true} />
          }
        </span>
      
      </div>
      
      <div className='vspace'>
        <p className='med line2x'
          >Which {Pref.widgets} from {insertGroup} {insertWas} built {insertInc} {I && insertNum} {insertSpan}
        </p>
        
        {spanState &&
          <ReportStatsTable 
            title={`${Pref.widgets} build report`}
            dateString={`${G}-${wasState}-${incState}-${numState}-${spanState}`}
            rows={viewState}
            extraClass='max750 transparent'
          />
        }
      
      </div>
        
    </div>
  );
};

export default BuildHistory;


const GroupSelector = ({ groupState, groupSet, allGroup, showANY })=> (
  <select
    style={ { width: `${Pref.aliasMax}ch`, border: 'none', lineHeight: 2 } }
    className='up'
    defaultValue={groupState}
    onChange={(e)=>groupSet(e.target.value)}>
    {showANY && <option value='any'>any {Pref.group}</option>}
    {allGroup.map( (e, ix)=>(
      <option key={'g'+ix} value={e._id} label={e.alias} />
    ))}
  </select>
);