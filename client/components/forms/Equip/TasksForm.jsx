import React, { useState } from 'react';
import { toast } from 'react-toastify';

import ModelMedium from '/client/layouts/Models/ModelMedium';

const TasksFormWrapper = ({ id, serveKey, name, tasks, qtTime, lockOut })=> {
  
  const access = Roles.userIsInRole(Meteor.userId(), ['equipSuper','edit']);
 
  return(
    <ModelMedium
      button='Checklist'
      title={`Edit ${name} Checklist`}
      color='midnightblueT'
      icon='fa-list-check'
      lock={!access || lockOut}
    >
      <TasksForm 
        id={id}
        serveKey={serveKey}
        tasks={tasks || []}
        qtTime={qtTime}
      />
    </ModelMedium>
  );
};

export default TasksFormWrapper;

const TasksForm = ({ id, serveKey, tasks, qtTime, selfclose })=> {
  
	const [ taskArray, taskSet ] = useState( tasks );
	const [ qtNum, qtNumSet ] = useState( qtTime || 0 );
  
  const inputMinutes = (e) => {
    const val = e.target.value || 0;
    const inMin = parseFloat(val, 10);
    qtNumSet(inMin);
  };
  
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
    Meteor.call('setServiceTasks', id, serveKey, taskArray, qtNum, (error, reply)=>{
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
      <div className='w100 max300 breaklines split doJustWeen'>
        <span>
          <label>Expected Time</label>
          <div className='small'>In Minutes</div>
        </span>
        <span className='beside'>
          <label className='gapL'>
            <input
              type='text'
              id='eqQtMinput'
              className='rightText numberSet miniIn10'
              pattern="^\d*(\.\d{0,2})?$"
              maxLength='8'
              minLength='1'
              max='100000'
              min='0'
              step=".1"
              inputMode='numeric'
              defaultValue={qtTime || null}
              onChange={(e)=>inputMinutes(e)}
              required
            />
          </label>
          {/*<label className='gapL min8'>
            <i className='numberSet liteToolOff beside rightJust'
            >{moment.duration(qtArrState[op[0]] || 0, 'minutes').asSeconds().toFixed(0,10)}</i>
          </label>*/}
        </span>
      </div>
            
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