import React, { useState } from 'react';
import UserNice from '/client/components/smallUi/UserNice.jsx';

const NotesModule = ({ sourceId, noteObj, editMethod, cal })=> {

  const [ editState, editSet ] = useState(false);
  
  function handleChange(e) {
    e.preventDefault();
    const noteContent = this.noteVal.value.trim();
    
    Meteor.call(editMethod, sourceId, noteContent, (err)=>{
      err && console.log(err);
      
    });
    editSet(false);
  }
  
  const auth = Roles.userIsInRole(Meteor.userId(), ['edit', 'run']);
  
  return(
    <fieldset className='noteCard'>
      <legend className='cap'>notes</legend>
        {editState ?
          <form id='noteForm' onSubmit={(e)=>handleChange(e)}>
            <textarea 
              id='noteVal'
              className='w100'
              defaultValue={noteObj.content}></textarea>
            <span className='rightRow'>
              <button 
                className='miniAction gap med greenLineHover' 
                type='submit' 
                form='noteForm'
              >Save</button>
            </span>
          </form>
        :
          noteObj.content
        }
      <div className='footerBar middle'>
        <button 
          type='button'
          className='miniAction med gap'
          onClick={()=>editSet(!editState)}
          disabled={!auth}
        >{editState ? 
            <n-fa1><i className='far fa-edit'></i></n-fa1>
          : <n-fa2><i className='fas fa-edit'></i></n-fa2>}
        </button>
        <i>{cal(noteObj.time)} - <UserNice id={noteObj.who} /></i>
      </div>
    </fieldset>
  );
};

export default NotesModule;