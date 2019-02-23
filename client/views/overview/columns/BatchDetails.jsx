import React, {Component} from 'react';
import moment from 'moment';


const BatchDetails = ({wBs, cBs, bCache})=> {
    
  return(
    <div className='overGridScroll'>
      <div className='overGridHeaderScroll'>
        <div>Sales Order</div>
        <div>Due Date</div>
      </div>
            
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
        <span>{ck.salesOrder}</span>
        <span>{ck.salesEnd}</span>
        <span>{ck.timeElapse}</span>
        <span>{ck.weekDaysRemain}</span>
        <span>{ck.itemQuantity}</span>
        <span>{ck.percentOfDoneItems}</span>
        <span>{ck.nonConTotal}</span>
        <span>{ck.percentOfNCitems}</span>
        <span>{ck.nonConsPerNCitem}</span>
        <span>{ck.itemHasRMA}</span>
        <span>{ck.itemIsScrap}</span>
        <span>{ck.isActive.toString()}</span>
  </div>
);