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
  			<p className='bigbig cap'>{m.name} {Pref.maintain}</p>
        
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
          subOptions={[]}
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

export const RepairCard = ({ eqData, brancheS, tideKey, timeOpen, engagedPro, engagedMlti })=> {
  
  // const [ issueKey, issueSet ] = useState(false);
  
  return(
    <div className='stoneForm midnightblue'>
			<div className='space1v centreText'>
  			<p className='bigger cap'>{eqData.alias} Repair</p>
        
        <div className='medBig spacehalf balancer'>
        
        {eqData.online ?
          <div className='margin5'
          ><n-fa1><i className='fa-solid fa-rss greenT fa-2x fa-fw' data-fa-transform="rotate-315 up-2"></i></n-fa1>
          <br /><small>Online</small>
          </div>
        :
          <div className='margin5'
          ><n-fa0><i className='fa-solid fa-circle wetasphaltT fa-2x fa-fw' data-fa-transform="shrink-10 down-5"></i></n-fa0>
          <br /><small>Offline</small>
          </div>
        }
        
        {eqData.hibernate ?
          <div className='margin5'
          ><n-fa0><i className='fa-solid fa-plug-circle-xmark wetasphaltT fa-2x fa-fw'></i></n-fa0>
          <br /><small>{Pref.eqhib}</small>
          </div>
        :
          <div className='margin5'
          ><n-fa1><i className='fa-solid fa-plug-circle-bolt greenT fa-2x fa-fw'></i></n-fa1>
          <br /><small>Connected</small>
          </div>
        }
        
        </div>
        
      </div>
      
      {!timeOpen ?
        <TimeGate
          timeId={tideKey}
          timeOpen={timeOpen}
          type='EQFX'
          link={eqData._id}
          project={'EqFx-' + eqData.alias +' ~ repair<*>'+ eqData._id}
          engagedPro={engagedPro}
          engagedMlti={engagedMlti}
          brancheS={brancheS}
          taskOptions={[]}
          subOptions={[]}
          forceSelect={true}
          forceTask={brancheS.find( b=> b.brKey === eqData.branchKey)?.branch}
          forceSubTask={Pref.fixmaintain}
          lockOut={false}
        />  
      :
        <div className='centreText vmargin spacehalf'>
          <p className='medBig'
          >Recording time repairing the {eqData.alias} since {moment(timeOpen.startTime).format('h:mm A')}</p>
        </div>
      }
    </div>
  );
};