import React, {Component} from 'react';
import moment from 'moment';


const BatchDetails = ({hBs, lBs, cBs, bCache})=> {
  
  /*
  let headers = wBs && wBs.length > 0 ? Object.keys(wBs[0]) :
                cBs && cBs.length > 0 ? Object.keys(cBs[0]) :
                [];
  headers.length > 0 && headers.shift();
  console.log(headers);
  */
  
  return(
    <div className='overGridScroll'>
            
      {hBs.map( (entry, index)=>{
        return(
          <BatchDetailChunk
            key={`${entry.batchID}hot${index}`}
            source='hot'
            ck={entry} />
      )})}
      
      {lBs.map( (entry, index)=>{
        return(
          <BatchDetailChunk
            key={`${entry.batchID}luke${index}`}
            source='luke'
            ck={entry} />
      )})}
      
      {cBs.map( (entry, index)=>{
        return(
          <BatchDetailChunk 
            key={`${entry.batchID}cool${index}`}
            source='cool'
            ck={entry} />
      )})}
      
    </div>
  
  );
};

export default BatchDetails;


const BatchDetailChunk = ({ck, source})=> (

  <div className='overGridRowScroll' title={`${ck.batch} = ${source}`}>
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
  </div>
);