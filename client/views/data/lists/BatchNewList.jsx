import React, { useState, useEffect, Fragment } from 'react';

import LeapLine from '/client/components/tinyUi/LeapLine';

const BatchNewList = ({ daysBack }) => {
  
  const [ showListState, showListSet ] = useState( [] );

  useEffect( ()=> {
    Meteor.call('newBatchLookup', daysBack, (err, re)=>{
      err && console.log(err);
      re && showListSet(re.sort((b1, b2)=> 
                              b1[0] < b2[0] ? 1 : b1[0] > b2[0] ? -1 : 0 ) );
    });
  }, []);
  
  if(showListState.length > 0) {
    return(
      <Fragment>
        {showListState.map( (ent, index)=> {
          if(!ent[5]) { return null }else{
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
  		</Fragment>
    );
  }
  return null;
};

export default BatchNewList;