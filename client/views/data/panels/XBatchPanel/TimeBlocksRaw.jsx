import React, { useState, useEffect } from 'react';
import moment from 'moment';
// import 'moment-timezone';
import Pref from '/client/global/pref.js';
import { AnonyUser } from '/client/components/smallUi/UserNice';
import TaskTag from '/client/components/tide/TaskTag';
import { ForceRemoveTideBlock } from '/client/views/app/appSlides/DataRepair';

const TimeBlocksRaw = ({ batch, tide, lockOut, isDebug })=> {
  
  const isAdmin = Roles.userIsInRole(Meteor.userId(), 'admin');
  const isSuper = Roles.userIsInRole(Meteor.userId(), 'peopleSuper');
  
  const [ showZero, showZeroSet ] = useState(isDebug);
  
  return(
    <div>
      <details className='footnotes'>
        <summary>Analysis Details</summary>
        <p className='footnote'>Date-Time is recorded to the millisecond.</p>
        <p className='footnote'>
          Time and Durations are displayed as rounded to the nearest minute.
        </p>
        <p className='footnote'>
          <label className='beside'>show zero durations
          <input
            type='checkbox'
            className='minHeight'
            defaultChecked={showZero}
            onChange={()=>showZeroSet(!showZero)} 
          /></label>
        </p>
        <p className='footnote'>
          The {Pref.branch} attribution is derived from related records.
        </p>
        <p className='footnote'>
          An algorithm derived task may change due to future conditions. Click to save.
        </p>
        <p className='footnote'>
          *Tip - Use the browser `ctrl f` to find a date or person.
        </p>
      </details>
      
      <table className='numFont wide'>
        <tbody>
        {!tide ?
          <p className='centreText'>start/stop not enabled</p>
          :
          tide.map( (mov, index)=>{
            return(
              <RawBlock
                key={index} 
                tB={mov} 
                batch={batch} 
                isDebug={isDebug}
                isSuper={isSuper}
                showZero={showZero} />
          )})}
        </tbody>
      </table>
      
      {isAdmin && isDebug && !lockOut &&
        <ForceRemoveTideBlock 
          batch={batch}
          isAdmin={isAdmin}
          isDebug={isDebug} />
      }
    </div>
  );
};

export default TimeBlocksRaw;



const RawBlock = ({ tB, batch, isSuper, isDebug, showZero })=> {
  
  const [ brGuess, setGuess ] = useState(false);
  
  useEffect( ()=>{
    if(tB.task) {
      setGuess([ 'fromUserInput', [ tB.task ] ]);
    }else{
      Meteor.call('getOneBranchBestGuess', batch, tB,
      (err, asw)=>{
        err && console.log(err);
        if(asw) {
          setGuess(asw);
        }
      });
    }
  }, []);
  
  
  
  const mStart = moment(tB.startTime);
  const mStop = tB.stopTime ? moment(tB.stopTime) : moment();
  const durr = Math.round( moment.duration(mStop.diff(mStart)).asMinutes() );
  
  if(!showZero && durr === 0) {
    return null;
  }
            
  return(
    <tr title={isDebug ? tB.tKey : ''}>
      <td><AnonyUser id={tB.who} /></td>
      <td>{mStart.format('YYYY/MM/DD kk:mm')}</td>
      <td>{mStop.format('YYYY/MM/DD kk:mm')}</td>
      <td>{durr} minutes</td>
      <td>
        <TaskTag
          batch={batch}
          tideKey={tB.tKey}
          taskIs={tB.task}
          taskGuess={brGuess[1]} 
          auth={isSuper} />
      </td>
      {isDebug && <td>{brGuess ? brGuess[0] : '....'}</td>}
    </tr>
  );
};