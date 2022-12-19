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
          forceTask={brancheS.find( b=> b.brKey === eqData.branchKey)?.branch || 'Facility'}
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
  
  const atIssue = timeOpen?.project.split("[+]")[1];
  const eqIssue = atIssue && eqData.issues ? eqData.issues.find( i => i.issueKey === atIssue ) : false;
  
  function handleAppendIssue(issueKey) {
    if(tideKey) {
      Meteor.call('assignTimeToIssue', tideKey, issueKey, (err)=>{
        err && console.log(err);
      });
    }
  }
  
  function handleLog(logtext) {
    if(logtext.length > 0) {
      Meteor.call('logEqIssue', eqData._id, atIssue, logtext, (err, re)=>{
        err && console.log(err);
        if(re) {
          null;
        }else{
          toast.warning('Not Allowed');
        }
      });
    }
  }
  
  return(
    <div className='midnightblue'>
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
          forceTask={brancheS.find( b=> b.brKey === eqData.branchKey)?.branch || 'Facility'}
          forceSubTask={Pref.fixmaintain}
          lockOut={false}
        />  
      :
        <div className='centreText overscroll spacehalf'>
          {atIssue ?
            <div>
              <p className='small'>Repair time assigned to issue:</p>
              <p className='medBig'>{eqIssue.title}</p>
              
              <dl className='leftText readlines'>
                {eqIssue.problog.map( (l, ix)=> (
                  <dd key={ix} className='bottomLine vspacehalf'>{l.text}</dd>
                ))}
              </dl>
              
              <form 
                onSubmit={(e)=>{
                  e.preventDefault();
                  handleLog(this[atIssue+'addislog'].value.trim());
                  this[atIssue+'addislog'].value = '';
              }}
                className='vspacehalf'
              >
                <label>Action / Troubleshooting<br />
                  <textarea id={atIssue+'addislog'} rows='1' className='adaptStone wetasphalt' required></textarea>
                </label>
                <div className='rightText'>
                  <button type='submit' className='action wetSolid'>Post</button>
                </div>
              </form>
            </div>
          :
            <label>Assign Repair Time to Specific Issue<br />
              <select id='eqissuekey'
                className='darkTheme adaptStone'
                onChange={()=>handleAppendIssue(this.eqissuekey.value)}
                defaultValue={atIssue || false}
                required>
                <option value={false}></option>
                {(eqData.issues || []).map( (i, ix)=> {
                  if(i.open) {
                    return( <option key={ix} value={i.issueKey}>{i.title}</option> );
                }})}
              </select>
            </label>
          }
        
        
        </div>
      }
    </div>
  );
};