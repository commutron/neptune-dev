import React from 'react';
import moment from 'moment';
import { HistoryBlock } from '/client/components/bigUi/ItemFeed/ItemFeed.jsx';

const FirstsTimeline = ({ id, batch, verifyList, doneBatch })=> {

  let sortedVerify = verifyList.sort((x, y)=> {
                      if (moment(x.rec.time).isBefore(y.rec.time)) { return -1 }
                      if (moment(y.rec.time).isBefore(x.rec.time)) { return 1 }
                      return 0;
                    });
                    
  return(
    <div className='scrollWrap'>
      <div className='infoFeed'>
        <p>Combined timeline of First-Off Verifications</p>
        {sortedVerify.map( (dt, ix)=>{
          return( 
            <HistoryBlock
              key={dt.rec.key+ix}
              entry={dt.rec}
              id={id}
              batch={batch}
              serial={dt.serial}
              done={doneBatch}
              showHeader={true} /> 
          )})
        }
      </div>
    </div>
  );
};

export default FirstsTimeline;