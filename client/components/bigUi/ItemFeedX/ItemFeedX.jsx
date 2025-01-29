import React from 'react';
import moment from 'moment';
import './style.css';

import CreateBlock from './CreateBlock';
import HistoryBlock from './HistoryBlock';
import NonConBlock from './NonConBlock';
import ShortBlock from './ShortBlock';
import AltBlock from './AltBlock';
import NestBlock from './NestBlock';
import RapidBlock from './RapidBlock';
import UserNice from '/client/components/smallUi/UserNice';

const ItemFeedX = ({ 
  widgetData, batchFlow, batch, seriesId, serial, units,
  createTime, createBy,
  history, altPath,
  noncons, ncTypesCombo, brancheS,
  shortfalls,
  done, rapId, rapidsData,
  user, canInspect, canQAFin, canQARmv, canEdit,
  app, cronofeed
})=> {
  
  const calString = "MMM DD YYYY, hh:mm A (ddd)";
  const calFunc = (d)=> moment(d).calendar(null, {sameElse: calString});
  
  if(cronofeed) {
    let timelog = [{
      loc: 'Kitting',
      proc: 'Serial Number',
      event: 'Create',
      time: createTime,
      who: createBy
    }];

    for(let h of history) {
      const step = batchFlow.find( x => x.key === h.key );
      const branch = step ? brancheS.find( x => x.brKey === step.branchKey ) : null;
      const niceBr =  branch ? branch.branch : '';
          
      timelog.push({
        loc: niceBr,
        proc: h.step,
        event: `${!h.good ? 'failed ' : ''}${h.type}`,
        time: h.time,
        who: h.who
      });
      
      if( h.info?.formerWhen && h.info?.formerWho ) {
        timelog.push({
          loc: niceBr,
          proc: h.step,
          event: `undone ${h.type}`,
          time: h.info.formerWhen,
          who: h.info.formerWho
        });
      }
    }
    
    for(let a of altPath) {
      if( a.river === 'string' ) {
        const rvr = widgetData.flows.find(w=>w.flowKey === dt.river);
        
        timelog.push({
          loc: '',
          proc: `Flow: ${rvr ? rvr.title : `ID: ${a.river}`}`,
          event: 'alt set',
          time: a.assignedAt,
          who: a.who
        });
      }
      
      if( a.rapId === 'string' ) {
        const rapDo = rapidsData.find( x => x._id === a.rapId );
        const rarapid = rapDo ? rapDo.rapid : '___';
        const raissue = rapDo ? rapDo.issueOrder : '___';
  
        timelog.push({
          loc: '',
          proc: `Flow: ${rarapid} (${raissue})`,
          event: 'Extend assigned',
          time: a.assignedAt,
          who: 'System'
        });
        if( a.completed ) {
          timelog.push({
            loc: '',
            proc: `Flow: ${rarapid} (${raissue})`,
            event: 'Extend complete',
            time: a.completedAt,
            who: a.completedWho
          });
        }
      }
    }
    
    for(let n of noncons) {
      timelog.push({
        loc: n.where,
        proc: `${n.ref} ${n.type}`,
        event: 'noncon mark',
        good: true,
        time: n.time,
        who: n.who
      });
      
      if(n.fix) {
        timelog.push({
          loc: n.where,
          proc: `${n.ref} ${n.type}`,
          event: 'noncon repair',
          good: true,
          time: n.fix.time,
          who: n.fix.who
        });
      }
      if(n.inspect) {
        timelog.push({
          loc: n.where,
          proc: `${n.ref} ${n.type}`,
          event: 'noncon inspect',
          good: true,
          time: n.inspect.time,
          who: n.inspect.who
        });
      }
      if(n.reject.length > 0) {
        for(let r of n.reject) {
          timelog.push({
            loc: n.where,
            proc: `${n.ref} ${n.type}`,
            event: 'noncon repair',
            good: true,
            time: r.attemptTime,
            who: r.attemptWho
          });
          timelog.push({
            loc: n.where,
            proc: `${n.ref} ${n.type}`,
            event: 'noncon reject',
            good: true,
            time: r.rejectTime,
            who: r.rejectWho
          });
        }
      }
      if(n.trash) {
        timelog.push({
          loc: n.where,
          proc: `${n.ref} ${n.type}`,
          event: 'noncon trash',
          good: true,
          time: n.trash.time,
          who: n.trash.who
        });
      }
    }
    
    for(let s of shortfalls) {
      if(s.uTime && s.uWho) {
        timelog.push({
          loc: s.where,
          proc: `${s.refs.join(', ')} ${s.partNum}`,
          event: 'short update',
          good: true,
          time: s.uTime,
          who: s.uWho
        });
      }
      timelog.push({
        loc: s.where,
        proc: `${s.refs.join(', ')} ${s.partNum}`,
        event: 'short mark',
        good: true,
        time: s.cTime,
        who: s.cWho
      });
      
      // inEffect: null, // Boolean or Null
      // reSolve: null, // Boolean or Null
    }

    const crono = timelog.sort((t1, t2)=> {
      const mt1 = moment(t1.time);
      const nt2 = t2.time;
      return( mt1.isAfter(nt2) ? 1 : mt1.isBefore(nt2) ? -1 : 0 )});
    
    return(
      <div className='scrollWrap'>
        <div className='infoFeed'>
          <table className='wide overviewTable cap numFont'>
            <thead className='cap'>
              <tr>
                <th>Time</th>
                <th>Event</th>
                <th>Process</th>
                <th>Location</th>
                <th>User</th>
              </tr>
            </thead>
            <tbody>
              {crono.map( (e, ix)=> (
                <tr key={ix}>
                  <td>{calFunc(e.time)}</td>
                  <td>{e.event}</td>
                  <td>{e.proc}</td>
                  <td>{e.loc}</td>
                  <td><UserNice id={e.who} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }
  
  let assembly = [];

  for(let h of history) {
    assembly.push(h);
  }
  for(let a of altPath) {
    assembly.push(a);
  }
  for(let n of noncons) {
    assembly.push(n);
  }
  for(let s of shortfalls) {
    assembly.push(s);
  }
  
  const ordered = assembly.sort((t1, t2)=> {
          const mt1 = moment( t1.time || t1.cTime || t1.assignedAt );
          const nt2 = t2.time || t2.cTime || t2.assignedAt;
          return( mt1.isAfter(nt2) ? 1 : mt1.isBefore(nt2) ? -1 : 0 )});
          
  const flatCheckList = Array.from(ncTypesCombo, x => 
                                  x.key ? x.live === true && x.typeText : x);
  
  const canVerify = Roles.userIsInRole(Meteor.userId(), 'verify');
  
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
                units={units}
                done={done}
                iopen={iopen}
                irap={rapDo !== false}
                user={user}
                canQA={canQARmv}
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
                units={units}
                done={done}
                iopen={iopen}
                canQA={canQARmv}
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
                cal={calFunc}
                canRmv={canQARmv}
                canFin={canQAFin}
              />
            );
          }else if(typeof dt.river === 'string') {
            const rvr = widgetData.flows.find(w=>w.flowKey === dt.river);
            return( 
              <AltBlock
                key={dt.river+ix}
                entry={dt}
                cal={calFunc}
                flowName={rvr ? rvr.title : `ID: ${dt.river}`}/>
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