import React, { useMemo } from 'react';
import moment from 'moment';
import 'moment-business-time';
import Pref from '/client/global/pref.js';

import TimeGate from '/client/components/tide/TimeGate';
import ServiceDock from '/client/components/riverX/ServiceDock';

const ServiceCard = ({ eqData, maintData, brancheS, tideKey, timeOpen, etPro })=> {
  
  console.log({timeOpen, etPro});
  
  const serve = useMemo( ()=> 
          eqData.service.find( s => s.serveKey === maintData.serveKey ),
          [eqData, maintData]);

  return(
    <div className='stoneForm midnightblue'>
			<div className='space1v centreText'>
  			<p className='bigbig'>{maintData.name}</p>
        
        {maintData.status === 'complete' &&
          <p className='medBig spacehalf green'>Service Completed<br />{moment(maintData.doneAt).format('MMMM Do h:mm a')}</p>}
        
        <p className='medBig'>Service Due {moment(maintData.close).format('dddd MMMM Do')}</p>
        
        <p className='medSm vmarginquarter'>Grace period ends {moment(maintData.expire).format('dddd MMMM Do')}</p>
      </div>
      
      {!timeOpen && !etPro ?
        <TimeGate
          timeId={tideKey}
          timeOpen={timeOpen}
          type='MAINT'
          link={maintData._id}
          project={'Eq-' + eqData.alias +' ~ '+ maintData.name +'<*>'+ maintData.serveKey}
          brancheS={brancheS}
          taskOptions={[]}
          subOptions={[Pref.premaintain]}
          forceSelect={true}
          forceTask={brancheS.find( b=> b.brKey === eqData.branchKey)?.branch}
          forceSubTask={Pref.premaintain}
        />  
      :
        <ServiceDock
          maintData={maintData}
          eqId={eqData._id}
          serve={serve}
        />
      }
    </div>
  );
};

export default ServiceCard;