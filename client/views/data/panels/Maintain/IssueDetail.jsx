import React, { Fragment, useState } from 'react';
import moment from 'moment';
import UserName from '/client/utility/Username.js';

import ModelNative, { OpenModelNative } from '/client/layouts/Models/ModelNative';

const IssueDetail = ({ dialogId, title, issData, handleOpen, handleChange, handleLog })=> {
  
  const log = issData.problog.sort((l1, l2)=>
                l1.time < l2.time ? -1 : l1.time > l2.time ? 1 : 0 );
  
  const [ edit, editSet ] = useState(false);
  
  return(
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
        <div className='max875 spacehalf'>
          <div className='leftText overscroll'>
            <p className='bottomLine'>
              <button
                title='Change Issue State'
                className={`action medBig wide leftText ${issData.open ? 'orangeSolid whiteT' : 'blackT'}`}
                onClick={()=>handleOpen(!issData.open)}
              >{issData.open ?
                  <em><i className="fa-solid fa-toggle-on gapR"></i>WIP</em> :
                  <strong><i className="fa-solid fa-toggle-off gapR"></i>Resolved</strong>}
              </button>
            </p>
            
            {edit ?
              <form 
                onSubmit={(e)=>{
                e.preventDefault();
                handleChange(this.istitle.value);
                editSet(false);
              }}>
                <input
                  type='text'
                  id='istitle'
                  className='interInput dbbleWide vmarginquarter smTxt'
                  defaultValue={issData.title}
                  required
                />
                <span className='leftRow'>
                  <button
                    type='button'
                    className='miniAction gap'
                    onClick={()=>editSet(false)}
                  ><i className='far fa-edit gapR'></i>cancel</button>
                
                  <button
                    type='submit'
                    className='miniAction gap greenLineHover'
                  ><i className='fas fa-check gapR'></i>save</button>
                </span>
              </form>
            :
              <div>
                <p>{issData.title}</p>
                {Meteor.userId() === issData.createdWho &&
                  <button
                    title='Edit Issue Title'
                    className='miniAction gap'
                    onClick={()=>editSet(!edit)}
                  ><i className='fas fa-edit gapR'></i>edit</button>
                }
              </div>
            }
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
              {log.map( (l, ix)=> (
                <tr key={ix}>
                  <td className='max500'>{l.text}</td>
                  <td>{moment(l.time).format('MMM D YYYY, h:mm A')}</td>
                  <td>{UserName(l.who)}</td>
                </tr>
              ))}
            </tbody>
          </table>
          
          <div>
            <form 
              onSubmit={(e)=>{
              e.preventDefault();
              handleLog(this[issData.issueKey+'lgtxt'].value.trim());
              this[issData.issueKey+'lgtxt'].value = '';
            }}>
            
              <label>Action/Troubleshooting<br />
                <textarea id={issData.issueKey+'lgtxt'} rows='1' className='w100' required></textarea>
              </label>
            
              <div className='rightText'>
                <button type='submit' className='action midnightSolid'>Save</button>
              </div>
          </form>
          
          </div>
        
        </div>
      </ModelNative>
    </Fragment>
  );
};

export default IssueDetail;