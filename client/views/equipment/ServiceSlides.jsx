import React from 'react';
import moment from 'moment';
import 'moment-business-time';
import Pref from '/client/global/pref.js';

import TabsVert from '/client/components/smallUi/Tabs/TabsVert';

import ServeForm from '/client/components/forms/Equip/ServeForm';
import ServeDisable from '/client/components/forms/Equip/ServeDisable';
import ServeRemove from '/client/components/forms/Equip/ServeRemove';
import TasksForm from '/client/components/forms/Equip/TasksForm';

import MainHistory from './MainHistory';
import NumStatRing from '/client/components/charts/Dash/NumStatRing.jsx';

const ServiceSlides = ({ 
  equipData, maintainData, nowD, weekday, monthday, month,
  isDebug
})=> {
  
  const eq = equipData;
  
  const svNames = eq.service.map((sv)=>sv.name);
  
  return(
    <TabsVert 
      tabs={svNames} 
      extraClass='popSm vmargin overscroll'
      contentClass='spacehalf'>
      {eq.service.map( (sv)=>{
          const maint = maintainData.filter( m => m.serveKey === sv.serveKey )
                                    .sort((x1, x2)=> x1.close < x2.close ? 1 : 
                                                     x1.close > x2.close ? -1 : 0
                        );
          const sving = maint.find( m => nowD > m.open && nowD < m.expire );
          const cmplt = maint.filter( m => m.status === 'complete' ).length;
          const inplt = maint.filter( m => m.status === 'incomplete' ).length;
          const ntrqd = maint.filter( m => m.status === 'notrequired' ).length;
          const missd = maint.filter( m => m.status === 'missed' ).length;
          const nxtcr = maint.filter( m => !m.status ).length;
          
          return(
          <div key={sv.serveKey} className='w100'>
            <div className='comfort'>
          
              <div className='big cap gap middle'>{sv.name}</div>
          
              <div className='centreRow vmarginhalf'>
                <TasksForm
                  id={eq._id}
                  serveKey={sv.serveKey}
                  name={sv.name}
                  tasks={sv.tasks}
                  lockOut={eq.hibernate}
                />
                <ServeForm
                  id={eq._id}
                  service={sv}
                  lockOut={eq.hibernate}
                  servicing={sving}
                />
                
                <ServeDisable
                  id={eq._id}
                  serveKey={sv.serveKey}
                  disable={sv.disable}
                  lockOut={eq.hibernate}
                  name={sv.name}
                  opendates={maintainData.filter( m => m.serveKey === sv.serveKey && m.status === false )}
                />

                {maintainData.filter( m => 
                  m.serveKey === sv.serveKey && m.status !== false )
                  .length === 0 &&
                  <ServeRemove
                    id={eq._id}
                    serveKey={sv.serveKey}
                    lockOut={eq.hibernate}
                    name={sv.name}
                    opendates={maintainData.filter( m => m.serveKey === sv.serveKey && m.status === false )}
                  />
                }
              </div>
            </div>
            
            
              <div className='comfort'>
                <div className='margin5'>
                  <p>Last Modified: <n-num>{moment(sv.updatedAt).format('MMMM Do, YYYY. h:mm a,')}</n-num></p>
                  <p className='cap'>Frequency: <n-num>{sv.recur} {sv.timeSpan}{sv.recur > 1 ? 's' : ''}</n-num></p>
                  <p className='cap'>Due/Cycle Day: <n-num>{
                    sv.timeSpan === 'year' ? month[sv.whenOf] : 
                    sv.timeSpan === 'month' ? monthday[sv.whenOf] : 
                    weekday[sv.whenOf]
                  } of {sv.timeSpan}</n-num></p>
                  <p>Workdays To Complete: <n-num>{sv.period}</n-num></p>
                  <p>Workdays Late Grace: <n-num>{sv.grace}</n-num></p>
                  
                  <dl className='overscroll max500'>
                    <dt className='vmarginquarter'>Checklist:</dt>
                    {sv.tasks.map( (entry, index)=>( 
                      <dd key={index} className='line15x cap'>☑ {entry}</dd>
                    ))}
                  </dl>
                </div>
                
                <div className='centre overscroll'>
                  <NumStatRing
                    total={`${cmplt} /${maint.length}`}
                    nums={[cmplt, inplt, ntrqd, missd]}
                    name='Completed'
                    title={`${maint.length} Events\n${cmplt} Completed\n${inplt} Incomplete\n${ntrqd} Not Required\n${missd} Missed\n${nxtcr} Scheduled`}
                    colour={['#2c3e50','#34495e80','rgb(243, 156, 18)','#bdc3c7']}
                    maxSize='chart10Contain'
                  />
                </div>
              </div>
            
              <MainHistory maintData={maint} sving={sving} isDebug={isDebug} />
          </div>
        )})}
        
    </TabsVert>
  );
};

export default ServiceSlides;