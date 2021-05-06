import React from 'react';
import './style.css';
//import Pref from '/client/global/pref.js';

import UserNice from '/client/components/smallUi/UserNice.jsx';
import StepBackX from '/client/components/bigUi/ItemFeedX/StepBackX';

const HistoryBlock = ({
  entry, batch, seriesId, serial, 
  done, iopen, canEdit, showHeader, cal
})=>{
  
  let dt = entry;
  
  const redoAllow = canEdit && iopen && dt.good === true;
               
  const indictor = dt.good ?
          dt.type === 'test' && dt.info !== false ?
          <n-fa1><i className="fas fa-exclamation-circle fa-lg fa-fw" title='Bypass'></i></n-fa1> :
          <n-fa2><i className="fas fa-check-circle fa-lg fa-fw" title='Good'></i></n-fa2> :
          <n-fa3><i className="fas fa-times-circle fa-lg fa-fw" title='No Good'></i></n-fa3>;
   
  const infoF = dt.type === 'first' && typeof dt.info === 'object';
  const infoT = dt.type === 'test' && typeof dt.info === 'string';
   
  let inspect = infoF ? dt.info.verifyMethod : '';
  let builder = infoF ? dt.info.builder.map( (e, i)=> { return( 
                          <i key={i}><UserNice id={e} />, </i> )})
                       : '';
  let method = infoF ? dt.info.buildMethod : '';
  let methodNice = Array.isArray(method) ? method.join(", ") : method;
  let change = infoF ? dt.info.change : '';
  let issue = infoF ? dt.info.issue : infoT ? dt.info : '';
  
  const colour = dt.type === 'finish' ? 'finish' : 'history';
   
  return(
    <n-feed-info-block class={colour}>
      <n-feed-left-anchor>{indictor}</n-feed-left-anchor>
      <n-feed-info-center>
        <n-feed-info-title>
          <span>{dt.step}</span>
          <span>{dt.type}</span>
          <span></span>
          <span><UserNice id={dt.who} /></span>
          <span>{cal(dt.time)}</span>
        </n-feed-info-title>
      
        {dt.type === 'test' && dt.info !== false ?
          <ul><li className='cap'>bypass: {dt.info}</li></ul>
        : 
          dt.type === 'first' ?
            <ul>
              <li>Inspected: {inspect}</li>
              <li>Built: {builder} with {methodNice}</li>
              {!change || change !== '' && <li>{change}</li>}
              {issue !== '' && <li>{issue}</li>}
            </ul>
        :
          dt.type === 'undo' && dt.info.formerWhen && dt.info.formerWho ?
            <ul>
              <li>Previously finished: {cal(dt.info.formerWhen)}</li>
              <li>Previously finished by: <UserNice id={dt.info.formerWho} /></li>
            </ul>
        : null}
        {dt.comm !== '' && <p className='endComment'>{dt.comm}</p>}
        
      </n-feed-info-center>
      <n-feed-right-anchor>
        {entry.good && 
          <StepBackX 
            seriesId={seriesId} 
            bar={serial} 
            entry={entry} 
            lock={!redoAllow} />
        }</n-feed-right-anchor>
    </n-feed-info-block>
  );
};

export default HistoryBlock;