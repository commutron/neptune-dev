import React, { useState } from 'react';
import Pref from '/client/global/pref.js';
import { toast } from 'react-toastify';

const AddFall = ({ rapidData, editAuth })=> {
  
  const csc = rapidData ? rapidData.cascade : [];
  
  const [ editState, editSet ] = useState(false);
  
  function handleSave() {
      
    let falls = [];
    this.doPre.checked ? falls.push('doPre') : null;
    this.doBuild.checked ? falls.push('doBuild') : null;
    this.doInspect.checked ? falls.push('doInspect') : null;
    this.doTest.checked ? falls.push('doTest') : null;
    this.doFinish.checked ? falls.push('doFinish') : null;
  
    Meteor.call('setExRapidFall', rapidData._id, falls, (error, reply)=> {
      if(error) {
        console.log(error);
        toast.error('Server Error');
      }
      if(reply) {
        null;
      }else{
        toast.warning('error');
      }
    });
    editSet(false);
  }
  
  const onP = csc.find( w => w.type === 'checkpoint' );
  const onB = csc.find( w => w.type === 'build' );
  const onI = csc.find( w => w.type === 'inspect' );
  const onT = csc.find( w => w.type === 'test' );
  const onF = csc.find( w => w.type === 'finish' );
  
  return(
    <div className='vmargin'>
      <dt className='fullline'>Counters</dt>
      
      <div className='fitWide'>
      
        <FallOption
          wID='doPre'
          label='Count Pre-Checks'
          dfON={onP ? true : false}
          has={onP && onP.counts.length > 0}
          editState={editState}
        />
        
        <FallOption
          wID='doBuild'
          label='Count Do'
          dfON={onB ? true : false}
          has={onB && onB.counts.length > 0}
          editState={editState}
        />
        
        <FallOption
          wID='doInspect'
          label='Count Inspections'
          dfON={onI ? true : false}
          has={onI && onI.counts.length > 0}
          editState={editState}
        />
      
        <FallOption
          wID='doTest'
          label='Count Testing'
          dfON={onT ? true : false}
          has={onT && onT.counts.length > 0}
          editState={editState}
        />
      
        <FallOption
          wID='doFinish'
          label='Count Finishing'
          dfON={onF ? true : false}
          has={onF && onF.counts.length > 0}
          editState={editState}
        />
          
      </div>
      
      {editState ?
        <span className='rightRow'>
          <button
            type='button'
            className='miniAction med gap'
            onClick={()=>editSet(false)}
          ><n-fa1><i className='far fa-edit'></i></n-fa1> cancel</button>
          
          <button
            className='smallAction gap clearBlue'
            onClick={()=>handleSave()}
            disabled={!rapidData.live}
          >Save</button>
        </span>
      :
        <span className='rightRow'>
          <button
            title={!editAuth ? Pref.norole : !rapidData.live ? 'not open' : ''}
            className='miniAction gap'
            onClick={()=>editSet(!editState)}
            disabled={!rapidData.live || !editAuth}
          ><n-fa2><i className='fas fa-edit'></i></n-fa2> edit</button>
        </span>
      }
    </div>
  );
};

export default AddFall;

const FallOption = ({ wID, label, dfON, has, editState })=> {
  if( editState || dfON ) {
    return(
      <label>
        <label htmlFor={wID} className='beside'>
        <input
          type='checkbox'
          id={wID}
          className='indenText inlineCheckbox interInput'
          defaultChecked={dfON}
          disabled={!editState || has}
        />{label}</label>
      </label>
    );
  }
  return null;
};