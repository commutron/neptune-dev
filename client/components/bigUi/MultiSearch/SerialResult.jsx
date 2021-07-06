import React from 'react';

import LeapLine from '/client/components/tinyUi/LeapLine';

const SerialResult = ({ queryState, resultState, listLimit })=> {
	
	const re = resultState;
	
	return(
		<div className='centre centreText'>
      {re === null || !queryState ?
        null
      :
        re.map( (entry, index)=> {
          if(index <= listLimit) {
            if(entry[4] === true) {
              return(
                <LeapLine
                  key='1a'
                  title={entry[0]}
                  cTwo={entry[1]}
                  cThree={`${entry[2].toUpperCase()} ${entry[3]}`}
                  cFour={queryState}
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
                  cThree={`${entry[2].toUpperCase()} ${entry[3]}`}
                  address={'/data/batch?request=' + entry[0]}
                />
              );
            }
          }
        })
      }
    </div>
	);
};

export default SerialResult;