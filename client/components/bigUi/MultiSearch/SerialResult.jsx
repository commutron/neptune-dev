import React, { useState } from 'react';

import LeapRow from '/client/components/tinyUi/LeapRow.jsx';

const SerialResult = ({ queryState, resultState })=> {
	
	const re = resultState ? resultState[0] : resultState;
	const exact = resultState ? resultState[1] : false;
	
	return(
		<div className='centre space'>
	  
	    <div className='tableList'>
    
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
            cThree={queryState}
            sty='greenB'
            address={'/data/batch?request=' + re[0].batch + '&specify=' + queryState}
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

export default SerialResult;