import React, { useState } from 'react';
import UserNice from '/client/components/smallUi/UserNice.jsx';

const NotesModule = ({ sourceId, noteObj, editMethod, cal, pocket, lines })=> {

  if(pocket) {
    return(
      <details open={false} className='blueBorder spaceTxt vmarginhalf'>
        <summary>
          <i className='cap'>Notes:</i>
        </summary>
        <NotesContent
          sourceId={sourceId}
          noteObj={noteObj}
          editMethod={editMethod}
          lines={lines}
          cal={cal}
        />
      </details>
    );
  }
  
  return(
    <fieldset className='noteCard'>
      <legend className='cap'>Notes</legend>
      <NotesContent
        sourceId={sourceId}
        noteObj={noteObj}
        editMethod={editMethod}
        lines={lines}
        cal={cal}
      />
    </fieldset>
  );
};

export default NotesModule;

const NotesContent = ({ sourceId, noteObj, editMethod, lines, cal })=> {

  const [ editState, editSet ] = useState(false);
  
  function handleChange(e) {
    e.preventDefault();
    const noteContent = this.noteVal.value.trim();
    
    Meteor.call(editMethod, sourceId, noteContent, (err)=>{
      err && console.log(err);
      
    });
    editSet(false);
  }
  
  if(!sourceId || !editMethod) {
    return null;
  }
  
  const auth = Roles.userIsInRole(Meteor.userId(), ['edit', 'run']);
  
  return(
    <div>
      {editState ?
        <form id='noteForm' onSubmit={(e)=>handleChange(e)}>
          <textarea 
            rows={lines || 4}
            id='noteVal'
            className='vmarginquarter w100 thinScroll'
            defaultValue={noteObj?.content || ''}
          ></textarea>
          <span className='rightRow'>
            <button
              type='button'
              className='miniAction med gap'
              onClick={()=>editSet(false)}
            ><i className='far fa-edit'></i> cancel</button>
          
            <button
              title='save'
              type='submit'
              className='miniAction med gap greenLineHover'
              form='noteForm'
            ><i className='fas fa-check'></i> save</button>
          </span>
        </form>
      :
        <pre className='nomargin line15x'
        >{noteObj?.content || ''}</pre>
      }
      {!editState &&
        <div className='footerBar middle'>
          <button 
            title='edit'
            type='button'
            className='miniAction med gap'
            onClick={()=>editSet(!editState)}
            disabled={!auth}
          ><n-fa2><i className='fas fa-edit'></i></n-fa2></button>
          {noteObj && <i>{cal(noteObj.time)} - <UserNice id={noteObj.who} /></i>}
        </div>
      }
    </div>
  );
};