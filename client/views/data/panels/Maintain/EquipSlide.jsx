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


const EquipSlide = ({ equipData, maintainData, app, users, brancheS })=>{
  
  console.log({slide: equipData, maintainData});
  
  const eq = equipData;
  
  /*
  const nextMaint = (sv)=> {
    const st = moment(sv.nextAt);
    
    let next = sv.whenOf === 'endOf' ? 
                  st.endOf(sv.timeSpan) :
                sv.whenOf === 'startOf' ? 
                  st.startOf(sv.timeSpan) :
                sv.timeSpan === 'week' ?
                  st.day(sv.whenOf).endOf('day') :
                sv.timeSpan === 'month' ?
                  st.date(sv.whenOf).endOf('day') :
                  st.month(sv.whenOf).endOf('month');
    
    while(true) {
      if(next.isSameOrAfter(new Date())) {
        const close = sv.whenOf === 'startOf' ?
                next.clone().nextWorkingTime().endOf('day') :
                next.clone().lastWorkingTime().endOf('day');
        
        const openWindow = close.clone().subtractWorkingTime(sv.period - 1, 'days').startOf('day').format();
        
        const expireWndw = close.clone().addWorkingTime(sv.grace, 'days').format();
        
        return {
          open: openWindow,
          close: close.format(),
          expire:expireWndw 
        };
      }else{
        next.add(sv.recur, sv.timeSpan);
      }
    }
  };
  */
  
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
  
  return(
    <div className='section overscroll' key={eq.alias}>
      
      <div className='wide centreText'>
        <h1 className='cap bigger'>{eq.equip}</h1>
        
        <hr className='vmargin' />
      </div>
      
      <div className='wide comfort'>
      
        <EquipOnline
          id={eq._id}
          equip={eq.alias}
          online={eq.online}
        />
          
        <div className='centreRow'>
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
          
          <EquipEmails
            id={eq._id}
            stewards={eq.stewards}
            users={users}
          />
          
          <ServeForm
            id={eq._id}
            service={false}
            lockOut={!eq.online}
          />
          
          {maintainData.length === 0 &&
            <EquipRemove
              id={eq._id}
            />
          }
         
        </div>
        
      </div>
      
      <p>{eq.alias}</p>
      <p>{!eq.branchKey ? 'other/no branch' : brancheS.find( b => b.brKey === eq.branchKey).branch}</p>
      <p>{eq.online ? 'online' : 'offline'}</p>
      
      <p className='w100 capFL vmargin wordBr'>
        {Pref.instruct} Index: {eq.instruct && eq.instruct.indexOf('http') === -1 ?
          app.instruct : null}<a className='clean wordBr' href={eq.instruct} target='_blank'>{eq.instruct}</a>
      </p>
      
      <div>
        <h4 className='cap'>{Pref.steward}s</h4>
        <dl className='vmargin'>
          {(eq.stewards || []).map( (uID, index)=> ( 
            <dt key={index} className='cap'
            >{users.find( u => u._id === uID )?.username?.replace('.', ' ')?.replace('_', ' ')}</dt>
          ))}
        </dl>
      </div>
      
      <hr />
      
      <div>
      {eq.service.map( (sv)=>{
        const maint = maintainData.filter( m => m.serveKey === sv.serveKey );
        const sving = maint.find( m => nowD > m.open && nowD < m.expire );
        
        return(
        <div key={sv.serveKey} className='max400 borderTeal bottomLine'>
          <p><b>{sv.name}</b></p>
          <p><em>Last modified: {moment(sv.updatedAt).format('ddd MMMM Do, YYYY. h:mm a,')}</em></p>
          <p>Frequency: {sv.recur} {sv.timeSpan}{sv.recur > 1 ? 's' : ''}</p>
          <p>Due/Cycle Day: {
            sv.timeSpan === 'year' ? month[sv.whenOf] : 
            sv.timeSpan === 'month' ? monthday[sv.whenOf] : 
            weekday[sv.whenOf]
          } of {sv.timeSpan}</p>
          <p>Workdays to Complete: {sv.period}</p>
          <p>Workdays Late Grace: {sv.grace}</p>
          
          <div>
          <h4>MaintainDB</h4>
          
            {maint.map( (m, ix)=> {
              return(
                <dl key={ix}>
                  <dt>{m.status || 'false'}</dt>
                  <dd>open: {moment(m.open).format()}</dd>
                  <dd>close: {moment(m.close).format()}</dd>
                  <dd>expire: {moment(m.expire).format()}</dd>
                </dl>
          )})}
          
          <p><em>{sving && 'open service'}</em></p>
          
          </div>
          
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
          <hr />
          <dl>
          {sv.tasks.map( (entry, index)=>( 
            <dt key={index} className='bottomLine'>☑ {entry}</dt>
          ))}
          </dl>
          <TasksForm
            id={eq._id}
            serveKey={sv.serveKey}
            name={sv.name}
            tasks={sv.tasks}
            lockOut={!eq.online}
          />
        </div>
      )})}
      </div>
      
      <div className='wide'>
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

const EquipData = ({
  hotReady, // sub
  equipData, maintainData,
  app, users, brancheS 
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
      brancheS={brancheS}
    />
  );
};

export default withTracker( ({ equipLite, app, users, brancheS }) => {
  const hotSub = Meteor.subscribe('hotEquip', equipLite._id);

  return {
    hotReady: hotSub.ready(),
    app: app,
    users: users,
    brancheS: brancheS,
    equipData: EquipDB.findOne({_id: equipLite._id}, { sort: { alias: -1 } } ),
    maintainData: MaintainDB.find({equipId: equipLite._id}, { sort: { name: -1 } } ).fetch(),
  };
})(EquipData);