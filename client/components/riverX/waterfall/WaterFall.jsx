import React, { useState } from 'react';
import './style';
//import moment from 'moment';
//import Pref from '/client/global/pref.js';

const WaterFall = ({ 
  batchId, fall, total, quantity, lock,
  app, borderColor, fadeColor
})=> {
  
  const [ lockPlus, lockPlusSet ] = useState( false );
  const [ lockMinus, lockMinusSet ] = useState( false );
  const [ showMenu, showMenuSet ] = useState( false );
  
  /*
  function plusMeta(e, meta) {
    if(total < quantity) {
      Meteor.call('metaCounter', batchId, fall.key, meta, (error)=>{
        error && console.log(error);
      });
    }
  }
  */
  function plusOne(e) {
    lockPlusSet( true );
    if(total < quantity) {
      Meteor.call('positiveCounter', batchId, fall.key, (error)=>{
        error && console.log(error);
        let speed = !Meteor.user().unlockSpeed ? 2000 : Meteor.user().unlockSpeed; 
        Meteor.setTimeout(()=> {
          lockPlusSet( false );
        }, speed);
      });
    }
  }
  
  function minusOne(e) {
    lockMinusSet( true );
    if(total > 0) {
      Meteor.call('negativeCounter', batchId, fall.key, (error)=>{
        error && console.log(error);
        let speed = !Meteor.user().unlockSpeed ? 2000 : Meteor.user().unlockSpeed; 
        Meteor.setTimeout(()=> {
          lockMinusSet( false );
        }, speed);
      });
    }
  }

  // const metaTicks = fall.counts.filter( x => x.tick === 0);
  // const starts = metaTicks.filter( x => x.meta === 'start').length;
  // const stops = metaTicks.filter( x => x.meta === 'stop').length;
  // const active = starts > 0 && starts > stops;
  
  const fadeDeg = Math.floor( (total / quantity ) * 100 );

  let fadeTick = fadeDeg < 10 ? '0' :
                 fadeDeg < 20 ? '10' :
                 fadeDeg < 30 ? '20' :
                 fadeDeg < 40 ? '30' :
                 fadeDeg < 50 ? '40' :
                 fadeDeg < 60 ? '50' :
                 fadeDeg < 70 ? '60' :
                 fadeDeg < 80 ? '70' :
                 fadeDeg < 90 ? '80' :
                 fadeDeg < 100 ? '90' :
                 '100';
    
  let fadeClass = 'countFill' + fadeColor + fadeTick;
  let startClass = fadeDeg <= 0 || lock ? 'countStop' : '';
  let doneClass = fadeDeg >= 100 || lock ? 'countStop' : '';
  // let offClass = !active ? 'countStop' : '';
  
  return (
    <div className='waterfallGrid'>
      <button
        id={'goMinus' + fall.key}
        className={`countMinus numFont ${startClass}`}
        onClick={(e)=>minusOne(e)}
        disabled={lock || lockMinus || total === 0}
      >-1</button>
        
        {/*active ?
          <button
            className='countOnOff countOff action'
            onClick={()=>plusMeta('stop')}
            disabled={lock}
          >&#x2BC0;</button>
        :
          <button
            className={'countOnOff countOn action ' + fadeColor}
            onClick={()=>plusMeta('start')}
            disabled={lock}
          >&#9654;</button>
        */}
        
      <span>
        <button
          className='countN action low'
          onClick={()=>showMenuSet(true)}
          disabled={
            lock || lockPlus || 
            total >= quantity || true
          }
        >+n</button>
        {showMenu ?
          <div className='overlay invert' key={1}>
            <div className='medModel'>
              <button
                className='action clearRed'
                onClick={()=>showMenuSet(false)}
                title='close'
              ><i className='fas fa-times'></i></button>
              <br />
              add multiple
            </div>
          </div>
        : null}
      </span>
        
      <button
        className='countRec action low'
        disabled={
          lock || lockPlus || 
          total >= quantity || true
        }
      >rec</button>
      
      
      <button
        id={'goPlus' + fall.key}
        className={`countPlus ${borderColor} ${fadeClass} ${doneClass}`}
        onClick={(e)=>plusOne(e)}
        disabled={lock || lockPlus || total >= quantity}>
        <i className='countPlusTop numFont'>{total}</i>
        <br /><i className='numFont'>/{quantity}</i>
      </button>
  	</div>
  );
};

export default WaterFall;