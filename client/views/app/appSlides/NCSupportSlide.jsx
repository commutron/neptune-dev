import React from 'react';
import Pref from '/client/global/pref.js';
import { toast } from 'react-toastify';
import AppSetSimple from '/client/components/forms/AppSetSimple';

const NCSupportSlide = ({app})=> {
  
  let df = app.ncScale || { low: 5, high: 10, max: 25 };
  
  function handleScale(e) {
    e.preventDefault();
    let l = this.low.value;
    let h = this.high.value;
    let m = this.max.value;
    Meteor.call('addNCScale', l, h, m, (error, reply)=>{
      if(error)
        console.log(error);
      if(reply) {
        toast.success('Saved');
      }else{
        toast.error('Server Error');
      }
    });
  }
  
  function ancRemove(name) {
    toast.info('This may take a moment');
    Meteor.call('removeAncOption', name, (error, reply)=>{
      if(error)
        console.log(error);
      if(reply) {
        toast.success('Saved');
      }else{
        toast.warning('Cannot be removed, entry is in use');
      }
    });
  }
  
  return (
    <div>
      <h2 className='cap'>{Pref.nonCon} scale</h2>
      <label htmlFor='scaleForm'>Set Scale</label>
      <form id='scaleForm' className='inlineForm' onSubmit={(e)=>handleScale(e)}>
        <input type='number' id='low' className='miniNumIn' defaultValue={df.low} />
        <input type='number' id='high' className='miniNumIn' defaultValue={df.high} />
        <input type='number' id='max' className='miniNumIn' defaultValue={df.max} />
        <button type='submit' className='smallAction clearGreen'>Save</button>
      </form>
      
            
      <hr />
      
      <h2 className='cap'>missing type</h2>
      <i>Type of {Pref.nonCon} that can be converted into a shortfall</i>
      <AppSetSimple
        title='type'
        action='addMissingType'
        rndmKey={Math.random().toString(36).substr(2, 5)} />
      <i><em>currently set to: </em>{app.missingType || ''}</i>
      
      <hr />
      
      <h2 className='cap'>{Pref.ancillary} steps</h2>
      <i>Not strictly assembly but part of the total proccess. Not tracked</i>
      <AppSetSimple
        title='step'
        action='addAncOp'
        rndmKey={Math.random().toString(36).substr(2, 5)} />
      <ul>
        {app.ancillaryOption.map( (entry, index)=>{
          return( 
            <li key={index}>
              <i>{entry}</i>
              <button 
                className='miniAction redT'
                onClick={()=>ancRemove(entry)}
              ><i className='fas fa-times fa-fw'></i></button>
            </li>
        )})}
      </ul>
    </div>
  );
};

export default NCSupportSlide;