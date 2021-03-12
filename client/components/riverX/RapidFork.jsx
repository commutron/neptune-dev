import React from 'react';
import Pref from '/client/global/pref.js';


const RapidFork = ({ seriesId, serial, rapidData })=> {

  let lock = !Roles.userIsInRole(Meteor.userId(), ['qa', 'run', 'inspect']);
  
  function handleFork(e, rapId) {
    e.preventDefault();
    Meteor.call('setRapidFork', seriesId, serial, rapId, (error)=>{
      if(error)
        console.log(error);
    });
  }
  
  if(rapidData.rapDo.every( r => rapidData.rapDid.includes(r._id) ) === false) { 
    return(
      <form 
        id='srtcsc'
        className='vmargin centre'
        onSubmit={(e)=>handleFork(e, this.op.value)}
      >
        <button
          type='submit'
          form='srtcsc'
          className='forkButton'
          disabled={lock}
        ><i className='fas fa-bolt fa-fw'></i>
         <b>Extend {Pref.item}</b></button>
        <select 
          id='op'
          className='wide'
          required>
          {rapidData.rapDo.map( (rp)=>(
            <option 
              key={rp._id} 
              value={rp._id}
              disabled={rapidData.rapDid.includes(rp._id)}
            >
              {rp.rapid} - {rp.issueOrder}
            </option>
          ))}
        </select>
      </form>
    );
  }
  
  return null;
};

export default RapidFork;