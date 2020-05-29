import React, { useState, useEffect } from 'react';
import moment from 'moment';
import 'moment-timezone';
import Pref from '/client/global/pref.js';
// import { CalcSpin } from '/client/components/tinyUi/Spin.jsx';

// const clientTZ = moment.tz.guess();

const BuildHistory = ({ allBatch, allXBatch, allVariant, allWidget, allGroup })=> {
  
  const [ vPack, vPackSet ] = useState([]);

  const [ viewState, viewSet ] = useState([]);
  
  const [ groupState, groupSet ] = useState('any');
  
  const [ wasState, wasSet ] = useState(true);
  const [ incState, incSet ] = useState('this');
  const [ numState, numSet ] = useState(1);
  const [ spanState, spanSet ] = useState('year');
  
  
  
  useEffect( ()=> {
    
    let orderDates = [];
    for( let v of allVariant ) {
      const btchs = allBatch.filter( b => b.versionKey === v.versionKey);
      const dates = Array.from(btchs, b => !b.finishedAt ? new Date() : b.finishedAt);
      const btchsX = allXBatch.filter( b => b.versionKey === v.versionKey);
      const datesX = Array.from(btchsX, b => !b.completedAt ? new Date() : b.completedAt);
      orderDates.push({
        variant: v.variant,
        widgetId: v.widgetId,
        groupId: v.groupId,
        dates: [...dates,...datesX]
      });
    }
    vPackSet( orderDates );
    
  }, []);
  
  useEffect( ()=> {
    
    const preGpFltr = groupState === 'any' ? vPack :
            vPack.filter( v => v.groupId === groupState );
            
    const spanPlural = spanState + 's';
    const numCntx = incState == 'this' ? 0 : numState;
    const lineinthesand = moment().subtract(numCntx, spanPlural);
    
    if(wasState) {
      const after = preGpFltr.filter( v => 
                      v.dates.find( d => 
                        moment(d).isSameOrAfter(lineinthesand, spanState) ) );
      viewSet(after);
    }else{
      
      const before = preGpFltr.filter( v => 
                      v.dates.every( d => 
                        moment(d).isBefore(lineinthesand, spanState) ) );
      viewSet(before);
    }
    
  }, [vPack, groupState, wasState, incState, numState, spanState]);

  	      
  const mCntx = incState == 'this' || numState == 1 ? 'month' : 'months'; 
  const yCntx = incState == 'this' || numState == 1 ? 'year' : 'years';
  
  const fillG = (gID)=> allGroup.find( g => g._id === gID ).group;
  const fillW = (wID)=> allWidget.find( w => w._id === wID ).widget.toUpperCase();
  
  	      
  return(
    <div className='space'>
      
      
      
      
      <p>
        
        <i className='medBig'>What {Pref.widgets} from </i> 
      
        <select
          style={ { width: '32ch', border: 'none' } }
          defaultValue={groupState}
          onChange={(e)=>groupSet(e.target.value)}>
          <option 
            className='clean'
            value='any'
            label={`any ${Pref.group}`}
          />
          {allGroup.map( (e, ix)=>(
            <option
              key={'g'+ix}
              value={e._id}
              label={e.group}
            />
          ))}
        </select>
      
      <i className='medBig'> </i></p>
      
      <p>
        <select
          style={ { width: '9ch', border: 'none' } }
          defaultValue={wasState}
          onChange={(e)=>wasSet(e.target.value === 'false' ? false : true)}>
          <option value={true}>were</option>
          <option value={false}>were not</option>
        </select>
      
        <i className='medBig'> built </i>
      
        <select
          style={ { width: '10ch', border: 'none' } }
          defaultValue={incState}
          onChange={(e)=>incSet(e.target.value)}>
          <option value='this'>this</option>
          <option value='since'>in the last</option>
        </select>
      
        <i className='medBig'> </i>
      
        {incState == 'since' &&
        <input 
          type='number'
          min='1'
          max='99'
          inputMode='numeric'
          style={ { width: '5ch', border: 'none' } }
          defaultValue={numState}
          onChange={(e)=>numSet(e.target.value)}
        />}
      
        <i className='medBig'> </i>
      
        <select
          style={ { width: '8ch', border: 'none' } }
          defaultValue={spanState}
          onChange={(e)=>spanSet(e.target.value)}>
          <option value='month'>{mCntx}</option>
          <option value='year'>{yCntx}</option>
        </select>
      </p>
      
      
      <ol>
      {viewState.map( (e, ix)=>(
          <li key={'r'+ix}>{fillG(e.groupId)} {fillW(e.widgetId)} v.{e.variant}</li>) )
      }
      </ol>
      
      
      
       <hr />
      <hr />
      <hr />
      
      
      {/*
      <hr />
      
      <h3>Total variants: {vPack.length}</h3>
      
      <hr />
      
      <h4>Ordered Once</h4>
      <ol>
      {vPack.filter( v => v.dates.length == 1).map( (e, ix)=>(
        <li>{e.variant}</li>) )
      }
      </ol>
      
      <hr />
      
      <h4>Ordered Multiple</h4>
      <ol>
      {vPack.filter( v => v.dates.length > 1).map( (e, ix)=>(
        <li>{e.variant}</li>) ) 
        // although multiple batches doesn't mean multiple orders
      }
      </ol>
      
      <hr />
      */}
    

    
    
    
    
      <p> When was CUSTOMER BUILT ORDERED Last </p>
      
      <p> When was ANY Widget BUILT Last </p> 
      
      <p> When was VARIANT BUILT Last </p> 
    
    
    
    
    
    
    </div>
  );
};

export default BuildHistory;