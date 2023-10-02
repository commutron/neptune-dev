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
            if(entry[4]) {
              return(
                <LeapLine
                  key={entry[4]}
                  title={entry[0]}
                  cTwo={entry[1]}
                  cThree={`${entry[2].toUpperCase()} ${entry[3]}`}
                  cFour={<span>{entry[4]} {queryState === entry[4] ? 
                    <i className="fas fa-shapes fa-lg fa-fw nT" title='Item'></i> :
                    <i className="fas fa-object-group fa-fw nT" title='Nested Parent'></i>
                  }</span>}
                  address={'/data/batch?request=' + entry[0] + '&specify=' + entry[4]}
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