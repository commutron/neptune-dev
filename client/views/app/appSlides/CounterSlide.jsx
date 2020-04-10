import React from 'react';
import Pref from '/client/global/pref.js';
import { toast } from 'react-toastify';

const CounterSlide = ({ app })=> {
  
  const rndmKey = Math.random().toString(36).substr(2, 5);
  
  function addCountTrackOp(e) {
    e.preventDefault();
    
    let newOp = this[rndmKey + 'input'].value.trim();
    newOp = newOp.replace("|", "-");
    let type = this[rndmKey + 'type'].value.trim();
    let branch = this[rndmKey + 'branch'].value.trim();
    
    const newSet = newOp + '|' + type + '|' + branch;
    
    Meteor.call('addCountOption', newSet, (error, reply)=>{
      if(error)
        console.log(error);
      if(reply) {
        this[rndmKey + 'input'].value = '';
        this[rndmKey + 'type'].value = '';
        this[rndmKey + 'branch'].value = '';
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
      <form onSubmit={(e)=>addCountTrackOp(e)} className='inlineForm'>
        <label htmlFor={rndmKey + 'form'}>gate<br />
          <input
            type='text'
            id={rndmKey + 'input'}
            required
          />
        </label>
        <label htmlFor={rndmKey + 'type'}>Type<br />
          <select 
            id={rndmKey + 'type'}
            className='tableAction'
            required
          >
            <option></option>
            <option value='build'>build</option>
            <option value='inspect'>inspect</option>
            <option value='test'>test</option>
            <option value='checkpoint'>checkpoint</option>
            <option value='finish'>finish</option>
          </select>
        </label>
        <label htmlFor={rndmKey + 'branch'}>{Pref.branch}<br />
          <select id={rndmKey + 'branch'} required >
            <option></option>
            {app.branches.map( (entry, index)=>{
              return( 
                <option key={index} value={entry.brKey}>{entry.branch}</option>
            )})}
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
          const branchObj = app.branches.find( y => y.brKey === entry.branchKey );
          const branchName = branchObj ? branchObj.branch : 'n/a';
          return( 
            <li key={index}>{entry.gate} - {entry.type} - {branchName}</li> 
          );
        })}
      </ul>
    </div>
  );
};

export default CounterSlide;