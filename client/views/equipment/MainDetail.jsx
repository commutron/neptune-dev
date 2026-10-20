import React, { Fragment, useState } from 'react';
import moment from 'moment';
import 'moment-timezone';
import 'moment-business-time';
import UserName from '/client/utility/Username.js';

import ModelNative, { OpenModelNative } from '/client/layouts/Models/ModelNative';
import TabsLite from '/client/components/smallUi/Tabs/TabsLite';
import EquipTimeTable from './EquipTimeTable';

const MainDetail = ({ dialogId, title, mData, svqtTime, svData, adminAuth })=> (
  <Fragment>
    <OpenModelNative 
      dialogId={dialogId}
      title=''
      icon='fa-regular fa-rectangle-list'
      colorB='transparent wetSolid smTxt nospace nomargin'
      colorT='midnightblueT'
    />
    
    <ModelNative
      dialogId={dialogId}
      title={title}
      icon='fa-regular fa-rectangle-list'
      colorT='midnightblueT'
    >
      <div className='space max875 min600'>
        <div className='leftText overscroll'>
          <p>Done: {mData.status === 'incomplete' ?
                    <strong>Incomplete</strong> :
                    mData.status === 'notrequired' ?
                    <strong>Not Required</strong> :
                    mData.status === 'willnotrequire' ?
                    <em>Will Not Require</em> :
                    mData.doneAt && moment(mData.doneAt).format('dddd MMMM D h:mm A')}
          </p>
          <p>{'Notes:'} {mData.notes}</p>
        </div>
        
        
        <TabsLite 
          tabs={ [
            <n-fa0><i className="fas fa-list-check fa-lg fa-fw"></i> Checklist</n-fa0>,
            <n-fa1><i className="fas fa-clock fa-fw"></i> Time</n-fa1>,
            adminAuth && <n-fa2><i className="fas fa-pen-fancy fa-fw"></i> Edit</n-fa2>
          ] }
          left>
          
          <table className='min400 w100 overscroll leftText'>
            <thead>
              <tr className='leftText'>
                <th>Task</th>
                <th>Time</th>
                <th>Who</th>
              </tr>
            </thead>
            <tbody>
              {mData.checklist.map( (c, ix)=> (
                <tr key={ix}>
                  <td className='max500'>{c.task}</td>
                  <td>{moment(c.time).format('dddd MMMM D h:mm A')}</td>
                  <td>{UserName(c.who)}</td>
                </tr>
              ))}
            </tbody>
          </table>
          
          <EquipTimeTable 
            id={mData._id} 
            qtTime={svqtTime}
            timefetch='getMaintTime'
          />
          
          {adminAuth &&
            <ManualOverride 
              m={mData}
              sv={svData}
            />
          }
        </TabsLite>
      
      </div>
    </ModelNative>
  </Fragment>
);

export default MainDetail;

const ManualOverride = ({ m, sv })=> {
  
  const [ show, showSet ] = useState(false);
  const [ status, statusSet ] = useState('no change');
  
  const [ eStatus, eStatusSet ] = useState(m.status);
  const chngStat = (v)=> {
    statusSet('changes');
    const cleanv = v === 'false' ? false : v;
    eStatusSet(cleanv);
  };
  
  const [ eOpen, eOpenSet ] = useState(m.open);
  const [ eExp, eExpSet ] = useState(m.expire);
  
  const [ eClose, eCloseSet ] = useState(m.close);
  const setDay = (v)=> {
    statusSet('changes');
    console.log({v});
    const endDay = moment.tz(v, moment.tz.guess()).endOf('day').format();
    eCloseSet(endDay);
    
    const open = moment(endDay).subtractWorkingTime(sv.period - 1, 'days').startOf('day').format();
    eOpenSet(open);
    const expire = moment(endDay).addWorkingTime(sv.grace, 'days').endOf('day').format();
    eExpSet(expire);        
  };
  
  function saveMaintRecord(e) {
    e.preventDefault();

   console.log(eStatus, eOpen, eClose, eExp);
  Meteor.apply('maintainManualEdit', 
    [ m._id, eStatus, eOpen, eClose, eExp ],
    {wait: true},
    (error, reply)=>{
      error && console.log(error);
      if(reply) {
        statusSet('Saved');
      }else{
        statusSet('Server Error');
      }
    });
  } 
  
  let unsty = {
    border: '1px solid black',
    minHeight: 'unset',
    height: 'unset',
    width: 'unset',
    background: 'unset',
    fontSize: 'unset'
  };
  
  console.log({eClose});
  
  return(
    <div>
      {show ?
        <div>
          <p><strong>Be carfull of creating conflicts if setting dates in the present or future.</strong></p>
          <p><strong>Local time is set automatically.</strong></p>
          <p>ID: {m._id}</p>
          <p>Key: {m.serveKey}</p>
          <p>Name: {m.name}</p>
          <p>doneAt: {m.doneAt ? moment(m.doneAt).format() : 'false'}</p>
          
          <form onSubmit={(e)=>saveMaintRecord(e)}>
            <fieldset>
            
            <ManualDate
              label='close (deadline)' 
              unsty={unsty}
              dfVal={eClose}
              chng={(v)=>setDay(v)}
            />
            <p>Close is Workday: {moment(eClose).isWorkingDay() ? 'YES' : 'NO'}</p>
            
            <p>open: {moment(eOpen).format('YYYY-MM-DD')}</p>
            
            <p>expire: {moment(eExp).format('YYYY-MM-DD')}</p>
            
            <p><label>status:
            <select 
              className='gapL' 
              style={unsty}
              defaultValue={eStatus}
              onChange={(e)=>chngStat(e.target.value)}
              required>
              <option value={false}>false</option>
              <option>complete</option>
              <option>notrequired</option>
              <option>incomplete</option>
              <option>missed</option>
              <option>willnotrequire</option>
            </select>
            </label></p>
            
            <hr />
          
            <button 
              type='submit' 
              className='smallAction'
              style={unsty}>SAVE</button>
            <p><em>{status}</em></p>
          </fieldset>
        </form>
        </div>
        :
        <div className='centre centreText'>
          <p>Manual Override Record. Use With Caution.</p>
          <button 
            className='smallAction'
            style={unsty}
            onClick={()=>showSet(true)}>Edit</button>
        </div>
      }
    </div>
  );
};

const ManualDate = ({ label, unsty, dfVal, chng })=> (
  <p>
    <label>{label}:
    <input
      id='manualDueDate'
      style={unsty}
      className='gapL'
      type='date'
      defaultValue={moment(dfVal).format('YYYY-MM-DD')}
      onChange={(e)=>chng(e.target.value)}
      required
    />
    </label>
  </p>
);