import React from 'react';

import LeapLine from '/client/components/tinyUi/LeapLine';

const BatchResult = ({ 
  queryState, resultState
})=> (
  <div className='centre'>
    {resultState && resultState.map( (ent, index)=> {
      if(typeof ent[0] === 'string') {
      // const tags = ent[5].map( (et, ix)=>{
      //   return(<span key={ix} className='tagFlag'><i>{et}</i></span>);
      // });
        const sty = !ent[6] ? 'numFont gMark' : 'numFont activeMark';
        return(
          <LeapLine
            key={"wo"+index}
            title={ent[0].toUpperCase()}
            cTwo={<i><i className='smaller'>so: </i>{ent[1].toUpperCase()}</i>}
            cThree={`${ent[2].toUpperCase()}`}
            cFour={`${ent[3].toUpperCase()} v.${ent[4]}`}
            // cFive={tags}
            sty={sty}
            address={'/data/batch?request=' + ent[0]}
          />
    )}})}
	</div>
);

export default BatchResult;