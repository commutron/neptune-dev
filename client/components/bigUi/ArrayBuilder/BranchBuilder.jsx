import React, { useState } from 'react';
import Pref from '/client/global/pref.js';
import { toast } from 'react-toastify';

import './style.css';

const BranchBuilder = ({ app, isDebug, lockout })=> {
  
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
    <div>Build</div>
    <div>Inspect</div>
    <div></div>
  </div>
);

const BranchEditRow = ({ branch, isDebug, lockout })=> {
  
  const br = branch;
  const id = br.brKey;
  
  const [ posState, posSet ] = useState(br.position);
  const [ comState, comSet ] = useState(br.common);
  const [ openState, openSet ] = useState(br.open);
  const [ clearState, clearSet ] = useState(br.reqClearance);
  const [ damState, damSet ] = useState(br.reqProblemDam);
  const [ uLockState, uLockSet ] = useState(br.reqUserLock);
  const [ consumeState, consumeSet ] = useState(br.reqConsumable);
  const [ buildState, buildSet ] = useState(br.buildMethods);
  const [ inspectState, inspectSet ] = useState(br.inspectMethods);
  
  // useEffect( ()=>{
  //   if(
  //     posState != br.position ||
  //     comState != br.common ||
  //     openState != br.open || 
  //     clearState != br.reqClearance ||
  //     damState != br.reqProblemDam ||
  //     uLockState != br.reqUserLock ||
  //     buildState != br.buildMethods ||
  //     inspectState != br.inspectMethods
  //   ) {
  //     this[id+'sv'].disabled = false;
  //   }
  // }, [
  //   posState, comState, openState, 
  //   clearState, damState, uLockState, 
  //   buildState, inspectState
  // ]);
  
  function handleMulti(val, goes) {
    const textVal = val;
    const arrVal = textVal.split(",");
    
    let cleanArr = [];
    for( let mth of arrVal ) {
      const cln = mth.trim();
      if(cln !== "") {
        cleanArr.push(cln);
      }
    }
    if(goes === 'build') {
      buildSet(cleanArr);
    }else{
      inspectSet(cleanArr);
    }
  }
  
  function handleCancel(e) {
    posSet(br.position);
    comSet(br.common);
    openSet(br.open);
    clearSet(br.reqClearance);
    damSet(br.reqProblemDam);
    uLockSet(br.reqUserLock);
    consumeSet(br.reqConsumable);
    buildSet(br.buildMethods);
    this[id+'tpBldMth'].value = br.buildMethods.join(", ");
    inspectSet(br.inspectMethods);
    this[id+'tpIspMth'].value = br.inspectMethods.join(", ");
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
                  buildState,
                  inspectState,
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
          className='tableAction narrow blueHover'
          pattern='[0-99]*'
          maxLength='2'
          minLength='1'
          max={99}
          min={0}
          inputMode='numeric'
          value={posState}
          onChange={(e)=>posSet(e.target.value)}
          disabled={lockout}
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
          className='tableAction blueHover'
          value={comState}
          onChange={(e)=>comSet(e.target.value)}
          disabled={lockout}
          required
        />
      </div>
      <div>
        <input
          type='checkbox'
          title='Open'
          id={id+'chkOpen'}
          className='tableAction blueHover'
          checked={openState}
          onChange={(e)=>openSet(e.target.checked)}
          disabled={lockout}
        />
      </div>
      <div>
        <input
          type='checkbox'
          title='Require Kit Clearance'
          id={id+'chkClear'}
          className='tableAction blueHover'
          checked={clearState}
          onChange={(e)=>clearSet(e.target.checked)}
          disabled={lockout}
        />
      </div>
      <div>
        <input
          type='checkbox'
          title='Require Problem Dam'
          id={id+'chkProbDam'}
          className='tableAction blueHover'
          checked={damState}
          onChange={(e)=>damSet(e.target.checked)}
          disabled={lockout}
        />
      </div>
      <div>
        <input
          type='checkbox'
          title='Require User Locking'
          id={id+'chkUsrLck'}
          className='tableAction blueHover'
          checked={uLockState}
          onChange={(e)=>uLockSet(e.target.checked)}
          disabled={lockout}
        />
      </div>
       <div>
        <input
          type='checkbox'
          title='Require Consumable Tracing'
          id={id+'chkConsume'}
          className='tableAction blueHover'
          checked={consumeState}
          onChange={(e)=>consumeSet(e.target.checked)}
          disabled={lockout}
        />
      </div>
      <div>
        <textarea
          title='Build Methods'
          id={id+'tpBldMth'}
          className='tableAction'
          defaultValue={br.buildMethods.join(", ")}
          onChange={(e)=>handleMulti(e.target.value, 'build')}
          disabled={lockout}
          required
        ></textarea>
      </div>
      <div>
        <textarea
          title='Inpection Methods'
          id={id+'tpIspMth'}
          className='tableAction'
          defaultValue={br.inspectMethods.join(", ")}
          onChange={(e)=>handleMulti(e.target.value, 'inspect')}
          disabled={lockout}
          required
        ></textarea>
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
          disabled={lockout}
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

