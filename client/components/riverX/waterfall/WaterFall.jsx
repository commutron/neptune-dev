import React, { useState } from 'react';
import './style';
//import moment from 'moment';
//import Pref from '/client/global/pref.js';

// props id, fall, total, quantity, lock, app

const WaterFall = (props)=> {
  
  const [ lockPlus, lockPlusSet ] = useState( false );
  const [ lockMinus, lockMinusSet ] = useState( false );
  const [ showMenu, showMenuSet ] = useState( false );
  
  /*
  function plusMeta(e, meta) {
    const batchID = props.id;
    if(props.total < props.quantity) {
      Meteor.call('metaCounter', batchID, props.fall.wfKey, meta, (error)=>{
        error && console.log(error);
      });
    }
  }
  */
  function plusOne(e) {
    lockPlusSet( true );
    const batchID = props.id;
    if(props.total < props.quantity) {
      Meteor.call('positiveCounter', batchID, props.fall.wfKey, (error)=>{
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
    const batchID = props.id;
    if(props.total > 0) {
      Meteor.call('negativeCounter', batchID, props.fall.wfKey, (error)=>{
        error && console.log(error);
        let speed = !Meteor.user().unlockSpeed ? 2000 : Meteor.user().unlockSpeed; 
        Meteor.setTimeout(()=> {
          lockMinusSet( false );
        }, speed);
      });
    }
  }
  
    
  const metaTicks = props.fall.counts.filter( x => x.tick === 0);
  const starts = metaTicks.filter( x => x.meta === 'start').length;
  const stops = metaTicks.filter( x => x.meta === 'stop').length;
  const active = starts > 0 && starts > stops;
  
  let borderColor = props.borderColor;
  let fadeColor = props.fadeColor;
  
  const fadeDeg = Math.floor( (props.total / props.quantity ) * 100 );

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
  let startClass = fadeDeg <= 0 || props.lock ? 'countStop' : '';
  let doneClass = fadeDeg >= 100 || props.lock ? 'countStop' : '';
  let offClass = /*!active ? 'countStop' :*/ '';
  
  return (
    <div className='waterfallGrid'>
      <button
        id={'goMinus' + props.fall.wfKey}
        className={offClass + ' countMinus numFont ' + startClass}
        onClick={(e)=>minusOne(e)}
        disabled={/*!active ||*/ props.lock || lockMinus || props.total === 0}
      >-1</button>
        
        {/*active ?
          <button
            className='countOnOff countOff action'
            onClick={this.plusMeta.bind(this, 'stop')}
            disabled={this.props.lock}
          >&#x2BC0;</button>
        :
          <button
            className={'countOnOff countOn action ' + fadeColor.toLowerCase()}
            onClick={this.plusMeta.bind(this, 'start')}
            disabled={this.props.lock}
          >&#9654;</button>
        */}
        
      <span>
        <button
          className='countN action low'
          onClick={()=>showMenuSet(true)}
          disabled={
            !active || props.lock || 
            lockPlus || 
            props.total >= props.quantity || true
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
          !active || props.lock || 
          lockPlus || 
          props.total >= props.quantity || true
        }
      >rec</button>
      
      
      <button
        id={'goPlus' + props.fall.wfKey}
        className={offClass + ' countPlus ' + borderColor + ' ' + fadeClass + ' ' + doneClass}
        onClick={(e)=>plusOne(e)}
        disabled={/*!active || */ props.lock || lockPlus || props.total >= props.quantity}>
        <i className='countPlusTop numFont'>{props.total}</i>
        <br /><i className='numFont'>/{props.quantity}</i>
      </button>
  	</div>
  );
};

export default WaterFall;