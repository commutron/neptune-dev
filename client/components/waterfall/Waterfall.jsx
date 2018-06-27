import React from 'react';
//import moment from 'moment';
import Pref from '/client/global/pref.js';

const Waterfall = ({ id, fall, total, quantity, lock, app })=> {

  function plusOne() {
    const batchID = id;
    if(total < quantity) {
      Meteor.call('positiveCounter', batchID, fall.wfKey, (error)=>{
        error && console.log(error);
      });
    }
  }
  function minusOne() {
    const batchID = id;
    if(total > 0) {
      Meteor.call('negativeCounter', batchID, fall.wfKey, (error)=>{
        error && console.log(error);
      });
    }
  }
  
  const type = app.countOption.find( x => x.key === fall.wfKey ).type;
  let borderColor = 'borderBlue';
  let fadeColor = 'Blue';
  //// Style the Stone Accordingly \\\\
	if(type === 'inspect'){
		borderColor = 'borderGreen';
		fadeColor = 'Green';
  }else if(type === 'checkpoint'){
		borderColor = 'borderWhite';
		fadeColor = 'White';
  }else if(type === 'test'){
		borderColor = 'borderTeal';
		fadeColor = 'Teal';
  }else if(type === 'finish'){
		borderColor = 'borderPurple';
		fadeColor = 'Purple';
  }else{
    null }
  
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
  
  //console.log({fadeDeg, fadeTick, fadeClass});
  
  return (
    <div className='waterfallGrid'>
      <button
        className='countMinus'
        onClick={()=>minusOne()}
        disabled={lock || total === 0}
      >-1</button>
      
      <button
        className='countN action'
        disabled={lock || true}
      >+n</button>
      
      <button
        className='countRec action'
        disabled={lock || true}
      >rec</button>
      
      <button
        className={'countPlus ' + borderColor + ' ' + fadeClass}
        onClick={()=>plusOne()}
        disabled={lock || total >= quantity}>
        <i className='countPlusTop'>{total}</i>
        <br /><i>/{quantity}</i>
      </button>
  	</div>
  );
};
  
export default Waterfall;