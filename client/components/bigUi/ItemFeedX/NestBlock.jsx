import React from 'react';
import './style.css';
//import Pref from '/client/global/pref.js';

import UserNice from '/client/components/smallUi/UserNice.jsx';
import { PullNested } from '/client/components/bigUi/ItemFeedX/StepBackX';
import SubItemLink from '/client/components/smallUi/SubItemLink';

const NestBlock = ({
  entry, batch, seriesId, serial, 
  done, iopen, canEdit, cal
})=>{
  
  let dt = entry;
  
  const redoAllow = canEdit && iopen && dt.good === true;
                 
  const indictor = dt.good ?
          <i><i className="fas fa-check-circle fa-lg fa-fw" title='Good'></i></i> :
          <b><i className="fas fa-times-circle fa-lg fa-fw" title='No Good'></i></b>;
   
  const infoSub = dt.type === 'nest' ? typeof dt.info === 'object' ? 
                    dt.info.subSerial : dt.comm : null;
  const infoPar = dt.type === 'nested' && typeof dt.info === 'object' ? dt.info.parentSerial : null;
  
  let subText = dt.good ? 'Contains nested item' : 'Previously contained nested item';
  let subItem = infoSub ? <i>{subText} <SubItemLink serial={infoSub} /></i> : '';
  let parText = dt.good ? 'Is nested within' : 'Previously nested within';
  let parItem = infoPar ? <i>{parText} <SubItemLink serial={infoPar} /></i> : '';
   
  return(
    <n-feed-info-block class='altflow'>
      <n-feed-left-anchor>{indictor}</n-feed-left-anchor>
      <n-feed-info-center>
        <n-feed-info-title>
          <span>{dt.step}</span>
          <span>{dt.type}</span>
          <span></span>
          <span><UserNice id={dt.who} /></span>
          <span>{cal(dt.time)}</span>
        </n-feed-info-title>
      
        {subItem}
        
        {parItem}
         
        {dt.type === 'undo' && dt.info.formerWhen && dt.info.formerWho ?
          <ul>
            <li>Previously nested: {cal(dt.info.formerWhen)}</li>
            <li>Previously nested by: <UserNice id={dt.info.formerWho} /></li>
          </ul>
        : null}
        {dt.comm !== '' && <p className='endComment'>{dt.comm}</p>}
        
      </n-feed-info-center>
      <n-feed-right-anchor>
        {infoSub && entry.good ? 
          <PullNested 
            seriesId={seriesId} 
            serial={serial}
            nestedSerial={infoSub}
            entry={entry} 
            lock={!redoAllow} />
        : null}
      </n-feed-right-anchor>
    </n-feed-info-block>
  );
};

export default NestBlock;