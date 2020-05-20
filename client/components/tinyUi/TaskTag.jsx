import React from 'react';
 
const TaskTag = ({ task, guess }) => {
  
  if(task && guess) {
    return(
      <i>{task}</i>
    );
  }
  
  if(task) {
    return(
      <em>
        <i className="fas fa-water fa-fw tealT" title='algorithm derived'>
        </i> {task.join(', ') }
      </em>
    );
  }
  
  return(
    <i className='clean small'>unknown</i>
  );
};

export default TaskTag;