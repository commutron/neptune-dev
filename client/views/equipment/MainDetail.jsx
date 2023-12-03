import React, { Fragment } from 'react';
import moment from 'moment';
import UserName from '/client/utility/Username.js';

import ModelNative, { OpenModelNative } from '/client/layouts/Models/ModelNative';
import TabsLite from '/client/components/smallUi/Tabs/TabsLite';
import EquipTimeTable from './EquipTimeTable';

const MainDetail = ({ dialogId, title, mData })=> (
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
            <n-fa1><i className="fas fa-clock fa-fw"> Time</i> Time</n-fa1>
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
          
          <EquipTimeTable id={mData._id} timefetch='getMaintTime' />
        </TabsLite>
      
      </div>
    </ModelNative>
  </Fragment>
);

export default MainDetail;