import React, { useState } from 'react';
import Pref from '/client/global/pref.js';

const ToggleSearch = ({ queryUP, resultUP })=> {
	
	const [ tggl, tgglSet ] = useState( true );
	

  function serialAction(value) {
    resultUP(undefined);
    Meteor.call('serialLookupPartial', value, (error, reply)=>{
      error && console.log(error);
      resultUP(reply);
	  });
  }
  
	function handleSmarts(e) {
    const value = e.target.value;
    const valid = !value || value.length < 4 ? false : true;
    queryUP(value);
    if(valid) {
      serialAction(value);
    }else{
      resultUP(null);
      e.target.reportValidity();
    }
  }
	
	return(
		<div className='centre space'>
	    
	    
        <p>
      <label className='blackT variableInput bigger'>
      
	    <button
        className={`action big ${tggl ? 'cloudsT black' : 'clearBlack'}`}
          onClick={()=>tgglSet(true)}
        ><i className="fas fa-cubes"></i></button>
        
        <button
          className={`action big ${!tggl ? 'cloudsT black' : 'clearBlack'}`}
          onClick={()=>tgglSet(false)}
        ><i className="fas fa-qrcode"></i></button>
        
      </label>
          <input
            id='multiSearch'
            type='search'
            pattern={tggl ? '[A-Za-z0-9 _-]*' : '[0000000000-9999999999]*'}
            minLength={tggl ? '0' : '4'}
            className='variableInput bigger'
            onChange={(e)=>handleSmarts(e)}
            autoFocus={true}
            required />
        </p>
        <p>{tggl ? `Find a ${Pref.batch} by number, ${Pref.group}, ${Pref.widget} or tag.` : 
                   `Find an item by whole or partial serial number`}
        </p>
      
      </div>
  );
};

export default ToggleSearch;