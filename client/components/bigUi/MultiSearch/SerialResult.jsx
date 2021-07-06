import React from 'react';

import LeapLine from '/client/components/tinyUi/LeapLine';

const SerialResult = ({ queryState, resultState })=> {
	
	const re = resultState;
	
	return(
		<div className='centre centreText'>
      {re === null || !queryState ?
        null
      :
        re.map( (entry, index)=> {
          if(entry[2] === true) {
            return(
              <LeapLine
                key='1a'
                title={entry[0]}
                cTwo={entry[1]}
                cThree={queryState}
                sty='greenB'
                address={'/data/batch?request=' + entry[0] + '&specify=' + queryState}
              />
            );
          }else{
            return (
              <LeapLine
                key={index}
                title={entry[0]}
                cTwo={entry[1]}
                cThree=''
                address={'/data/batch?request=' + entry[0]}
              />
            );
          }
        })
      }
    </div>
	);
};

export default SerialResult;