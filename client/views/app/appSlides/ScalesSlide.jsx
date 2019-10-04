import React from 'react';
import Pref from '/client/global/pref.js';
import { toast } from 'react-toastify';

const ScalesSlide = ({app})=> {
  
  const dfNine = app.latestSerial.nineDigit;
  const dfTen = app.latestSerial.tenDigit;
  
  const pScl = !app.priorityScale ? {
    low: 0,
    high: 0,
    max: 0,
  } : app.priorityScale;
  
  function handle(e) {
    e.preventDefault();
    const serialNine = this.srlNine.value;
    const serialTen = this.srlTen.value;
    Meteor.call('setlastestSerial', serialNine, serialTen, (error, reply)=>{
      if(error)
        console.log(error);
      if(reply) {
        toast.success('Saved');
      }else{
        toast.error('Server Error');
      }
    });
  }
  
  function handlePriorityScale(e) {
    e.preventDefault();
    const lowNum = e.target.low.value;
    const highNum = e.target.high.value;
    const maxNum = e.target.max.value;
    Meteor.call('setPriorityScale', lowNum, highNum, maxNum, (error, reply)=>{
      if(error)
        console.log(error);
      if(reply) {
        toast.success('Saved');
      }else{
        toast.error('Server Error');
      }
    });
  }
  
  let ldBox = {
    display: 'inline-block',
    width: '22px',
    fontWeight: '600',
    textAlign: 'center',
  };
  
  return (
    <div>
    
    <h2 className='cap'>override last serials</h2>
              
    <label htmlFor='scaleForm'>Manualy Override Last Serial</label>
    <form onSubmit={(e)=>handle(e)}>
      <label htmlFor='srlNine'>
        <span style={ldBox}>9</span>
        <input
          id='srlNine'
          type='text'
          maxLength={9}
          minLength={9}
          pattern='[0000000000-9999999999]*'
          inputMode='numeric'
          defaultValue={dfNine}
          required />
      </label>
      <br />
      <label htmlFor='srlNine'>
        <div style={ldBox}>10</div>
        <input
          id='srlTen'
          type='text'
          maxLength={10}
          minLength={10}
          pattern='[0000000000-9999999999]*'
          inputMode='numeric'
          defaultValue={dfTen} 
          required />
      </label>
        <br />
        <input type='reset' className='smallAction blackT clear' />
        <button
          type='submit'
          className='smallAction blackT clearGreen'
        >Save</button>
      </form>
      
      <hr />
      
      <h2 className='cap'>priority scale</h2>
      <label htmlFor='scaleForm'>Set Scale in Minutes</label>
      <p><em>remember higher the minutes buffer, the lower the priority</em></p>
      <form id='scaleForm' className='inlineForm' onSubmit={(e)=>handlePriorityScale(e)}>
        <input 
          type='number' 
          id='low' 
          className='miniIn7' 
          placeholder='p4 is >'
          defaultValue={pScl.low} />
        <input 
          type='number' 
          id='high' 
          className='miniIn7' 
          placeholder='p3 is >'
          defaultValue={pScl.high} />
        <input 
          type='number' 
          id='max' 
          className='miniIn7'
          placeholder='p2 to p1'
          defaultValue={pScl.max} />
        <input 
          type='number' 
          className='miniIn7'
          value={pScl.max}
          disabled />
        <button type='submit' className='smallAction clearGreen'>Save</button>
      </form>
      <div className='vmarginhalf inlineForm'>
        <span className='progMockMeter pScale4'></span>
        <span className='progMockMeter pScale3'></span>
        <span className='progMockMeter pScale2'></span>
        <span className='progMockMeter pScale1'></span>
      </div>
    </div>
  );
};

export default ScalesSlide;