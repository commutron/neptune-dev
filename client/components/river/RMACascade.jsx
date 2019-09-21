import React, { useState, useEffect } from 'react';
import moment from 'moment';

import RMAFall from './RMAFall.jsx';

// props
/// id={b._id}
/// barcode={i.barcode}
/// rma={rma} // relevent cascades
/// cascadeData={b.cascade} // all cascades
/// rmaList={i.rma}

const RMACascade = (props)=> {
  
  const [ fall, fallSet ] = useState(false);

  useEffect( ()=> {
    Meteor.setTimeout(()=> { // wait for data to be loaded
      Session.get('nowStepKey') === 'c0mp13t3' ?
        fallSet( true ) :
        fallSet( false );
    }, 100);
  }, [props]);

  return (
    <div className='wide'>
      {fall ?
      // RMA activating available after current RMAs are finished
        <RMAFall
          id={props.id}
          cascadeData={props.cascadeData}
          barcode={props.barcode}
          rma={props.rmaList}
          allItems={props.allItems} />
      :null}
      {props.rma.map( (entry, index)=>{
      // list rmas active on this item  
        if(index == props.rma.length - 1) {
        // current rma is bold
          return(
            <div key={index} className='bleed cap fadeRed centre'>
              <b>RMA: {entry.rmaId}, {moment(entry.time).calendar()}</b>
              {/*<p>{entry.comm}</p>*/}
            </div>
            );
        }else{
        // previous rmas are italic
          return(
            <div key={index} className='bleed cap fadeRed centre'>
              <i>RMA: {entry.rmaId}, {moment(entry.time).calendar()}</i>
            </div>
            );
        }})
      }
    </div>
  );
};

export default RMACascade;