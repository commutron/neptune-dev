import React from 'react';
import moment from 'moment';

import ExploreLinkBlock from '/client/components/tinyUi/ExploreLinkBlock.jsx';


const BatchHeaders = ({b, bC})=> {


  return(
    <div className='overGridFixed'>
      {b.map( (entry, index)=>{
        const moreInfo = bC ? bC.dataSet.find( x => x.batch === entry.batch) : false;
        const what = moreInfo ? moreInfo.isWhat : 'unavailable';

        return(
          <div key={`${entry._id}fixed${index}`}>
            <span className='big'>
              <ExploreLinkBlock type='batch' keyword={entry.batch} />
            </span>
            <span>{what}</span>
          </div>
              
      )})}
    </div>
  
  );
};

export default BatchHeaders;