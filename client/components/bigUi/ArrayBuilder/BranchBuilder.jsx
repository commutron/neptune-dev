import React, { useState } from 'react';
import { toast } from 'react-toastify';
import './style.css';

const BranchBuilder = ({ app, isDebug })=> {
  
  const branches = app.branches || [];
  const branchesSort = branches.sort((b1, b2)=>
          b1.position < b2.position ? 1 : b1.position > b2.position ? -1 : 0 );

  return(
    <div className=''>
      <div className='stepList'>
        <BranchHeadRow />
        {branchesSort.map( (br, index)=> {  
          return (                 
            <BranchEditRow 
              key={index+br.brKey} 
              branch={br}
              isDebug={isDebug} />                      
        )})}
      </div>
    </div>
  );
};

export default BranchBuilder;

const BranchHeadRow = ()=> (                 
  <div className='bold'>                      
    <div>Position</div>
    <div>Name</div>
    <div>Common</div>
    <div>Open</div>
    <div>Clear</div>
    <div>Dam</div>
    <div>User</div>
    <div>Consume</div>
    <div></div>
  </div>
);

const BranchEditRow = ({ branch, isDebug })=> {
  
  const br = branch;
  const id = br.brKey;
  
  const [ posState, posSet ] = useState(br.position);
  const [ comState, comSet ] = useState(br.common);
  const [ openState, openSet ] = useState(br.open);
  const [ clearState, clearSet ] = useState(br.reqClearance);
  const [ damState, damSet ] = useState(br.reqProblemDam);
  const [ uLockState, uLockSet ] = useState(br.reqUserLock);
  const [ consumeState, consumeSet ] = useState(br.reqConsumable);
  
  function handleCancel(e) {
    posSet(br.position);
    comSet(br.common);
    openSet(br.open);
    clearSet(br.reqClearance);
    damSet(br.reqProblemDam);
    uLockSet(br.reqUserLock);
    consumeSet(br.reqConsumable);
  }
  
  function handleSaveBranch() {
    Meteor.call('editBranchConfig', 
                  id,
                  posState,
                  comState,
                  openState,
                  clearState,
                  damState,
                  uLockState,
                  consumeState,
      (error, reply)=>{
        error && console.log(error);
        if(reply) {
          toast.success('good');
        }else{
          toast.error('no good');
        }
    });
  }
  
  function handleDeleteBranch() {
    Meteor.call('removeBranchOption', id, (error, reply)=>{
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
          id={id+'chPos'}
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
        {br.branch}
      </div>
      <div>
        <input
          type='text'
          title='Common'
          id={id+'chCom'}
          className='tableAction nHover'
          value={comState}
          onChange={(e)=>comSet(e.target.value)}
          required
        />
      </div>
      <div>
        <input
          type='checkbox'
          title='Open'
          id={id+'chkOpen'}
          className='tableAction'
          checked={openState}
          onChange={(e)=>openSet(e.target.checked)}
        />
      </div>
      <div>
        <input
          type='checkbox'
          title='Require Kit Clearance'
          id={id+'chkClear'}
          className='tableAction'
          checked={clearState}
          onChange={(e)=>clearSet(e.target.checked)}
        />
      </div>
      <div>
        <input
          type='checkbox'
          title='Require Problem Dam'
          id={id+'chkProbDam'}
          className='tableAction'
          checked={damState}
          onChange={(e)=>damSet(e.target.checked)}
        />
      </div>
      <div>
        <input
          type='checkbox'
          title='Require User Locking'
          id={id+'chkUsrLck'}
          className='tableAction'
          checked={uLockState}
          onChange={(e)=>uLockSet(e.target.checked)}
        />
      </div>
       <div>
        <input
          type='checkbox'
          title='Require Consumable Tracing'
          id={id+'chkConsume'}
          className='tableAction'
          checked={consumeState}
          onChange={(e)=>consumeSet(e.target.checked)}
        />
      </div>
      <div>
        <button
          type='button'
          title='Delete (requires debug)'
          id={id+'rmv'}
          className='smallAction redHover'
          onClick={(e)=>handleDeleteBranch(e)}
          disabled={!isDebug}
        ><i className='fas fa-trash'></i></button>
        <button
          type='button'
          title='Cancel/Reset'
          id={id+'cncl'}
          className='smallAction blueHover'
          onClick={(e)=>handleCancel(e)}
        ><i className='fas fa-ban'></i></button>
        <button
          type='button'
          title='Save'
          id={id+'sv'}
          className='smallAction greenHover'
          onClick={()=>handleSaveBranch()}
          disabled={false}
        ><i className='fas fa-check'></i></button>
      </div>
    </div>
  );
};

export const BranchListEditor = ({ app, isDebug })=> {
  
  const branches = app.branches || [];
  const branchesSort = branches.sort((b1, b2)=>
          b1.position < b2.position ? 1 : b1.position > b2.position ? -1 : 0 );

  return(
    <div className=''>
      <div className='stepList'>
        <BranchListHead />
        {branchesSort.map( (br, index)=> {  
          return (                 
            <BranchListRow 
              key={index+br.brKey} 
              branch={br}
              isDebug={isDebug} />                      
        )})}
      </div>
    </div>
  );
};

const BranchListHead = ()=> (                 
  <div className='bold'>                      
    <div>Position</div>
    <div>Name</div>
    <div>Sub-Tasks</div>
    <div>Build Methods</div>
    <div>Inspect Methods</div>
    <div></div>
  </div>
);

const BranchListRow = ({ branch, isDebug })=> {
  
  const br = branch;
  const id = br.brKey;
  
  const [ subtaskState, subtaskSet ] = useState(br.subTasks || []);
  const [ buildState, buildSet ] = useState(br.buildMethods);
  const [ inspectState, inspectSet ] = useState(br.inspectMethods);
  
  function handleMulti(val, goes) {
    const textVal = val;
    const arrVal = textVal.split(/,|;/);
    
    let cleanArr = [];
    for( let mth of arrVal ) {
      const cln = mth.trim();
      if(cln !== "") {
        cleanArr.push(cln);
      }
    }
    if(goes === 'task') {
      subtaskSet(cleanArr);
    }else if(goes === 'build') {
      buildSet(cleanArr);
    }else{
      inspectSet(cleanArr);
    }
  }
  
  function handleCancelLists(e) {
    subtaskSet(br.subTasks);
    this[id+'tpSbTsk'].value = (br.subTasks || []).join(", ");
    buildSet(br.buildMethods);
    this[id+'tpBldMth'].value = br.buildMethods.join(", ");
    inspectSet(br.inspectMethods);
    this[id+'tpIspMth'].value = br.inspectMethods.join(", ");
  }
  
  function handleSaveLists() {
    Meteor.call('editBranchLists', id, subtaskState, buildState, inspectState,
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
      <div>{br.position}</div>
      <div>{br.branch}</div>
      <div>
        <textarea
          title='Sub-Tasks'
          id={id+'tpSbTsk'}
          className='tableTextarea'
          defaultValue={(br.subTasks || []).join(", ")}
          onChange={(e)=>handleMulti(e.target.value, 'task')}
          required
        ></textarea>
      </div>
      <div>
        <textarea
          title='Build Methods'
          id={id+'tpBldMth'}
          className='tableTextarea'
          defaultValue={br.buildMethods.join(", ")}
          onChange={(e)=>handleMulti(e.target.value, 'build')}
          required
        ></textarea>
      </div>
      <div>
        <textarea
          title='Inpection Methods'
          id={id+'tpIspMth'}
          className='tableTextarea'
          defaultValue={br.inspectMethods.join(", ")}
          onChange={(e)=>handleMulti(e.target.value, 'inspect')}
          required
        ></textarea>
      </div>
      <div>
        <button
          type='button'
          title='Cancel/Reset'
          id={id+'cncllst'}
          className='smallAction blueHover'
          onClick={(e)=>handleCancelLists(e)}
        ><i className='fas fa-ban'></i></button>
        <button
          type='button'
          title='Save'
          id={id+'svlst'}
          className='smallAction greenHover'
          onClick={()=>handleSaveLists()}
          disabled={false}
        ><i className='fas fa-check'></i></button>
      </div>
    </div>
  );
};