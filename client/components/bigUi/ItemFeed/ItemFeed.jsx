import React from 'react';
import moment from 'moment';
import './style.css';
//import Pref from '/client/global/pref.js';

import UserNice from '/client/components/smallUi/UserNice.jsx';
import StepBack from '/client/components/river/StepBack.jsx';
import NonConBlock from './NonConBlock';
import ShortBlock from './ShortBlock';
import RmaBlock from './RmaBlock';

const ItemFeed = ({ 
  id, serial,
  createTime, createBy,
  history, noncons, shortfalls,
  rmas, allRMA,
  done,
  app 
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
        <div className='infoBlock create'>
          <div className='blockTitle cap'>
            <div>
              <div className='leftAnchor'><i className="fas fa-plus-circle fa-lg fa-fw greenT"></i></div>
              <div>serial number created</div>
            </div>
            <div className='rightText'>
              <div><UserNice id={createBy} /></div>
              <div>{moment(createTime).calendar(null, {sameElse: "ddd, MMM D /YY, h:mm A"})}</div>
              <div className='rightAnchor'></div>
            </div>
          </div>
        </div>
        
        {ordered.map( (dt, ix)=>{
          if(dt.step) {
            return( 
              <HistoryBlock
                key={dt.key+ix}
                entry={dt}
                id={id}
                serial={serial}
                done={done} /> 
            );
          }
          if(dt.ref) {
            return( 
              <NonConBlock
                key={dt.key+ix}
                entry={dt}
                id={id}
                serial={serial}
                done={done}
                app={app} /> 
            );
          }
          return( 
            <ShortBlock
              key={dt.key+ix}
              entry={dt}
              id={id}
              serial={serial}
              done={done} /> 
          );
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


const HistoryBlock = ({entry, id, serial, done})=>{
  
  let dt = entry;
  
  const redoAllow = Roles.userIsInRole(Meteor.userId(), 'edit') && !done && dt.good === true;
  const redoButton = <StepBack id={id} bar={serial} entry={entry} lock={!redoAllow} />;
                 
  const good = dt.good ?
                <i><i className="fas fa-check-circle fa-lg fa-fw greenT"></i></i> :
                <b><i className="fas fa-times-circle fa-lg fa-fw redT"></i></b>;
   
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
      <div className='blockTitle cap'>
        <div>
          <div className='leftAnchor'>{good}</div>
          <div>{dt.step}</div>
          <div>{dt.type}</div>
        </div>
        <div className='rightText'>
          <div><UserNice id={dt.who} /></div>
          <div>{moment(dt.time).calendar(null, {sameElse: "ddd, MMM D /YY, h:mm A"})}</div>
          <div className='rightAnchor'>{redoButton}</div>
        </div>
      </div>
      {dt.type === 'first' &&
        <ul className='moreInfoList'>
          <li>Inspected: {inspect}</li>
          <li>Built: {builder} with {method}</li>
          {change !== '' && <li>{change}</li>}
          {issue && <li>{issue}</li>}
        </ul>
      }
      {dt.comm !== '' && <p className='endComment'>{dt.comm}</p>}
    </div>
  );
};