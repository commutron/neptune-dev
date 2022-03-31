import React, { useState } from 'react';
import './style';

const WaterFall = ({ 
  batchId, rapidId, fall, total, quantity, speed, lock,
  app, borderColor, fadeColor
})=> {
  
  const [ lockPlus, lockPlusSet ] = useState( false );
  const [ lockMinus, lockMinusSet ] = useState( false );
  
  function plusOne(e, fast) {
    const time = fast ? 0 : speed;
    const num = fast ? 10 : false;
    lockPlusSet( true );
    if(fall.action === 'slider' ? total < 100 : total < quantity) {
      if(batchId) {
        Meteor.call('positiveCounter', batchId, fall.wfKey, num, (error)=>{
          error && console.log(error);
          Meteor.setTimeout(()=> { lockPlusSet( false ); }, time);
        });
      }else if(rapidId) {
        Meteor.call('rapidPositiveCounter', rapidId, fall.wfKey, num, (error)=>{
          error && console.log(error);
          Meteor.setTimeout(()=> { lockPlusSet( false ); }, time);
        });
      }else{null}
    }
  }
  
  function minusOne(e, fast) {
    const time = fast ? 0 : speed;
    const num = fast ? 10 : false;
    lockMinusSet( true );
    if(total > 0) {
      if(batchId) {
        Meteor.call('negativeCounter', batchId, fall.wfKey, num, (error)=>{
          error && console.log(error);
          Meteor.setTimeout(()=> { lockMinusSet( false ); }, time);
        });
      }else if(rapidId) {
        Meteor.call('rapidNegativeCounter', rapidId, fall.wfKey, num, (error)=>{
          error && console.log(error);
          Meteor.setTimeout(()=> { lockMinusSet( false ); }, time);
        });
      }else{null}
    }
  }
  
  const topVal = fall.action === 'slider' ? 100 : quantity;
  const fadeDeg = Math.floor( (total / topVal ) * 100 );

  let fadeTick = fadeDeg <= 0 ? '0' :
                 fadeDeg < 10 ? '5' :
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
    
  let fadeClass = fall.action === 'slider' ?
                  'slideFill' + fadeColor + fadeTick :
                  'countFill' + fadeColor + fadeTick;
  let startClass = fadeDeg <= 0 || lock ? 'countStop' : '';
  let doneClass = fadeDeg >= 100 || lock ? 'countStop' : '';
  // let offClass = !active ? 'countStop' : '';
  
  if(fall.action === 'slider') {
    return(
      <SlideFall
        fallKey={fall.wfKey}
        startClass={startClass}
        countClass={`${borderColor} ${fadeClass} ${doneClass}`}
        minusOne={minusOne}
        downLock={lock || lockMinus || total === 0}
        plusOne={plusOne}
        upLock={lock || lockPlus || total >= 100}
        total={total}
        quantity={quantity}
      />
    );
  }
  
  return(
    <ClickFall
      fallKey={fall.wfKey}
      startClass={startClass}
      countClass={`${borderColor} ${fadeClass} ${doneClass}`}
      minusOne={minusOne}
      downLock={lock || lockMinus || total === 0}
      plusOne={plusOne}
      upLock={lock || lockPlus || total >= quantity}
      total={total}
      quantity={quantity}
    />
  );
};

export default WaterFall;


const SlideFall = ({ 
  fallKey, startClass, countClass, 
  minusOne, downLock, plusOne, upLock, 
  total, quantity
})=> (
  <div className='waterfallGridSlide'>
    <span
      className={`slideCount ${countClass} numFont noCopy`}>
      <i>{total}%</i>
    </span>
    
    <button
      id={'goMinus' + fallKey}
      className={`slideMinus numFont ${startClass}`}
      onClick={(e)=>minusOne(e, true)}
      disabled={downLock}
    ><i className="fas fa-chevron-left"></i></button>
    
    <button
      id={'goPlus' + fallKey}
      className={`slidePlus numFont ${startClass}`}
      onClick={(e)=>plusOne(e, true)}
      disabled={upLock}
    ><i className="fas fa-chevron-right"></i></button>
	</div>
);


const ClickFall = ({ 
  fallKey, startClass, countClass, 
  minusOne, downLock, plusOne, upLock, 
  total, quantity 
})=> (
  <div className='waterfallGridClick'>
    <button
      id={'goMinus' + fallKey}
      className={`countMinus numFont ${startClass}`}
      onClick={(e)=>minusOne(e)}
      disabled={downLock}
    >-1</button>
    
    <button
      id={'goPlus' + fallKey}
      className={`countPlus ${countClass}`}
      onClick={(e)=>plusOne(e)}
      disabled={upLock}>
      <i className='countPlusTop numFont'>{total}</i>
      <br /><i className='numFont'>/{quantity}</i>
    </button>
	</div>
);