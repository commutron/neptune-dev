import React, { Fragment } from 'react';
import moment from 'moment';
import UserName from '/client/utility/Username.js';

import ModelNative, { OpenModelNative } from '/client/layouts/Models/ModelNative';

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
      <div className='space max875'>
        <div className='leftText overscroll'>
          <p>Done: {mData.status === 'incomplete' ?
                    <strong>Incomplete</strong> :
                    mData.status === 'notrequired' ?
                    <strong>Not Required</strong> :
                    mData.doneAt && moment(mData.doneAt).format('dddd MMMM D h:mm A')}
          </p>
          <p>{'Notes:'} {mData.notes}</p>
        </div>
        
        <table className='w100 overscroll leftText'>
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
      
      </div>
    </ModelNative>
  </Fragment>
);

export default MainDetail;