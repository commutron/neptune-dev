import React from 'react';
import Pref from '/client/global/pref.js';
import Alert from '/client/global/alert.js';

const SerialSlide = ({app})=> {
  
  const dfNine = app.latestSerial.nineDigit;
  const dfTen = app.latestSerial.tenDigit;
  
  function handle(e) {
    e.preventDefault();
    const serialNine = this.srlNine.value;
    const serialTen = this.srlTen.value;
    Meteor.call('setlastestSerial', serialNine, serialTen, (error, reply)=>{
      if(error)
        console.log(error);
      if(reply) {
        Bert.alert(Alert.success);
      }else{
        Bert.alert(Alert.danger);
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
      
    </div>
  );
};

export default SerialSlide;