import React from 'react';
import moment from 'moment';
import './style.css';
//import Pref from '/client/global/pref.js';

import UserNice from '/client/components/smallUi/UserNice.jsx';
import CreateBlock from './CreateBlock';

const ItemFeed = ({ 
  id, batch, serial,
  createTime, createBy,
  history, 
  noncons, ncTypesCombo, brancheS,
  shortfalls,
  rmas, allRMA,
  done,
  user, app 
})=> {
  
  
  return(
    <div className='scrollWrap'>
      <div className='infoFeed'>
      
        <p>NO FEED AVAILABLE</p>
      
        <CreateBlock
          title='serial number created'
          user={createBy}
          datetime={createTime} />
        
      </div>
    </div>
  );
};

export default ItemFeed;


export const HistoryBlock = ({entry, id, batch, serial, done, showHeader})=>{
  
  let dt = entry;
  
  const redoButton = null;
                 
  const indictor = dt.good ?
                <i><i className="fas fa-check-circle fa-lg fa-fw iG" title='Good'></i></i> :
                <b><i className="fas fa-times-circle fa-lg fa-fw iNG" title='No Good'></i></b>;
   
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
    <div className={`infoBlock ${colour}`}>
      {showHeader &&
        <div className='blockHeader'>
          <button
            className='textAction numFont med'
            onClick={()=>FlowRouter.go('/data/batch?request=' + batch + '&specify=' + serial)}
          >{serial}</button>
        </div>}
      <div className='blockTitle cap'>
        <div>
          <div className='leftAnchor'>{indictor}</div>
          <div>{dt.step}</div>
          <div>{dt.type}</div>
        </div>
        <div className='rightText'>
          <div><UserNice id={dt.who} /></div>
          <div>{moment(dt.time).calendar(null, {sameElse: "ddd, MMM D /YY, h:mm A"})}</div>
          <div className='rightAnchor'>{redoButton}</div>
        </div>
      </div>
      {dt.type === 'first' ?
        <ul className='moreInfoList'>
          <li>Inspected: {inspect}</li>
          <li>Built: {builder} with {methodNice}</li>
          {change !== '' && <li>{change}</li>}
          {issue !== '' && <li>{issue}</li>}
        </ul>
      :
        dt.type === 'undo' && dt.info.formerWhen && dt.info.formerWho ?
          <ul className='moreInfoList'>
            <li>Previously finished: {moment(dt.info.formerWhen).calendar(null, {sameElse: "ddd, MMM D /YY, h:mm A"})}</li>
            <li>Previously finished by: <UserNice id={dt.info.formerWho} /></li>
          </ul>
      : null}
      {dt.comm !== '' && <p className='endComment'>{dt.comm}</p>}
    </div>
  );
};