import React, {Component} from 'react';
import moment from 'moment';
import { toast } from 'react-toastify';
import './style.css';
import Pref from '/client/global/pref.js';

import UserNice from '/client/components/smallUi/UserNice.jsx';
import StepBack from '/client/components/river/StepBack.jsx';

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
    <div>
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
              done={done} /> 
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

const NonConBlock = ({entry, done})=>{
  
  const dt = entry;
                   
    const fx = typeof dt.fix === 'object';
    const ins = typeof dt.inspect === 'object';
    const rjc = !dt.reject || dt.reject.length === 0 ? false : true;
    const skp = typeof dt.skip === 'object';
    
    const open = dt.inspect === false ?
                  <i><i className="fas fa-wrench fa-lg fa-fw redT"></i></i> :
                  <b><i className="fas fa-check-circle fa-lg fa-fw greenT"></i></b>;
    
    let fixed = !fx ? '' : <li>Repaired: <UserNice id={dt.fix.who} /> {moment(dt.fix.time).calendar(null, {sameElse: "ddd, MMM D /YY, h:mm A"})}</li>;
    let inspected = !ins ? '' : <li>Inspected: <UserNice id={dt.inspect.who} /> {moment(dt.inspect.time).calendar(null, {sameElse: "ddd, MMM D /YY, h:mm A"})}</li>;
    let skipped = !skp ? '' : <li>Skipped: <UserNice id={dt.skip.who} /> {moment(dt.skip.time).calendar(null, {sameElse: "ddd, MMM D /YY, h:mm A"})}</li>;
    let snoozed = !dt.snooze ? false : true;
    
    const editAllow = Roles.userIsInRole(Meteor.userId(), 'inspect') && !done;
    
  return(
    <div className='infoBlock noncon'>
      <div className='blockTitle cap'>
        <div>
          <div className='leftAnchor'>{open}</div>
          <div className='up'>{dt.ref}</div>
          <div className='cap'>{dt.type}</div>
          <div className='cap'>{dt.where}</div>
        </div>
        <div className='rightText'>
          <div><UserNice id={dt.who} /></div>
          <div>{moment(dt.time).calendar(null, {sameElse: "ddd, MMM D /YY, h:mm A"})}</div>
          <div className='rightAnchor'>
            <button
              className='miniAction'
              disabled={!editAllow}
              readOnly={true}>
              <i className='fas fa-edit fa-lg fa-fw'></i>
            </button>
          </div>
        </div>
      </div>
      <ul className='moreInfoList'>
        {fixed}
        {inspected}
        {snoozed && <li>Snoozed</li>}
        {skipped}
        {rjc ?
          dt.reject.map( (entry, index)=>{
            return(
              <ul key={index}>
                <li colSpan='2'>
                  Attempt: <UserNice id={entry.attemptWho} /> {moment(entry.attemptTime).calendar(null, {sameElse: "ddd, MMM D /YY, h:mm A"})}
                  <br />
                  Reject: <UserNice id={entry.rejectWho} /> {moment(entry.rejectTime).calendar(null, {sameElse: "ddd, MMM D /YY, h:mm A"})}
                </li>
              </ul>
            )})
        : null}
      </ul>
      {dt.comm !== '' && <p className='endComment'>{dt.comm}</p>}
    </div>
  );
};


const ShortBlock = ({entry, done})=>{
  
  const dt = entry;
    
    const inE = dt.inEffect;
    const reS = dt.reSolve;
    const actionState = inE === null ? Pref.shortagePending : // Don't have a thing, what to do?
                        inE === true ? Pref.doOmit : // Leave thing out, Continue and Ship

                        reS === null ? Pref.shortageWaiting : // Waiting to be Able to Resolve
                        reS === false ? Pref.notResolved : // Can be Resolved but is Not Yet
                        reS === true ? Pref.isResolved : // Problem is Resolved
                        'unknown';
    
    const open = inE === true || reS === true ?
                  <i><i className="fas fa-check-circle fa-lg fa-fw greenT"></i></i> :
                  <b><i className="fas fa-wrench fa-lg fa-fw redT"></i></b>;
                  
    const editAllow = Roles.userIsInRole(Meteor.userId(), 'verify') && !done;
    
  
  return(
    <div className='infoBlock short'>
      <div className='blockTitle cap'>
        <div>
          <div className='leftAnchor'>{open}</div>
          <div className='up'>{dt.partNum}</div>
          <div className='cap'>{dt.refs.toString().toUpperCase()}</div>
          <div className='cap'>{dt.where}</div>
        </div>
        <div className='rightText'>
          <div><UserNice id={dt.cWho} /></div>
          <div>{moment(dt.cTime).calendar(null, {sameElse: "ddd, MMM D /YY, h:mm A"})}</div>
          <div className='rightAnchor'>
            <button
              className='miniAction'
              disabled={!editAllow}
              readOnly={true}>
              <i className='fas fa-edit fa-lg fa-fw'></i>
            </button>
          </div>
        </div>
      </div>
      <ul className='moreInfoList'>
        <li>Last Updated: <UserNice id={dt.uWho} /> {moment(dt.uTime).calendar(null, {sameElse: "ddd, MMM D /YY, h:mm A"})}</li>
        <li>{actionState}</li>
      </ul>
      {dt.comm !== '' && <p className='endComment'>{dt.comm}</p>}
    </div>
  );
};



const RmaBlock = ({ id, serial, iRMA, allRMA })=>{
  
  function popRMA(id, serial, rmaId) {
    let check = 'Are you sure you want to remove the ' + Pref.rma + ' from this ' + Pref.item;
    const yes = window.confirm(check);
    if(yes) {
      Meteor.call('unsetRMA', id, serial, rmaId, (error, reply)=>{
        error && console.log(error);
        reply ? toast.success('Saved') : toast.error('Not Allowed');
      });
    }else{null}
  }
  
  function rmaDetail(allRMA, rmaKey) {
    const dt = allRMA.find( x => x.key === rmaKey );
    return {
      name: dt.rmaId,
      comment: dt.comm,
      steps: dt.flow,
    };
  }
  
  const editAllow = Roles.userIsInRole(Meteor.userId(), ['qa', 'remove']);
  
  return(
    <div>
      {iRMA.map( (entry)=>{
        const dts = rmaDetail(allRMA, entry);
        return(
          <div key={entry} className='infoBlock noncon'>
            <div className='blockTitle cap'>
              <div>
                <div className='leftAnchor'><i className="fas fa-exchange-alt fa-lg fa-fw orangeT"></i></div>
                <div>RMA {dts.name}</div>
                <div>Steps: {Array.from(dts.steps, x => x.step).toString()}</div>
              </div>
              <div className='rightText'>
                <div className='rightAnchor'>
                  <button
                    className='miniAction'
                    onClick={()=>popRMA(id, serial, entry)}
                    disabled={!editAllow}
                    ><i className='fas fa-times fa-lg fa-fw'></i></button>
                </div>
              </div>
              {dts.comment !== '' && <p className='endComment'>{dts.comment}</p>}
            </div>
          </div>
      )})}
    </div>
  );
};