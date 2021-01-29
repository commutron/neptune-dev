import React from 'react';
import moment from 'moment';
import './style.css';
//import Pref from '/client/global/pref.js';

import CreateBlock from './CreateBlock';
import HistoryBlock from './HistoryBlock';
import NonConBlock from './NonConBlock';
import ShortBlock from './ShortBlock';
// import RmaBlock from './RmaBlock';

const ItemFeedX = ({ 
  batchId, batch, seriesId, serial,
  createTime, createBy,
  history, 
  noncons, ncTypesCombo, brancheS,
  shortfalls,
  done,
  user, app 
})=> {
  
  const assembly = [...history, ...noncons, ...shortfalls];
  
  const ordered = assembly.sort((t1, t2)=>
          moment(t1.time || t1.cTime).isAfter(t2.time || t2.cTime) ? 1 :
          moment(t1.time || t1.cTime).isBefore(t2.time || t2.cTime) ? -1 : 0 );
  
  const calString = "ddd, MMM D /YY, h:mm A";
  
  const flatCheckList = Array.from(ncTypesCombo, x => 
                                  x.key ? x.live === true && x.typeText : x);
  
  const canQA = Roles.userIsInRole(Meteor.userId(), ['remove', 'qa']);
  const canRun = Roles.userIsInRole(Meteor.userId(), ['qa', 'remove', 'run']);
  const canEdit = Roles.userIsInRole(Meteor.userId(), 'edit');
  const canVerify = Roles.userIsInRole(Meteor.userId(), 'verify');
  const canInspect = Roles.userIsInRole(Meteor.userId(), 'inspect');
  
  return(
    <div className='scrollWrap'>
      <div className='infoFeed'>
      
        <CreateBlock
          title='serial number created'
          user={createBy}
          datetime={createTime}
          calString={calString} />
        
        {ordered.map( (dt, ix)=>{
          if(typeof dt.step === 'string') {
            return( 
              <HistoryBlock
                key={dt.key+ix}
                entry={dt}
                batch={batch}
                seriesId={seriesId}
                serial={serial}
                done={done}
                canEdit={canEdit}
                showHeader={false}
                calString={calString} /> 
            );
          }else if(typeof dt.ref === 'string') {
            return( 
              <NonConBlock
                key={dt.key+ix}
                entry={dt}
                seriesId={seriesId}
                serial={serial}
                done={done}
                user={user}
                canQA={canQA}
                canVerify={canVerify}
                canInspect={canInspect}
                app={app}
                ncTypesCombo={ncTypesCombo}
                flatCheckList={flatCheckList}
                brancheS={brancheS}
                calString={calString} />
            );
          }else if(Array.isArray(dt.refs) === true) {
            return( 
              <ShortBlock
                key={dt.key+ix}
                entry={dt}
                seriesId={seriesId}
                serial={serial}
                done={done}
                deleteAuth={canRun}
                calString={calString} /> 
            );
          }else{
            null;
          }
        })}
        
      </div>
    </div>
  );
};

export default ItemFeedX;