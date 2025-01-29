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
  
  function handleCancel() {
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
      <BrCheck
        id={id+'chkOpen'}
        title='Open'
        chk={openState}
        chFunc={(e)=>openSet(e.target.checked)}
      />
      <BrCheck
        id={id+'chkClear'}
        title='Require Kit Clearance'
        chk={clearState}
        chFunc={(e)=>clearSet(e.target.checked)}
      />
      <BrCheck
        id={id+'chkProbDam'}
        title='Require Problem Dam'
        chk={damState}
        chFunc={(e)=>damSet(e.target.checked)}
      />
      <BrCheck
        id={id+'chkUsrLck'}
        title='Require User Locking'
        chk={uLockState}
        chFunc={(e)=>uLockSet(e.target.checked)}
      />
      <BrCheck
        id={id+'chkConsume'}
        title='Require Consumable Tracing'
        chk={consumeState}
        chFunc={(e)=>consumeSet(e.target.checked)}
      />
      
      <div>
        <DoButton 
          id={id+'rmv'}
          title='Delete (requires debug)'
          color='redHover'
          icon='fa-trash'
          clFunc={(e)=>handleDeleteBranch(e)}
          disabled={!isDebug}
        />
        <DoButton 
          id={id+'cncl'}
          title='Cancel/Reset'
          clFunc={(e)=>handleCancel(e)}
        />
        <DoButton 
          id={id+'sv'}
          title='Save'
          color='greenHover'
          icon='fa-check'
          clFunc={()=>handleSaveBranch()}
        />
      </div>
    </div>
  );
};

export const BranchListEditor = ({ app })=> {
  
  const branches = app.branches || [];
  const branchesSort = branches.sort((b1, b2)=>
          b1.position < b2.position ? 1 : b1.position > b2.position ? -1 : 0 );

  return(
    <div className='stepList'>
      <BranchListHead />
      {branchesSort.map( (br, index)=> {  
        return (                 
          <BranchListRow 
            key={index+br.brKey} 
            branch={br}
          />                      
      )})}
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

const BranchListRow = ({ branch })=> {
  
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
  
  function handleCancelLists() {
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
      <BrTxtAr
        id={id+'tpSbTsk'}
        title='Sub-Tasks'
        dfVal={(br.subTasks || []).join(", ")}
        chFunc={(e)=>handleMulti(e.target.value, 'task')}
      />
      <BrTxtAr
        id={id+'tpBldMth'}
        title='Build Methods'
        dfVal={br.buildMethods.join(", ")}
        chFunc={(e)=>handleMulti(e.target.value, 'build')}
      />
      <BrTxtAr
        id={id+'tpIspMth'}
        title='Inpection Methods'
        dfVal={br.inspectMethods.join(", ")}
        chFunc={(e)=>handleMulti(e.target.value, 'inspect')}
      />
      <div>
        <DoButton 
          id={id+'cncllst'} 
          title='Cancel/Reset'
          clFunc={(e)=>handleCancelLists(e)} 
        />
        <DoButton 
          id={id+'svlst'} 
          title='Save'
          color='greenHover'
          icon='fa-check'
          clFunc={()=>handleSaveLists()}
        />
      </div>
    </div>
  );
};

const DoButton = ({ id, title, icon, color, clFunc, disabled })=> (
  <button
    type='button'
    title={title}
    id={id}
    className={`smallAction ${color || 'blueHover'}`}
    onClick={clFunc}
    disabled={disabled}
  ><i className={`fa-solid ${icon || 'fa-ban'}`}></i></button>
);

const BrCheck = ({ id, title, chk, chFunc })=>(
  <div>
    <input
      type='checkbox'
      title={title}
      id={id}
      className='tableAction'
      checked={chk}
      onChange={chFunc}
    />
  </div>
);

const BrTxtAr = ({ id, title, dfVal, chFunc })=> (
  <div>
    <textarea
      title={title}
      id={id}
      className='tableTextarea'
      defaultValue={dfVal}
      onChange={chFunc}
      required
    ></textarea>
  </div>
);