import React, { Fragment, useState, useEffect } from 'react';
import moment from 'moment';
import 'moment-timezone';

import Pref from '/client/global/pref.js';
import { CalcSpin } from '/client/components/tinyUi/Spin.jsx';


import ReportBasicTable from '/client/components/tables/ReportBasicTable.jsx'; 

const ReportShort = ({ app, user, isDebug })=> {
  
  const [shortData, setShortData] = useState(false);
  
  useEffect(() => {
    Meteor.call('fetchShortfalls', (err, rtn)=>{
	    err && console.log(err);
	    const cronoTimes = rtn.sort((x1, x2)=> 
	                        x1[6] > x2[6] ? 1 : x1[6] < x2[6] ? -1 : 0 );
      cronoTimes.unshift([
          Pref.batch, 'sales order', 'product', 
          'serial number', 'part number', 'referances', 'time'
        ]);
      setShortData(cronoTimes);
	  });
    isDebug && console.log(dayData);
    
    // and kill it to not hang state update?
  }, []);
  
                     
  return(
    <div className='space5x5 invert overscroll'>
      <div className='med vbreak comfort middle'>
        <div className='line2x'>
          
        </div>
      
      </div>
      
      <h3 className='orangeBorder centreText'>Prototype. Not verified. Not tested for performance.</h3>
      
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