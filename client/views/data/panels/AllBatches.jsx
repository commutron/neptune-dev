import { Meteor } from 'meteor/meteor';
import React from 'react';

const AllBatches = ({ groupData, widgetData, batchData, app }) => {
            
  return(
    <div className='centre wide'>
      <div className='centre'>
        {batchData.map( (entry, index)=>{
          return(
            <button
              key={index}
              className='action clear'
              onClick={()=>FlowRouter.go('/data/batch?request=' + entry.batch)}
            >{entry.batch}</button>
        )})}
        <hr />
        
        <button
          className='action clear'
          onClick={()=>FlowRouter.go('/data/group?request=protogen')}
        >Protogen</button>
      </div>
    </div>
  );
};

export default AllBatches;
              
              
              
              