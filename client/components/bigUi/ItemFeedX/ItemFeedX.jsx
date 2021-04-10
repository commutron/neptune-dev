import React from 'react';
import moment from 'moment';
import './style.css';
//import Pref from '/client/global/pref.js';

import CreateBlock from './CreateBlock';
import HistoryBlock from './HistoryBlock';
import NonConBlock from './NonConBlock';
import ShortBlock from './ShortBlock';
import AltBlock from './AltBlock';
import NestBlock from './NestBlock';
import RapidBlock from './RapidBlock';

const ItemFeedX = ({ 
  batchId, batch, seriesId, serial,
  createTime, createBy,
  history, altPath,
  noncons, ncTypesCombo, brancheS,
  shortfalls,
  done, rapId, rapidsData,
  user, app 
})=> {
  
  const assembly = [...history, ...altPath, ...noncons, ...shortfalls, ];
  
  const ordered = assembly.sort((t1, t2)=> {
          const mt1 = moment( t1.time || t1.cTime || t1.assignedAt );
          const nt2 = t2.time || t2.cTime || t2.assignedAt;
          return( mt1.isAfter(nt2) ? 1 : mt1.isBefore(nt2) ? -1 : 0 )});
  
  const calString = "ddd, MMM D /YY, h:mm A";
  const calFunc = (d)=> moment(d).calendar(null, {sameElse: calString});
  
  const flatCheckList = Array.from(ncTypesCombo, x => 
                                  x.key ? x.live === true && x.typeText : x);
  
  const canQA = Roles.userIsInRole(Meteor.userId(), ['remove', 'qa']);
  const canRun = Roles.userIsInRole(Meteor.userId(), ['qa', 'remove', 'run']);
  const canEdit = Roles.userIsInRole(Meteor.userId(), ['edit', 'run']);
  const canVerify = Roles.userIsInRole(Meteor.userId(), 'verify');
  const canInspect = Roles.userIsInRole(Meteor.userId(), 'inspect');
  
  const rapDo = !rapId ? false : rapidsData.find( x => x._id === rapId );
  const rapive = rapDo && rapDo.live;
  
  const iopen = (!done || rapive);
  
  return(
    <div className='scrollWrap'>
      <div className='infoFeed'>
      
        <CreateBlock
          title='serial number created'
          user={createBy}
          datetime={createTime}
          cal={calFunc} />
        
        {ordered.map( (dt, ix)=>{
          if(typeof dt.step === 'string') {
            if(dt.type === 'nest' || dt.type === 'nested') {
              return( 
                <NestBlock
                  key={dt.key+ix}
                  entry={dt}
                  batch={batch}
                  seriesId={seriesId}
                  serial={serial}
                  done={done}
                  iopen={iopen}
                  canEdit={canEdit}
                  cal={calFunc} /> 
              );
            }else{
              return( 
                <HistoryBlock
                  key={dt.key+ix}
                  entry={dt}
                  batch={batch}
                  seriesId={seriesId}
                  serial={serial}
                  done={done}
                  iopen={iopen}
                  canEdit={canEdit}
                  showHeader={false}
                  cal={calFunc} /> 
              );
            }
          }else if(typeof dt.ref === 'string') {
            return( 
              <NonConBlock
                key={dt.key+ix}
                entry={dt}
                seriesId={seriesId}
                serial={serial}
                done={done}
                iopen={iopen}
                user={user}
                canQA={canQA}
                canVerify={canVerify}
                canInspect={canInspect}
                app={app}
                ncTypesCombo={ncTypesCombo}
                flatCheckList={flatCheckList}
                brancheS={brancheS}
                cal={calFunc} />
            );
          }else if(Array.isArray(dt.refs) === true) {
            return( 
              <ShortBlock
                key={dt.key+ix}
                entry={dt}
                seriesId={seriesId}
                serial={serial}
                done={done}
                iopen={iopen}
                deleteAuth={canRun}
                cal={calFunc} /> 
            );
          }else if(typeof dt.rapId === 'string') {
            return( 
              <RapidBlock
                key={dt.rapId+ix}
                rapIs={dt}
                rapidsData={rapidsData}
                seriesId={seriesId}
                serial={serial}
                done={done}
                deleteAuth={canQA}
                cal={calFunc} /> 
            );
          }else if(typeof dt.river === 'string') {
            return( 
              <AltBlock
                key={dt.river+ix}
                entry={dt}
                cal={calFunc} />
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