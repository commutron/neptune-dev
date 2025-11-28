import React, { useState, Fragment } from 'react';
import './style';

const WaterFall = ({ 
  batchId, rapidId, fall, total, quantity, speed, lock,
  app, borderColor, fadeColor
})=> {
  
  const [ lockPlus, lockPlusSet ] = useState( false );
  const [ lockMinus, lockMinusSet ] = useState( false );
  
  function plusOne(e, num) {
    const time = num ? 0 : speed;
    lockPlusSet( true );
    if(fall.action === 'slider' ? total < 100 : total < quantity) {
      if(batchId) {
        Meteor.apply('positiveCounter', [batchId, fall.wfKey, num], {wait: true}, (error)=>{
          error && console.log(error);
          Meteor.setTimeout(()=> { lockPlusSet( false ); }, time);
        });
      }else if(rapidId) {
        Meteor.apply('rapidPositiveCounter', [rapidId, fall.wfKey, num], {wait: true}, (error)=>{
          error && console.log(error);
          Meteor.setTimeout(()=> { lockPlusSet( false ); }, time);
        });
      }else{null}
    }
  }
  
  function minusOne(e, num) {
    const time = num ? 0 : speed;
    lockMinusSet( true );
    if(total > 0) {
      if(batchId) {
        Meteor.apply('negativeCounter', [batchId, fall.wfKey, num], {wait: true}, (error)=>{
          error && console.log(error);
          Meteor.setTimeout(()=> { lockMinusSet( false ); }, time);
        });
      }else if(rapidId) {
        Meteor.apply('rapidNegativeCounter', [rapidId, fall.wfKey, num], {wait: true}, (error)=>{
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
      borderColor={borderColor}
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
      onClick={(e)=>minusOne(e, 10)}
      disabled={downLock}
    ><i className="fas fa-chevron-left"></i></button>
    
    <button
      id={'goPlus' + fallKey}
      className={`slidePlus numFont ${startClass}`}
      onClick={(e)=>plusOne(e, 10)}
      disabled={upLock}
    ><i className="fas fa-chevron-right"></i></button>
	</div>
);


const ClickFall = ({ 
  fallKey, startClass, countClass, borderColor,
  minusOne, downLock, plusOne, upLock, 
  total, quantity 
})=> {

  const [ nstate, nset ] = useState(false);
  const [ nval, nvalset ] = useState(false);
  
  const closeN = ()=> {
    nset(false);
    nvalset(false);
  };
  
  const sendNvalue = (e)=> {
    let nnum = nval ? parseInt(nval, 10) : 0;
    
    if(nnum > 0 && nnum <= (quantity-total)) {
      plusOne(e, nnum);
      closeN();
    }else if(nnum < 0 && nnum >= (-Math.abs(total))) {
      minusOne(e, nnum);
      closeN();
    }else{
      if(nnum === 0) {
        document.getElementById('inputN' + fallKey)
        .setCustomValidity("Invalid");
      }
      document.getElementById('inputN' + fallKey)
      .reportValidity();
    }
  };
  
  return(
    <div className='waterfallGridClick'>
      {nstate ?
        <Fragment>
          <div className='waterfallNnum'>
            <input
              id={'inputN' + fallKey}
              className={borderColor}
              onInput={(n)=>nvalset(n.target.value)}
              defaultValue={nval}
              type='number'
              pattern='[0000-9999]*'
              maxLength='4'
              minLength='1'
              max={quantity-total}
              min={-Math.abs(total)}
              inputMode='numeric'
              placeholder={`${-Math.abs(total)} to +${quantity-total}`}
              required
              autoFocus
            />
          </div>
          <div className='waterfallNdo'>
            <button
              id={'cnclN' + fallKey}
              className='numFont'
              onClick={()=>closeN()}
            ><i className="fas fa-times"></i></button>
            <button
              id={'goNval' + fallKey}
              className='numFont'
              onClick={(e)=>sendNvalue(e)}
            ><i className="fas fa-check"></i></button>
          </div>
        </Fragment>
        :
        <Fragment>
          <button
            id={'goMinus' + fallKey}
            className={`countMinus numFont ${startClass}`}
            onClick={(e)=>minusOne(e)}
            disabled={downLock}
          >-1</button>
          <button
            id={'goSetN' + fallKey}
            className='countN numFont letterSpaced'
            onClick={()=>nset(true)}
            disabled={downLock && upLock}
          >±n</button>
          <button
            id={'goPlus' + fallKey}
            className={`countPlus ${countClass}`}
            onClick={(e)=>plusOne(e)}
            disabled={upLock}>
            <i className='countPlusTop numFont'>{total}</i>
            <br /><i className='numFont'>/{quantity}</i>
          </button>
        </Fragment>}
  	</div>
  );
};