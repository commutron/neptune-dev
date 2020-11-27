import React, { useState, useEffect } from 'react';
import Pref from '/client/global/pref.js';

import { CalcSpin } from '/client/components/tinyUi/Spin.jsx';

import ReportBasicTable from '/client/components/tables/ReportBasicTable.jsx'; 

const ReportShort = ({ app, user, isDebug })=> {
  
  const [shortData, setShortData] = useState(false);
  
  useEffect(() => {
    Meteor.call('fetchShortfallParts', (err, rtn)=>{
	    err && console.log(err);
	    const cronoTimes = rtn.sort((x1, x2)=> 
	                        x1[3] > x2[3] ? 1 : x1[3] < x2[3] ? -1 : 0 );
      cronoTimes.unshift([
          Pref.batch, 'sales order', 'product', 
          'part number', 'references', 'piece quantity'
        ]);
      setShortData(cronoTimes);
	  });
    isDebug && console.log(shortData);
  }, []);
                     
  return(
    <div className='space5x5 invert overscroll'>

      {!shortData ?
        <CalcSpin />
      :
      shortData.length === 0 ?
        <div>
          <p className='centreText'><i className="fas fa-ghost fa-4x grayT fade"></i></p>
          <p className='medBig centreText line3x'>No unresolved {Pref.shortfalls}</p>
        </div>
      :
      
      <ReportBasicTable 
        title={`unresolved ${Pref.shortfalls} report`}
        dateString={(new Date).toISOString()}
        rows={shortData}
      />
      }
      
    </div>
  );
};

export default ReportShort;