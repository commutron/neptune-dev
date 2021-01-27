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
                showHeader={false}
                calString={calString} /> 
            );
          }else if(typeof dt.ref === 'string') {
            return( 
              <NonConBlock
                key={dt.key+ix}
                entry={dt}
                id={batchId}
                seriesId={seriesId}
                serial={serial}
                done={done}
                user={user}
                app={app}
                ncTypesCombo={ncTypesCombo}
                brancheS={brancheS}
                calString={calString} />
            );
          }else if(Array.isArray(dt.refs) === true) {
            return( 
              <ShortBlock
                key={dt.key+ix}
                entry={dt}
                id={batchId}
                seriesId={seriesId}
                serial={serial}
                done={done}
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