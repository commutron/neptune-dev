import React, { useMemo } from 'react';
import moment from 'moment';
import 'moment-business-time';
import Pref from '/client/global/pref.js';

import TimeGate from '/client/components/tide/TimeGate';
import ServiceDock from '/client/components/riverX/ServiceDock';

const ServiceCard = ({ eqData, maintData, brancheS, tideKey, timeOpen, engagedPro, engagedMlti })=> {
  
  const m = maintData;
  
  const serve = useMemo( ()=> 
          eqData.service.find( s => s.serveKey === m.serveKey ),
          [eqData, maintData]);

  return(
    <div className='stoneForm midnightblue'>
			<div className='space1v centreText'>
  			<p className='bigbig cap'>{m.name}</p>
        
        {m.status === 'complete' &&
          <p className='medBig spacehalf green'>Service Completed<br />{moment(m.doneAt).format('MMMM Do h:mm a')}</p>}
        
        <p className='medBig'>Service Due {moment(m.close).format('dddd MMMM Do')}</p>
        
        <p className='medSm vmarginquarter'>Grace period ends {moment(m.expire).format('dddd MMMM Do')}</p>
      </div>
      
      {!timeOpen ?
        <TimeGate
          timeId={tideKey}
          timeOpen={timeOpen}
          type='MAINT'
          link={m._id}
          project={'Eq-' + eqData.alias +' ~ '+ m.name +'<*>'+ m._id}
          engagedPro={engagedPro}
          engagedMlti={engagedMlti}
          brancheS={brancheS}
          taskOptions={[]}
          subOptions={[Pref.premaintain]}
          forceSelect={true}
          forceTask={brancheS.find( b=> b.brKey === eqData.branchKey)?.branch}
          forceSubTask={Pref.premaintain}
          lockOut={moment().isAfter(maintData.expire)}
        />  
      :
        <ServiceDock
          maintData={maintData}
          serve={serve}
        />
      }
    </div>
  );
};

export default ServiceCard;