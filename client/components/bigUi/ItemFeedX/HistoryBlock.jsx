import React from 'react';
import './style.css';
import Pref from '/client/global/pref.js';

import UserNice from '/client/components/smallUi/UserNice.jsx';
import StepBackX from '/client/components/bigUi/ItemFeedX/StepBackX';

const HistoryBlock = ({
  entry, seriesId, serial, 
  iopen, canEdit, cal
})=>{
  
  let dt = entry;
  
  const redoAllow = canEdit && iopen && dt.good;
               
  const indictor = dt.good && dt.type === 'scrap' ?
              <n-fa4><i className="fa-solid fa-trash-can fa-lg fa-fw" title='Scrap'></i></n-fa4> :
            dt.good && dt.type === 'test' && dt.info !== false ?
              <n-fa1><i className="fa-solid fa-exclamation-circle fa-lg fa-fw" title='Bypass'></i></n-fa1> :
            dt.good === true ?
              <n-fa0><i className="fa-solid fa-check-circle fa-lg fa-fw" title='Good'></i></n-fa0> :
            dt.good ?
              <n-fa2><i className="fa-regular fa-check-circle fa-lg fa-fw" title='Redone'></i></n-fa2> :
              <n-fa3><i className="fa-solid fa-times-circle fa-lg fa-fw" title='No Good'></i></n-fa3>;
   
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
  
  const colour = dt.type === 'finish' ? dt.good ? 'finish' : 'alterEvent' :
                 dt.type === 'scrap' ? dt.good ? 'scrap' : 'alterEvent' :
                 dt.type === 'undo' ? 'alterEvent' : 'history';
  
  return(
    <n-feed-info-block class={colour}>
      <n-feed-left-anchor>{indictor}</n-feed-left-anchor>
      <n-feed-info-center>
        <n-feed-info-title>
          <span>{dt.step}</span>
          <span>{dt.type}</span>
          <span><UserNice id={dt.who} /></span>
          <span>{cal(dt.time)}</span>
        </n-feed-info-title>
      
        {dt.type === 'test' && dt.info !== false ?
          <dl><dd className='cap'>bypass: {dt.info}</dd></dl>
        : 
          dt.type === 'first' ?
            <dl className='readlines'>
              <dd><n-c>{Pref.method}</n-c>: {inspect}</dd>
              <dd>Built By: {builder}</dd>
              <dd>Built With: {methodNice}</dd>
              {dt.info.buildConsume && <dd><n-c>{Pref.consume}</n-c>: {dt.info.buildConsume}</dd>}
              {!change || change !== '' && <dd><n-c>{Pref.proChange}</n-c>: {change}</dd>}
              {issue !== '' && <dd>{issue}</dd>}
            </dl>
        :
          dt.type === 'undo' && dt.info.formerWhen && dt.info.formerWho ?
            <dl className='readlines'>
              <dt>Previously finished:</dt>
              <dd>{cal(dt.info.formerWhen)}</dd>
              <dd>by: <UserNice id={dt.info.formerWho} /></dd>
            </dl>
        : null}
        {dt.comm !== '' && <p className='endComment'>{dt.comm}</p>}
        
      </n-feed-info-center>
      <n-feed-right-anchor>
        {entry.good && redoAllow ?
          <StepBackX 
            seriesId={seriesId} 
            bar={serial} 
            entry={entry} 
            lock={!redoAllow} 
          />
        : null}
      </n-feed-right-anchor>
    </n-feed-info-block>
  );
};

export default HistoryBlock;