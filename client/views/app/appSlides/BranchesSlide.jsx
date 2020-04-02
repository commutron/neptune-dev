import React from 'react';
import Pref from '/client/global/pref.js';
import { toast } from 'react-toastify';
import AppSetSimple from '/client/components/forms/AppSetSimple';

import BranchBuilder from '/client/components/bigUi/ArrayBuilder/BranchBuilder.jsx';

const PhasesSlide = ({app})=> {
  
  const rndmKey1 = Math.random().toString(36).substr(2, 5);

  function removeBranchOp(e, name) {
    Meteor.call('removeBranchOption', name, (error, reply)=>{
      if(error)
        console.log(error);
      if(reply) {
        toast.success(`${Pref.phase} removed`);
      }else{
        toast.warning(`Cannot remove, ${Pref.phase} is in use`);
      }
    });
  }

  
  return (
    <div className='invert'>
      
      <h2 className='cap'><i className='fas fa-code-branch fa-fw'></i> {Pref.branches}</h2>
      <p>Options for Branch / Department / Tracking Catagory</p>
      <p>
        <i className='fas fa-exclamation-circle'></i>
        <i> Entries are case sensitive, smt =/= SMT.</i>
        <i> Capitalizing is unnecessary in most cases and only recommended for abbreviations.</i>
      </p>
      
      <hr />
      
      <BranchBuilder app={app} />
      
      <hr />
      
      <AppSetSimple
        title={Pref.branch}
        action='addBranchOption'
        rndmKey={rndmKey1} />
      <ol>
        {app.branches && app.branches.map( (entry, index)=>{
          return( 
            <li key={rndmKey1 + index + entry.key}>
              <i>{entry}</i>
              {entry !== 'finish' &&
                <button 
                  className='miniAction redT'
                  onClick={(e)=>removeBranchOp(e, entry)}
                ><i className='fas fa-times fa-fw'></i></button>}
            </li>
        )})}
      </ol>
      
    </div>
  );
};

export default PhasesSlide;