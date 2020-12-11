import React from 'react';

import LeapLine from '/client/components/tinyUi/LeapLine';

const SerialResult = ({ queryState, resultState })=> {
	
	const re = resultState ? resultState[0] : resultState;
	const ex = resultState ? resultState[1] : false;
	
	return(
		<div className='centre centreText'>
      {re === null || !queryState ?
        null
      : ex === true ?
        <LeapLine
          key='1a'
          title={re[0][0]}
          cTwo={re[0][1]}
          cThree={queryState}
          sty='greenB'
          address={'/data/batch?request=' + re[0][0] + '&specify=' + queryState}
        />
      :
        re.map( (entry, index)=> {
          return (
            <LeapLine
              key={index}
              title={entry[0]}
              cTwo={entry[1]}
              cThree=''
              address={'/data/batch?request=' + entry[0]}
            />
        )})
      }
    </div>
	);
};

export default SerialResult;