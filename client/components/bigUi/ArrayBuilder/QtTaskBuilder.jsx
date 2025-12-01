import React, { Fragment, useState } from 'react';
import { toast } from 'react-toastify';
import './style.css';

import { textToArray } from '/client/utility/Convert';
import { DoButton, BrTxtAr } from './BranchBuilder';

const QtTaskBuilder = ({ app, branchesS, isDebug })=> {
  
  const qtTasks = app.qtTasks || [];
  const qtTasksSort = qtTasks.sort((q1, q2)=>
          q1.position < q2.position ? 1 : q1.position > q2.position ? -1 : 0 );

  
  return(
    <div className='stepList'>
      <QtTaskHead />
      {qtTasksSort.map( (qt, index)=> {  
        return(                 
          <QtTaskRow 
            key={index+qt.qtKey} 
            qtTask={qt}
            branchesS={branchesS}
          />                      
      )})}
    </div>
  );
};

export default QtTaskBuilder;

const QtTaskHead = ()=> (                 
  <Fragment>
    <div className='bold'>                      
      <div>Position</div>
      <div>Name</div>
      <div>Branch</div>
      <div>Pro</div>
      <div>Static</div>
      <div>Sub-Tasks</div>
      <div></div>
    </div>
    <div className='bold small'>
      <div>Manual Sort</div>
      <div>Quality Time Category</div>
      <div>editing possible to add</div>
      <div></div>
      <div>Fixed Time</div>
      <div>Task time is tracked and and attributed to QT time</div>
      <div></div>
    </div>
  </Fragment>
);

const QtTaskRow = ({ qtTask, branchesS })=> {
  
  const qt = qtTask;
  const qtkey = qtTask.qtKey;
  
  const [ nmState, nmSet ] = useState(qt.qtTask);
  const [ brState, brSet ] = useState(qt.brKey);
  const [ posState, posSet ] = useState(qt.position);
  const [ fxdState, fxdSet ] = useState(qt.fixed || false);
  const [ subtaskState, subtaskSet ] = useState(qt.subTasks || []);
  
  function handleMulti(val) {
    subtaskSet(textToArray(val));
  }
  
  function handleCancelLists() {
    nmSet(br.qtTask);
    brSet(qt.brKey);
    posSet(qt.position);
    subtaskSet(qt.subTasks);
    this[qtkey+'tpSbTsk'].value = (qt.subTasks || []).join(", ");
  }
  
  function handleSaveLists() {
    Meteor.call('editQualityTimeTasks', qtkey, nmState, brState, posState, fxdState, subtaskState,
      (error, reply)=>{
        error && console.log(error);
        if(reply) {
          toast.success('good');
        }else{
          toast.error('no good');
        }
    });
  }
  
  return(                 
    <div>
      <div>
        <input
          type='number'
          title='Position'
          id={qtkey+'chPos'}
          className='tableAction narrow nHover'
          pattern='[0-99]*'
          maxLength='2'
          minLength='1'
          max={99}
          min={0}
          inputMode='numeric'
          value={posState}
          onChange={(e)=>posSet(e.target.value)}
          required
        />
      </div>
      <div>
        <input
          type='text'
          title='Name'
          id={qtkey+'chName'}
          className='tableAction minWfit nHover'
          value={nmState}
          onChange={(e)=>nmSet(e.target.value)}
          required
        />
      </div>
      <div>{branchesS.find( b => b.brKey === qt.brKey)?.branch || 'underfined'}</div>
      <div>{branchesS.find( b => b.brKey === qt.brKey)?.pro || false ? <i className='fa-solid fa-check'></i> : ''}</div>
      
      <div>
        <input
          type='checkbox'
          title='Static'
          id={qtkey+'chStatic'}
          className='tableAction'
          checked={fxdState}
          onChange={(e)=>fxdSet(e.target.checked)}
        />
      </div>

      <BrTxtAr
        id={qtkey+'tpSbTsk'}
        title='Sub-Tasks'
        dfVal={(qt.subTasks || []).join(", ")}
        chFunc={(e)=>handleMulti(e.target.value)}
      />
      
      <div>
        <DoButton 
          id={qtkey+'cncllst'} 
          title='Cancel/Reset'
          clFunc={(e)=>handleCancelLists(e)} 
        />
        <DoButton 
          id={qtkey+'svlst'} 
          title='Save'
          color='greenHover'
          icon='fa-check'
          clFunc={()=>handleSaveLists()}
        />
      </div>
    </div>
  );
};