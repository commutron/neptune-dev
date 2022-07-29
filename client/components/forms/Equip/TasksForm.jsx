import React, { useState } from 'react';
import Pref from '/client/global/pref.js';
import { toast } from 'react-toastify';

import ModelMedium from '/client/components/smallUi/ModelMedium';

const TasksFormWrapper = ({ id, serveKey, name, tasks, lockOut })=> {
  
  const access = Roles.userIsInRole(Meteor.userId(), ['equipSuper','edit']);
 
  return(
    <ModelMedium
      button='Tasks'
      title={`Edit ${name} Tasks`}
      color='midnightblueT'
      icon='fa-list-check'
      lock={!access || lockOut}
    >
      <TasksForm 
        id={id}
        serveKey={serveKey}
        tasks={tasks || []}
      />
    </ModelMedium>
  );
};

export default TasksFormWrapper;

const TasksForm = ({ id, serveKey, tasks, selfclose })=> {
  
	const [ taskArray, taskSet ] = useState( tasks );
  
  const pushtask = (e)=> {
    e.preventDefault();
    let tsks = new Set(taskArray);
    tsks.add(this.newtask.value);
    taskSet([...tsks]);
    this.newtask.value = '';
    this.newtask.focus();
  };
  
  const pulltask = (tsk)=> {
    const tsks = new Set(taskArray);
    tsks.delete(tsk);
    taskSet([...tsks]);
  };
  
  const move = (indx, freeze, dir)=> {
    let newList = taskArray;
    let tsk = newList[indx];
    if(freeze) { null }else{
      newList.splice(indx, 1);
      newList.splice(dir, 0, tsk);
      taskSet( [...newList] );
    }
  };
  
  function saveTasks() {
    Meteor.call('setServiceTasks', id, serveKey, taskArray, (error, reply)=>{
      error && console.log(error);
      if(reply) {
        toast.success('Saved Tasks');
        selfclose();
        }else{
          toast.warning('Not Allowed');
        }
    });
  }
  
  return(
    <div className='centre'>
      <form onSubmit={(e)=>pushtask(e)}>
        <p>
          <label>Task</label><br />
          <input
            type='text'
            id='newtask'
            required
            autoComplete="false"
          />
        
          <button
            type='submit'
            id='addtask'
            className='smallAction nHover'
           >Add</button>
        </p>
      </form>
      
      <div className='stepList vmarginhalf max500'>
        {taskArray.map( (entry, index)=> {
          return( 
            <div key={index} className='comfort bottomLine'>
              <div className='indenText leftText'>{entry}</div>
              <div>
                <button
                  type='button'
                  name='Move Up'
                  id='up'
                  className='smallAction blackHover'
                  onClick={()=>move(index, index === 0, index - 1)}
                  disabled={index === 0}
                ><i className='fas fa-arrow-up'></i></button>
                <button
                  type='button'
                  name='Move Down'
                  id='dn'
                  className='smallAction blackHover'
                  onClick={()=>move(index, index === taskArray.length - 1, index + 1)}
                  disabled={index === taskArray.length - 1}
                ><i className='fas fa-arrow-down'></i></button>
                <button
                  type='button'
                  name='Remove'
                  id='ex'
                  className='smallAction redHover'
                  onClick={()=>pulltask(entry)}
                ><i className='fas fa-times'></i></button>
              </div>
            </div>
        )})}
      </div>
      
      <p>
        <button
          id='savetasks'
          className='action nSolid'
          onClick={()=>saveTasks()}
          disabled={!Array.isArray(taskArray)}
         >Save</button>
      </p>
    </div>
  );
};