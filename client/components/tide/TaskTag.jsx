import React from 'react';
 
const TaskTag = ({ batch, tideKey, taskIs, taskGuess, auth }) => {
  
  function saveGuess(g) {
    if(auth) {
      Meteor.call('setTideTimeTask', batch, tideKey, g);
    }
  }
  
  if(taskIs) {
    return(
      <i>{taskIs}</i>
    );
  }
  
  if(taskGuess) {
    return(
      <em title='algorithm derived'>
        {taskGuess.map( (g, ix)=>(
          <button 
            key={g+ix}
            className='miniAction gapR saveTask'
            onClick={()=>saveGuess(g)}
            disabled={!auth}
          > <i className="fas fa-water fa-fw tealT guessTask">
          </i> {g}
          </button>
        ))}
      </em>
    );
  }
  
  return(
    <i className='clean small'>unknown</i>
  );
};

export default TaskTag;