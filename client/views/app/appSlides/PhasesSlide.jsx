import React from 'react';
import Pref from '/client/global/pref.js';

const PhasesSlide = ({app})=> {
  
  const rndmKey1 = Math.random().toString(36).substr(2, 5);

  return (
    <div className='invert'>
      
      <h2 className='cap'><i className='fas fa-route fa-fw'></i> {Pref.phases}</h2>
      <p>Options for Phase [ DEPRECIATED ]</p>
      
      <hr />
      {!app.phases ?
        <b> phases removed </b>
        :
      <ol>
        {app.phases.map( (entry, index)=>{
          return( 
            <li key={rndmKey1 + index + entry.key}>
              <i>{entry}</i>
            </li>
        )})}
      </ol>}
      
    </div>
  );
};

export default PhasesSlide;