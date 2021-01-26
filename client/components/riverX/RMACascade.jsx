import React, { useState, useEffect } from 'react';
import moment from 'moment';

import RMAFall from './RMAFall.jsx';

const RMACascade = ({ 
  id, barcode, rma, 
  cascadeData, rmaList, allItems 
})=> {
  
  const [ fall, fallSet ] = useState(false);

  useEffect( ()=> {
    Meteor.setTimeout(()=> { // wait for data to be loaded
      Session.get('nowStepKey') === 'c0mp13t3' ?
        fallSet( true ) :
        fallSet( false );
    }, 100);
  }, [cascadeData]);

  return (
    <div className='wide'>
      {fall ?
      // RMA activating available after current RMAs are finished
        <RMAFall
          id={id}
          cascadeData={cascadeData}
          barcode={barcode}
          rma={rmaList}
          allItems={allItems} />
      :null}
      {rma.map( (entry, index)=>{
      // list rmas active on this item  
        if(index == rma.length - 1) {
        // current rma is bold
          return(
            <div key={index} className='bleed cap fadeRed centreText'>
              <b>RMA: {entry.rmaId},</b>
              <b>{moment(entry.time).calendar()}</b>
              {/*<p>{entry.comm}</p>*/}
            </div>
            );
        }else{
        // previous rmas are italic
          return(
            <div key={index} className='bleed cap fadeRed centre'>
              <em>RMA: {entry.rmaId},</em>
              <em>{moment(entry.time).calendar()}</em>
            </div>
            );
        }})
      }
    </div>
  );
};

export default RMACascade;