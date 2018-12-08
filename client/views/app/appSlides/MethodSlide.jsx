import React from 'react';
import Pref from '/client/global/pref.js';
import { toast } from 'react-toastify';

const MethodSlide = ({app, sorted})=> {
  
  const existOps = app.toolOption;
  const trackedSteps = sorted;
  
  function handle(e) {
    e.preventDefault();
    let title = this.tooltitle.value;
    let steps = Array.from(
                  this.corrSteps.options, 
                    x => x.selected === true && x.value
                  ).filter( 
                    y => y !== false
                  );
    Meteor.call('addToolOp', title, steps, (error, reply)=>{
      if(error)
        console.log(error);
      if(reply) {
        toast.success('Saved');
        this.tooltitle.value = '';
        this.corrSteps.value = null;
      }else{
        toast.error('Server Error');
      }
    });
  }
  
  return(
    <div>
      <h2 className='cap'>smarter {Pref.method} options:</h2>
      <i>available methods for first-off form</i>
            
      <form id='toolForm' onSubmit={(e)=>handle(e)}>
        <label htmlFor='tooltitle'>{Pref.method} name</label>
        <br />
        <input type='text' id='tooltitle' list='preExist' required />
        <datalist id='preExist'>
          {existOps.map( (entry, index)=>{
            return(
              <option key={index} value={entry.title}>{entry.title}</option>
            );
          })}
        </datalist>
        <br />
        <label htmlFor='steps'>Corresponding Steps</label>
        <br />
        <select id='corrSteps' multiple required>
          {trackedSteps.map( (entry)=>{
            if(entry.type === 'first') {
              return(
                <option key={entry.key} value={entry.key}>{entry.step}</option>
              );
            }else{null}
          })}
        </select>
        <br />
        <button type='submit' className='smallAction clearGreen'>Save</button>
      </form>
      

      <ul>
        {app.toolOption.map( (entry, index)=>{
          if(typeof entry === 'object') {
            return(
              <li key={index}>
                <dl>
                  <dt>{entry.title}</dt>
                  {entry.forSteps.map( (ntry, ndx)=>{
                    let nice = trackedSteps.find( x => x.key === ntry ).step;
                    return( <dd key={ndx}>{nice}</dd> );
                  })}
                </dl>
              </li>
            );
          }else{
            null;
          }
        })}
      </ul>
            
    </div>
  );
};

export default MethodSlide;