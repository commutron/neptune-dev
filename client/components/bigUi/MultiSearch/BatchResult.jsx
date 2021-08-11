import React from 'react';

import LeapLine from '/client/components/tinyUi/LeapLine';

const BatchResult = ({ 
  queryState, resultState, listLimit
})=> (
  <div className='centre'>
    {resultState && resultState.map( (ent, index)=> {
      if(ent.length > 5 && index <= listLimit) {
        const sty = !ent[5] ? 'numFont gMark' : 'numFont activeMark';
        return(
          <LeapLine
            key={"wo"+index}
            title={ent[0].toUpperCase()}
            cTwo={<i><i className='smaller'>so: </i>{ent[1].toUpperCase()}</i>}
            cThree={`${ent[2].toUpperCase()}`}
            cFour={`${ent[3].toUpperCase()} v.${ent[4]}`}
            sty={sty}
            address={'/data/batch?request=' + ent[0]}
          />
    )}})}
	</div>
);

export default BatchResult;