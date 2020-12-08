import React, { useState } from 'react';

import LeapRow from '/client/components/tinyUi/LeapRow.jsx';

const SerialLookup = (props)=> {
	
	const [ searchText, setText ] = useState( false );
	const [ results, setResults ] = useState( null );
	const [ exact, setExact ] = useState( false );
    
	function handleSmarts(e) {
    const value = e.target.value;
    const valid = !value || value.length < 4 ? false : true;
    if(valid) {
     setText(value);
     setResults(undefined);
      Meteor.call('serialLookupPartial', value, (error, reply)=>{
        error && console.log(error);
        setResults(reply.results); 
        setExact(reply.exact);
  	  });
    }else{
      setResults(null);
      e.target.reportValidity();
    }
  }
	
	const re = results;
	
	return(
		<div className='centre space'>
	  
	    <div className='tableList'>
	  
	    <div className='centre noCopy'>
        <p>
          <label className='blackT variableInput bigger'>
            <i className='bigger fas fa-search fa-fw'></i>
          </label>
          <input
            id='serialNum'
            className='cap'
            type='search'
            pattern='[0000000000-9999999999]*'
            minLength='4'
            className='variableInput bigger'
            disabled={false}
            onChange={(e)=>handleSmarts(e)}
            autoFocus={true}
            required />
        </p>
        <p>Find an item serial number with fuzzy search</p>
      </div>
    
      {re === null ?
        <div></div>
      : re === undefined ?
        <div>
          <p className='centreText'><em>looking</em></p>
        </div>
      : re === false || re.length === 0 ?
	      <div>
          <p className='centreText'><b>NO RESULT</b></p>
        </div>
      : exact === true ?
        <div>
          <LeapRow
            key='1a'
            title={re[0].batch}
            cTwo={re[0].meta}
            cThree={searchText}
            sty='greenB'
            address={'/data/batch?request=' + re[0].batch + '&specify=' + searchText}
          />
        </div>
      :
        re.map( (entry, index)=> {
          return (
            <LeapRow
              key={index}
              title={entry.batch}
              cTwo={entry.meta}
              address={'/data/batch?request=' + entry.batch}
            />
        )})
      }
      </div>    
          
    </div>
	);
};

export default SerialLookup;