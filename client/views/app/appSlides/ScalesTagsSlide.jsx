import React from 'react';
import Pref from '/client/global/pref.js';
import { toast } from 'react-toastify';
import AppSetSimple from '/client/components/forms/AppSetSimple';

const ScalesTagsSlide = ({ app })=> {
  
  const dfEight = app.latestSerial.eightDigit || 0;
  const dfNine = app.latestSerial.nineDigit || 0;
  const dfTen = app.latestSerial.tenDigit || 0;
  
  function handle(e) {
    e.preventDefault();
    const serialEight = this.srlEight.value;
    const serialNine = this.srlNine.value;
    const serialTen = this.srlTen.value;
    Meteor.call('setlastestSerial', serialEight, serialNine, serialTen, 
    (error, reply)=>{
      if(error) {
        console.log(error);
        toast.error('Server Error');
      }
      if(reply) {
        toast.success('Saved');
      }else{
        toast.error('Not Valid Numbers');
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
    <div className='space3v autoFlex'>
    <div>
      <h2 className='cap'>override last serials</h2>
      
      <h3 className='cap'>REBUILD FUNCTION IN DATA REPAIR</h3>
                
      <label htmlFor='scaleForm'>Manualy Override Last Serial</label>
      <form onSubmit={(e)=>handle(e)}>
        <label htmlFor='srlEight'>
          <span style={ldBox}>8 </span>
          <input
            id='srlEight'
            type='text'
            maxLength={8}
            minLength={8}
            pattern='[00000000-99999999]*'
            inputMode='numeric'
            defaultValue={dfEight}
            required />
        </label>
        <br />
        <label htmlFor='srlNine'>
          <span style={ldBox}>9 </span>
          <input
            id='srlNine'
            type='text'
            maxLength={9}
            minLength={9}
            pattern='[000000000-999999999]*'
            inputMode='numeric'
            defaultValue={dfNine}
            required />
        </label>
        <br />
        <label htmlFor='srlNine'>
          <span style={ldBox}>10 </span>
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
      </div>
      
      <PriorityScale app={app} />
      
      <OnTargetScale app={app} />
      
      <TagSlide app={app} />
      
    </div>
  );
};

export default ScalesTagsSlide;


const PriorityScale = ({ app })=> {
  
  const pScl = !app.priorityScale ? {
    low: 0,
    high: 0,
    max: 0,
  } : app.priorityScale;
  
  function handlePriorityScale(e) {
    e.preventDefault();
    const lowNum = e.target.low.value;
    const highNum = e.target.high.value;
    const maxNum = e.target.max.value;
    Meteor.call('setPriorityScale', lowNum, highNum, maxNum, (error, reply)=>{
      error && console.log(error);
      if(reply) {
        toast.success('Saved');
      }else{
        toast.error('Server Error');
      }
    });
  }
  
  return(
    <div>
      <h2 className='cap'>priority scale</h2>
      <label htmlFor='scaleForm'>Set Scale in Minutes</label>
      <p><em>remember higher the minutes buffer, the lower the priority</em></p>
      <form id='scaleForm' className='inlineForm' onSubmit={(e)=>handlePriorityScale(e)}>
        <ScaleInput idStr='low' place='p4 is >' dfltVal={pScl.low} />
        <ScaleInput idStr='high' place='p3 is >' dfltVal={pScl.high} />
        <ScaleInput idStr='max' place='p2 to p1' dfltVal={pScl.max} />
        <ScaleInput idStr='over' dfltVal={pScl.max} lock={true} />
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

const OnTargetScale = ({ app })=> {
  
  const scl = !app.onScale ? {
    low : 50,
    high: 90,
  } : app.onScale;
  
  function handleScale(e) {
    e.preventDefault();
    const lowNum = e.target.onlow.value;
    const highNum = e.target.onhigh.value;
    Meteor.call('addOnTargetScale', lowNum, highNum, (err, reply)=>{
      err && console.log(error);
      if(reply) {
        toast.success('Saved');
      }else{
        toast.error('Server Error');
      }
    });
  }
  
  return(
    <div>
      <h2 className='cap'>On target scale</h2>
      <label htmlFor='scaleForm'>Set Scale in Percent</label>
      <p><em>How to rank performance</em></p>
      <form 
        id='onscaleForm' 
        className='inlineForm' 
        onSubmit={(e)=>handleScale(e)}
      >
        <ScaleInput idStr='onlow' place='50' dfltVal={scl.low} />
        <ScaleInput idStr='onmed' lock={true} dfltVal='' />
        <ScaleInput idStr='onhigh' place='90' dfltVal={scl.high} />
        <button type='submit' className='smallAction clearGreen'>Save</button>
      </form>
      <div className='vmarginhalf inlineForm'>
        <span className='progMockMeter red'></span>
        <span className='progMockMeter trueyellow'></span>
        <span className='progMockMeter green'></span>
      </div>
    </div>
  );
};

const ScaleInput = ({ idStr, place, dfltVal, lock })=>(
  <input 
    type='number' 
    id={idStr}
    className='miniIn8' 
    placeholder={place || ''}
    defaultValue={dfltVal}
    disabled={lock}
  />
);

const TagSlide = ({ app })=> (
  <div className='space3v'>
    <h2 className='cap'
      ><i className='fas fa-tag gap'></i>
      {Pref.tag} options:
    </h2>
    <i>available reusable {Pref.tag}s</i>
    <AppSetSimple
      title={Pref.tag}
      action='addTagOp'
      rndmKey={Math.random().toString(36).substr(2, 5)} />
      <ul>
        {app.tagOption && app.tagOption.map( (entry, index)=>{
          return ( <li key={index}><i>{entry}</i></li> );
        })}
      </ul>
  </div>
);