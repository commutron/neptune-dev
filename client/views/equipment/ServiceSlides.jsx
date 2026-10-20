import React, { Fragment } from 'react';
import moment from 'moment';
import 'moment-business-time';

import TabsVert from '/client/components/smallUi/Tabs/TabsVert';

import ServeForm from '/client/components/forms/Equip/ServeForm';
import ServeDisable from '/client/components/forms/Equip/ServeDisable';
import ServeRemove from '/client/components/forms/Equip/ServeRemove';
// import TasksForm from '/client/components/forms/Equip/TasksForm';
import TasksFormPlus from '/client/components/forms/Equip/TasksFormPlus';

import MainHistory from './MainHistory';
import KpiStat from '/client/components/smallUi/StatusBlocks/KpiStat';

const ServiceSlides = ({ 
  equipData, maintainData, nowD, weekday, monthday, month,
  isEqSup, isEdit, isDebug
})=> {
  
  const eq = equipData;
  
  const svNames = eq.service.map((sv)=>sv.name);
  
  const isEqS_edit = Roles.userIsInRole(Meteor.userId(), ['equipSuper','edit']);
  
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
          // const missd = maint.filter( m => m.status === 'missed' ).length;
          // const nxtcr = maint.filter( m => !m.status ).length;
          
          const req = maint.length - ntrqd;
          
          return(
          <div key={sv.serveKey} className='w100'>
            <div className='comfort'>
          
              <div className='big cap gap beside wrap' style={{flex: '1 1',minWidth: '350px'}}
                ><span>{sv.name}
                <span style={{fontSize:'var(--sm8)',verticalAlign:'super'}} className={`mockTag gapL ${sv.disable ? 'yellow' : 'green'}`}>
                 {sv.disable ? 'Disabled' : 'Enabled'}
                </span></span>
              </div>
          
              <div className='centreRow vmarginhalf'>
                <TasksFormPlus
                  id={eq._id}
                  serveKey={sv.serveKey}
                  name={sv.name}
                  tasks={sv.tasks}
                  qtTime={sv.qtTime || 0}
                  lockOut={eq.hibernate}
                  access={isEqSup || isEdit}
                />
                <ServeForm
                  id={eq._id}
                  service={sv}
                  lockOut={eq.hibernate}
                  servicing={sving}
                  access={isEqSup || isEdit}
                />
                
                <ServeDisable
                  id={eq._id}
                  serveKey={sv.serveKey}
                  disable={sv.disable}
                  lockOut={eq.hibernate}
                  access={isEqSup || isEdit}
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
                    access={isEqSup || isEdit}
                  />
                }
              </div>
            </div>
            
            
            <div className='split flexBal'>
              <div className='margin5 rowWrap gapsC'>
                <span className='startSelf'>
                  <p>Last Modified: <n-num>{moment(sv.updatedAt).format('MMMM Do, YYYY. h:mm a')}</n-num></p>
                  <p className='cap'>Frequency: <n-num>{sv.recur} {sv.timeSpan}{sv.recur > 1 ? 's' : ''}</n-num></p>
                  <p className='cap'>Due/Cycle Day: <n-num>{
                    sv.timeSpan === 'year' ? month[sv.whenOf] : 
                    sv.timeSpan === 'month' ? monthday[sv.whenOf] : 
                    weekday[sv.whenOf]
                  } of {sv.timeSpan}</n-num></p>
                  <p>Workdays To Complete: <n-num>{sv.period}</n-num></p>
                  <p>Workdays Late Grace: <n-num>{sv.grace}</n-num></p>
                </span>
                <dl className='startSelf overscroll max400'>
                    <dt className='vmarginquarter'>Checklist:</dt>
                    {sv.tasks.map( (entry, index)=>{
                      if(Array.isArray(entry)) {
                        return( 
                          <dd key={index} className='line15x cap'
                            >☑ {entry[0]}
                              {entry[1] && <a title={entry[1]} target='_blank' href={entry[1]}><n-fa0><i className="fa-solid fa-paperclip medSm gapL"></i></n-fa0></a>}
                              {entry[2] && <a title={entry[2]} target='_blank' href={entry[2]}><n-fa1><i className="fa-solid fa-image medSm gapL"></i></n-fa1></a>}
                          </dd>
                        );
                      }else{
                        return( 
                          <dd key={index} className='line15x cap'>☑ {entry}</dd>
                        );
                      }
                    })}
                  </dl>
                </div>
                
                <div className='max250'>
                  {sv.qtTime &&
                    <div className='vmarginhalf'>
                      <KpiStat
                        num={<i className='fa-solid fa-hourglass-start fa-fw'></i>}
                        name={sv.qtTime + ' Minutes Quoted'}
                        color='var(--emerald)'
                      />
                    </div>
                  }
                  
                  <KpiStat
                    num={`${cmplt}/${req}`}
                    name='Completed When Required'
                    color='var(--concrete)'
                  />
                  <KpiStat
                    num={inplt}
                    name='Incomplete'
                    color='var(--sunflowerfade)'
                  />
                </div>
            </div> 
            
            <MainHistory 
              maintData={maint} 
              sving={sving} 
              svqtTime={sv.qtTime}
              svData={sv}
              isDebug={isDebug} 
            />
          </div>
        )})}
        
    </TabsVert>
  );
};

export default ServiceSlides;