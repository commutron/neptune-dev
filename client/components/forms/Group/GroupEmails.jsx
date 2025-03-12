import React , { useState, useEffect } from 'react';
import { toast } from 'react-toastify';

import ModelNative from '/client/layouts/Models/ModelNative';

const GroupEmails = ({ gObj, clearOnClose })=> {
  
  const [ eprime, emailPrimeSet ] = useState(false);
  const [ emailTwo, emailTwoSet ] = useState([]);
  
  useEffect( ()=> {
    emailPrimeSet(gObj?.emailPrime || false);
    emailTwoSet(gObj?.emailSecond || []);
  },[gObj]);
  
  const addSecEmail = (e)=> {
    e.preventDefault();
    let eTwo = new Set(emailTwo);
    eTwo.add(e.target.gEmailTwoVal.value);
    emailTwoSet([...eTwo]);
  };
  const pullEmail = (echoice)=> {
    let eTwo = new Set(emailTwo);
    eTwo.delete(echoice);
    emailTwoSet([...eTwo]);
  };
  
  function addPrimeEmail() {
    if(eprime) {
      Meteor.call('groupPrimeEmailSet', gObj._id, eprime, emailTwo, (error, reply)=>{
        error && toast.error(error.reason || 'Error');
        if(reply) {
          toast.success('Primary Email Saved');
        }
      });
    }else{
      null;
    }
  }
  
  return(
    <ModelNative
      dialogId={'multifuncion_gemail_form'}
      title='Email Configuration'
      icon='fa-solid fa-at'
      colorT='grayT'
      closeFunc={clearOnClose}>
      <div className='centre vmarginhalf space'>
      
        <form id='primeEmailForm' onSubmit={(e)=>addPrimeEmail(e)}>
          <p>
            <label><b>Primary Email Address</b></label><br />
            <input
              type='email'
              id='gprimeEmailVal'
              value={eprime || ''}
              onChange={(e)=>emailPrimeSet(e.target.value)}
              placeholder={eprime || ''}
              autoComplete="false"
              style={{borderBottomStyle: 'solid'}}
            />
          </p>
        </form>
        
        <form onSubmit={(e)=>addSecEmail(e)}>
          <p>
            <label>Secondary Email Addresses <em>({5 - emailTwo?.length || 0} more)</em></label><br />
            <input
              type='email'
              id='gEmailTwoVal'
              required
              autoComplete="false"
              disabled={(emailTwo.length >= 5) || !eprime}
            />
            <button
              type='submit'
              id='addGrpEmailSubmit'
              className='smallAction nHover'
              disabled={(emailTwo.length >= 5) || !eprime}
             >Add New</button>
          </p>
        </form>
      
        <dl>
          {emailTwo.map( (entry, index)=>{
            return( 
              <dt key={index} className='comfort bottomLine'>
                <i>{entry}</i>
                <button 
                  className='miniAction redT'
                  onClick={()=>pullEmail(entry)}
                ><i className='fas fa-times fa-fw'></i> remove</button>
              </dt>
          )})}
        </dl>
        
        <p>
          <button
            id='saveAllEmails'
            type='submit'
            form='primeEmailForm'
            formMethod='dialog'
            className='action nSolid'
          >Save</button>
        </p>
      
      </div>
    </ModelNative>
  );
};

export default GroupEmails;