import React from 'react';
import moment from 'moment';
import './style.css';
//import Pref from '/client/global/pref.js';

import UserNice from '/client/components/smallUi/UserNice.jsx';
import StepBack from '/client/components/river/StepBack.jsx';
import CreateBlock from './CreateBlock';
import NonConBlock from './NonConBlock';
import ShortBlock from './ShortBlock';
import RmaBlock from './RmaBlock';

const ItemFeed = ({ 
  id, batch, serial,
  createTime, createBy,
  history, 
  noncons, ncTypesCombo,
  shortfalls,
  rmas, allRMA,
  done,
  user, app 
})=> {
  
  const assembly = [...history, ...noncons, ...shortfalls];
  
  const ordered = assembly.sort((t1, t2)=> {
            if (moment(t1.time || t1.cTime).isAfter(t2.time || t2.cTime)) { return 1 }
            if (moment(t1.time || t1.cTime).isBefore(t2.time || t2.cTime)) { return -1 }
            return 0;
          });
  
  return(
    <div className='scrollWrap'>
      <div className='infoFeed'>
      
        <CreateBlock
          title='serial number created'
          user={createBy}
          datetime={createTime} />
        
        {ordered.map( (dt, ix)=>{
          if(typeof dt.step === 'string') {
            return( 
              <HistoryBlock
                key={dt.key+ix}
                entry={dt}
                id={id}
                batch={batch}
                serial={serial}
                done={done}
                showHeader={false} /> 
            );
          }else if(typeof dt.ref === 'string') {
            return( 
              <NonConBlock
                key={dt.key+ix}
                entry={dt}
                id={id}
                serial={serial}
                done={done}
                user={user}
                app={app}
                ncTypesCombo={ncTypesCombo} />
            );
          }else if(Array.isArray(dt.refs) === true) {
            return( 
              <ShortBlock
                key={dt.key+ix}
                entry={dt}
                id={id}
                serial={serial}
                done={done} /> 
            );
          }else{
            null;
          }
        })}
        
        {rmas.length > 0 &&
          <RmaBlock
            id={id}
            serial={serial}
            iRMA={rmas}
            allRMA={allRMA} />
        }
      </div>
    </div>
  );
};

export default ItemFeed;


export const HistoryBlock = ({entry, id, batch, serial, done, showHeader})=>{
  
  let dt = entry;
  
  const redoAllow = Roles.userIsInRole(Meteor.userId(), 'edit') && !done && dt.good === true;
  const redoButton = <StepBack id={id} bar={serial} entry={entry} lock={!redoAllow} />;
                 
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
          <li>Built: {builder} with {method}</li>
          {change !== '' && <li>{change}</li>}
          {issue && <li>{issue}</li>}
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