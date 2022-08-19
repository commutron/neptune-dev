import React from 'react';
import { withTracker } from 'meteor/react-meteor-data';
import moment from 'moment';
import 'moment-business-time';
import Pref from '/client/global/pref.js';

import Spin from '/client/components/tinyUi/Spin';
import CreateTag from '/client/components/tinyUi/CreateTag';
import EquipForm from '/client/components/forms/Equip/EquipForm';
import EquipOnline from '/client/components/forms/Equip/EquipOnline';
import EquipEmails from '/client/components/forms/Equip/EquipEmails';
import EquipRemove from '/client/components/forms/Equip/EquipRemove';
import ServeForm from '/client/components/forms/Equip/ServeForm';
import ServeRemove from '/client/components/forms/Equip/ServeRemove';
import TasksForm from '/client/components/forms/Equip/TasksForm';

import MainHistory from './MainHistory';

const EquipSlide = ({ equipData, maintainData, app, users, isDebug, brancheS })=>{
  
  const eq = equipData;
  
  const weekday = {
    0: 'sunday',
    1: 'monday',
    2: 'tuesday',
    3: 'wednesday',
    4: 'thursday',
    5: 'friday',
    6: 'saturday',
    startOf: 'start',
    endOf: 'end'
  };
  
  const monthday = {
    1:"1st", 2:"2nd", 3:"3rd", 4:"4th", 5:"5th",
    6:"6th", 7:"7th", 8:"8th", 9:"9th", 10:"10th",
    11:"11th", 12:"12th", 13:"13th", 14:"14th", 15:"15th",
    16:"16th", 17:"17th", 18:"18th", 19:"19th", 20:"20th",
    21:"21st", 22:"22nd", 23:"23rd", 24:"24th", 25:"25th",
    26:"26th", 27:"27th", 28:"28th", 29:"29th", 30:"30th", 31:"31st",
    startOf: 'start',
    endOf: 'end'
  };
  
  const month = {
    0: "January",
    1: "Febuary",
    2: "March",
    3: "April",
    4: "May",
    5: "June",
    6: "July",
    7: "August",
    8: "September",
    9: "October",
    10: "November",
    11: "December",
    startOf: 'start',
    endOf: 'end'
  };
  
  const nowD = new Date();
  
  const shrtI = eq.instruct && eq.instruct.indexOf('http') === -1;
  
  return(
    <div className='section overscroll' key={eq.alias}>
      
      <div className='wide centreText'>
        <h1 className='cap bigger'>{eq.equip}</h1>
        
        <hr className='vmargin' />
      </div>
      
      <div className='wide rowWrapR'>
      
        <div className='centreRow'>
          <EquipOnline
            id={eq._id}
            equip={eq.alias}
            online={eq.online}
          />
          
          <h3 className='spacehalf gapL'
          >{!eq.branchKey ? 'other/no branch' : 
            brancheS.find( b => b.brKey === eq.branchKey).branch}
          </h3>
        </div>
        
        <span className='flexSpace' />
          
        <div className='centreRow vmarginquarter'>
          <EquipForm
            id={eq._id}
            name={eq.equip}
            alias={eq.alias}
            brKey={eq.branchKey}
            wiki={eq.instruct}
            rootURL={app.instruct}
            brancheS={brancheS}
            noText={false}
            primeTopRight={false}
            lockOut={!eq.online}
          />
          
          <ServeForm
            id={eq._id}
            service={false}
            lockOut={!eq.online}
          />
          
          <EquipEmails
            id={eq._id}
            stewards={eq.stewards}
            users={users}
          />
          
          {maintainData.length === 0 &&
            <EquipRemove
              id={eq._id}
            />
          }
         
        </div>
        
      </div>
      
      <p className='w100 vmarginhalf capFL wordBr'>
        {Pref.instruct} Index: {shrtI ? app.instruct : null}
        <a 
          className='clean wordBr' 
          href={shrtI ? app.instruct + eq.instruct : eq.instruct} 
          target='_blank'
        >{eq.instruct}</a>
      </p>
      
      <dl className='vmarginhalf'>
        <dt className='cap'>{Pref.steward}s:</dt>
        {(eq.stewards || []).map( (uID, index)=> ( 
          <dd key={index} className='cap'
          >{users.find( u => u._id === uID )?.username?.replace('.', ' ')?.replace('_', ' ')}</dd>
        ))}
      </dl>
      
      <hr className='vmargin' />
      
      <div className='cardify autoFlex overscroll'>
      {eq.service.map( (sv)=>{
        const maint = maintainData.filter( m => m.serveKey === sv.serveKey )
                                  .sort((x1, x2)=> x1.close < x2.close ? 1 : 
                                                   x1.close > x2.close ? -1 : 0
                      );
        const sving = maint.find( m => nowD > m.open && nowD < m.expire );
        
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
                lockOut={!eq.online}
              />
              <ServeForm
                id={eq._id}
                service={sv}
                lockOut={!eq.online}
                servicing={sving}
              />
              <ServeRemove
                id={eq._id}
                serveKey={sv.serveKey}
                lockOut={!eq.online}
                name={sv.name}
                opendates={maintainData.filter( m => m.serveKey === sv.serveKey && m.status === false )}
              />
            </div>
          </div>
          
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
            
            <dl className='overscroll'>
              <dt className='vmarginquarter'>Checklist:</dt>
              {sv.tasks.map( (entry, index)=>( 
                <dd key={index} className='line2x cap'>☑ {entry}</dd>
              ))}
            </dl>
          </div>
          
          <MainHistory maintData={maint} sving={sving} isDebug={isDebug} />
        
        </div>
      )})}
      </div>
      
      <div className='wide'>
        <p className='smTxt indent'>All deadlines and schedules are calculated in workdays only.</p>
        <p className='smTxt indent'>All deadlines end at the end of the calendar day. (23:59:59 Local Time).</p>
      
        <CreateTag
          when={eq.createdAt}
          who={eq.createdWho}
          whenNew={eq.updatedAt}
          whoNew={eq.updatedWho}
          dbKey={eq._id} />
      </div>
    </div>
  );
};

const EquipHotData = ({
  hotReady, // sub
  equipData, maintainData,
  app, users, isDebug, brancheS 
})=> {

  if( !hotReady ) {
    return(
      <div className='centre wide'>
        <Spin />
      </div>
    );
  }
  
  return(
    <EquipSlide
      equipData={equipData}
      maintainData={maintainData}
      app={app}
      users={users}
      isDebug={isDebug}
      brancheS={brancheS}
    />
  );
};

export default withTracker( ({ equipLite, app, users, isDebug, brancheS }) => {
  const hotSub = Meteor.subscribe('hotEquip', equipLite._id);

  return {
    hotReady: hotSub.ready(),
    app: app,
    users: users,
    isDebug: isDebug,
    brancheS: brancheS,
    equipData: EquipDB.findOne({_id: equipLite._id}, { sort: { alias: -1 } } ),
    maintainData: MaintainDB.find({equipId: equipLite._id}, { sort: { name: -1 } } ).fetch(),
  };
})(EquipHotData);