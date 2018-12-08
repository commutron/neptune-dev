import React from 'react';
import Pref from '/client/global/pref.js';
import { toast } from 'react-toastify';

const CounterSlide = ({app})=> {
  
  const rndmKey = Math.random().toString(36).substr(2, 5);
  
  function addTrackOp(e) {
    e.preventDefault();
    
    let newOp = this[rndmKey + 'input'].value.trim();
    newOp = newOp.replace("|", "-");
    let type = this[rndmKey + 'type'].value.trim();
    
    const newSet = newOp + '|' + type;
    
    Meteor.call('addCountOption', newSet, (error, reply)=>{
      if(error)
        console.log(error);
      if(reply) {
        this[rndmKey + 'input'].value = '';
        this[rndmKey + 'type'].value = '';
      }else{
        toast.warning('server error');
      }
    });
  }
  
  return (
    <div>
    
      <p>
        <i className='fas fa-exclamation-circle'></i>
        <i> Entries are case sensitive, smt =/= SMT.</i>
        <i> Capitalizing is unnecessary in most cases and only recommended for abbreviations.</i>
      </p>
          
      <h2 className='cap'>{Pref.counter} gates</h2>
      <i>Options for counters</i>
      <form onSubmit={(e)=>addTrackOp(e)} className='inlineForm'>
        <label htmlFor={rndmKey + 'form'}>gate<br />
          <input
            type='text'
            id={rndmKey + 'input'}
            required
          />
        </label>
        <label htmlFor={rndmKey + 'type'}>Type<br />
          <select id={rndmKey + 'type'} required >
            <option></option>
            <option value='build'>build</option>
            <option value='inspect'>inspect</option>
            <option value='test'>test</option>
            <option value='checkpoint'>checkpoint</option>
            <option value='finish'>finish</option>
          </select>
        </label>
        <label htmlFor={rndmKey + 'add'}><br />
          <button
            type='submit'
            id={rndmKey + 'add'}
            className='smallAction clearGreen'
            disabled={false}
          >Set</button>
        </label>
      </form>
        
      <ul>
        {app.countOption && app.countOption.map( (entry, index)=>{
          return ( <li key={index}>{entry.gate} - {entry.type}</li> );
        })}
      </ul>
    </div>
  );
};

export default CounterSlide;