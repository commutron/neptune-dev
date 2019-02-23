import React, {Component} from 'react';
import moment from 'moment';


const BatchDetails = ({wBs, cBs, bCache})=> {
  
  /*
  let headers = wBs && wBs.length > 0 ? Object.keys(wBs[0]) :
                cBs && cBs.length > 0 ? Object.keys(cBs[0]) :
                [];
  headers.length > 0 && headers.shift();
  console.log(headers);
  */
  
  return(
    <div className='overGridScroll'>
            
      {wBs.map( (entry, index)=>{
        return(
          <BatchDetailChunk
            key={`${entry.batchID}warm${index}`}
            ck={entry} />
      )})}
      
      {cBs.map( (entry, index)=>{
        return(
          <BatchDetailChunk 
            key={`${entry.batchID}cool${index}`}
            ck={entry} />
      )})}
      
    </div>
  
  );
};

export default BatchDetails;


const BatchDetailChunk = ({ck})=> (

  <div className='overGridRowScroll'>
        <div>{ck.salesOrder}</div>
        <div>{ck.salesEnd}</div>
        <div>{ck.timeElapse}</div>
        <div>{ck.weekDaysRemain}</div>
        <div>{ck.itemQuantity}</div>
        <div>{ck.percentOfDoneItems}</div>
        <div>{ck.nonConTotal}</div>
        <div>{ck.percentOfNCitems}</div>
        <div>{ck.nonConsPerNCitem}</div>
        <div>{ck.itemHasRMA}</div>
        <div>{ck.itemIsScrap}</div>
        <div>{ck.isActive.toString()}</div>
  </div>
);