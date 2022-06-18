import React from 'react';
import { withTracker } from 'meteor/react-meteor-data';
import moment from 'moment';
import Pref from '/client/global/pref.js';

import Spin from '/client/components/tinyUi/Spin';
import CreateTag from '/client/components/tinyUi/CreateTag';
import EquipForm from '/client/components/forms/Equip/EquipForm';
import EquipOnline from '/client/components/forms/Equip/EquipOnline';
import EquipRemove from '/client/components/forms/Equip/EquipRemove';
import ServeForm from '/client/components/forms/Equip/ServeForm';
import ServeRemove from '/client/components/forms/Equip/ServeRemove';
import TasksForm from '/client/components/forms/Equip/TasksForm';


const EquipSlide = ({ equipData, maintainData, app, brancheS, isERun })=>{
  
  console.log({slide: equipData, maintainData});
  
  const eq = equipData;
  
  // safety
  
  // helmet-safety
  // scissors
  // shield
  // faucet-drip shower
  // wind
  // fire
  // bolt
  // radiation
  // biohazard
  // skull-crossbones
  // person-falling
  // hand-dots
  // mask-ventilator
  // mask-face
 
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
      
      <hr />
      
      <div>
      {eq.service.map( (sv)=>{
        const maint = maintainData.filter( m => m.serveKey === sv.serveKey );
        return(
        <div key={sv.serveKey} className='max400 borderTeal bottomLine'>
          <p><em>Last modified: {moment(sv.updatedAt).format('ddd MMMM Do, YYYY. h:mm a,')}</em></p>
          <p>Cycle: {sv.timeSpan}</p>
          <p>Frequency: {sv.recur}</p>
          <p>Day of Cycle: {sv.whenOf} <n-sm>(index number)</n-sm></p>
          <p>Workdays to Complete: {sv.period}</p>
          <p>Workdays Late Grace: {sv.grace}</p>
          <ServeForm
            id={eq._id}
            service={sv}
            lockOut={!eq.online}
          />
          {maint.length === 0 &&
            <ServeRemove
              id={eq._id}
              serveKey={sv.serveKey}
              lockOut={!eq.online}
            />
          }
          <hr />
          <dl>
          {sv.tasks.map( (entry, index)=>( 
            <dt key={index} className='bottomLine'>☑ {entry}</dt>
          ))}
          </dl>
          <TasksForm
            id={eq._id}
            serveKey={sv.serveKey}
            tasks={sv.tasks}
            lockOut={!eq.online}
          />
        </div>
      )})}
      </div>
      
      
      <div>
      {maintainData.toString()}
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
  app, brancheS, isERun 
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
      brancheS={brancheS}
      isERun={isERun}
    />
  );
};

export default withTracker( ({ equipLite, app, brancheS, isERun }) => {
  const hotSub = Meteor.subscribe('hotEquip', equipLite._id);

  return {
    hotReady: hotSub.ready(),
    app: app,
    brancheS: brancheS,
    isERun: isERun,
    equipData: EquipDB.findOne({_id: equipLite._id}, { sort: { alias: -1 } } ),
    maintainData: MaintainDB.find({equipId: equipLite._id}, { sort: { burden: -1 } } ).fetch(),
  };
})(EquipData);