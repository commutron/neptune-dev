import React, { useRef, useState, useEffect, useMemo, Fragment } from 'react';
import moment from 'moment';
import 'moment-business-time';
import { toast } from 'react-toastify';

import PagingSelect from '/client/components/tinyUi/PagingSelect';
import { chunkArray } from '/client/utility/Convert';
import UserName from '/client/utility/Username.js';
import IssueDetail from './IssueDetail';

const IssueHistory = ({ eqId, issData, isDebug, users })=>{
  
  const issSort = useMemo( ()=> issData.reverse(), [issData]);
  
  const [ debounce, debSet ] = useState(0);
  
  const [ pageState, pageSet ] = useState(0);
  const [ openState, openSet ] = useState(null);
  const [ textState, textSet ] = useState(false);
  
  const [ inpieces, inpiecesSet ] = useState([]);
  
  const timer = useRef(null);
    
  useEffect(() => {
    clearTimeout(timer.current);
    timer.current = setTimeout(() => {
     
      const issRel = openState ? issSort.filter( f => f.open ) :
                 openState === false ? issSort.filter( f => !f.open ) :
                 issSort;
                 
      const issRef = !textState  ? issRel : 
                     issRel.filter( f => 
                        f.title.toLowerCase().includes(textState.toLowerCase())
                        ||
                        f.problog.find( l => 
                          l.text.toLowerCase()
                            .includes(textState.toLowerCase()))
                      );
  
      inpiecesSet( chunkArray(issRef, 10) );
      debSet(750);
    },debounce);
      
  },[openState, textState]);

  isDebug && console.log(issData);
  
  function newIssue(e) {
    e.preventDefault();
    const title = this.newtitle.value.trim();
    const log = this.newlog.value.trim();
    
    Meteor.call('addEqIssue', eqId, title, log, (err, re)=>{
      err && console.log(err);
      if(re) {
        this.newtitle.value = '';
        this.newlog.value = '';
      }else{
        toast.warning('Not Allowed');
      }
    });
  }
  
  function changeOpen(iKey, open) {
    Meteor.call('editEqIssueState', eqId, iKey, open, (err, re)=>{
      err && console.log(err);
      if(re) {
        null;
      }else{
        toast.warning('Not Allowed');
      }
    });
  }
  
  function changeTitle(iKey, title) {
    Meteor.call('editEqIssueTitle', eqId, iKey, title, (err, re)=>{
      err && console.log(err);
      if(re) {
        null;
      }else{
        toast.warning('Not Allowed');
      }
    });
  }
  
  function logIssue(iKey, text) {
    Meteor.call('logEqIssue', eqId, iKey, text, (err, re)=>{
      err && console.log(err);
      if(re) {
        null;
      }else{
        toast.warning('Not Allowed');
      }
    });
  }
  
  return(
    <Fragment>
    
    <div className='w100 scrollWrap forceScrollStyle cap'>
      <IlterTools
        openSet={openSet}
        textSet={textSet}
        debSet={debSet}
      />
      <table className='w100'>
        <thead>
          <tr className='leftText'>
            <th>Created</th>
            <th>Issue</th>
            <th>Latest</th>
            <th>Status</th>
            <th>Creator</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {(inpieces[pageState] || []).map( (is)=> {
            const frmt = 'MMM D YYYY';
            const ltst = is.problog[is.problog.length-1].text;
            return(
              <tr key={is.issueKey}>
                <td>{moment(is.createdAt).format(frmt)} {
                  !moment(is.createdAt).isSame(is.updatedAt, 'day') &&
                    <em>(updated {moment(is.updatedAt).format(frmt)})</em>}
                </td>
                <td>{is.title}</td>
                <td>{ltst.slice(0, 256) + (ltst.length > 256 ? '...' : '')}</td>
                <td>{is.open ? 'WIP' : 'Resolved'}</td>
                <td>{UserName(is.createdWho)}</td>
                <td className='centreRow'>
                  {is.problog.length > 0 ? 
                    <IssueDetail
                      dialogId={is.issueKey+'issHistory'}
                      title={is.title.slice(0, 64) + (is.title.length > 64 ? '...' : '')}
                      eqId={eqId}
                      issData={is}
                      handleOpen={(v)=>changeOpen(is.issueKey, v)}
                      handleChange={(v)=>changeTitle(is.issueKey, v)}
                      handleLog={(v)=>logIssue(is.issueKey, v)}
                    />
                  : null}
                </td>
              </tr>
          )})}
        </tbody>
      </table>
      
      <PagingSelect 
        multiArray={inpieces}
        isSet={pageState}
        doChange={(e)=>pageSet(e)} 
      />
      
    </div>
    
    <div>
      <form id='neweqissue' onSubmit={(e)=>newIssue(e)}>
        <h4>Quick Add New Issue</h4>
        
        <p>
          <label>Issue<br />
            <input type='text' id='newtitle' required />
          </label>
          <span className='blk small max250 vmarginquarter'>Only the you will be able to edit the title.</span>
        </p>
        <p>
          <label>Action / Troubleshooting<br />
            <textarea id='newlog' rows='4' style={{maxWidth: '240px'}} required></textarea>
          </label>
          <span className='blk small max250'>Issue logs are permanent and non-editable</span>
        </p>
        <div className='centreText'>
          <button type='submit' className='action midnightSolid'>Save</button>
        </div>
      </form>
    </div>
    
    <BackdateIssue eqId={eqId} users={users} />
    
    </Fragment>
  );
};

export default IssueHistory;

const IlterTools = ({ openSet, textSet, debSet })=> (
  <div className='centreRow bmargin vspacehalf'>
    <div className='rowWrap'>
      <label className='beside gapR'
      ><input type='radio' name='isopen' className='minlineRadio' 
        onChange={()=>{debSet(0);openSet(null)}}
        defaultChecked={true} 
      />All</label>
      
      <label className='beside gapR'
      ><input type='radio' name='isopen' className='minlineRadio' 
        onChange={()=>{debSet(0);openSet(true)}}
      />WIP</label>
      
      <label className='beside gapR'
      ><input type='radio' name='isopen' className='minlineRadio' 
        onChange={()=>{debSet(0);openSet(false)}}
      />Resolved</label>
    </div>
          
    <span className='flexSpace' />
    
    <label className='beside gapL'
    ><input type='search' className='dbbleWide' 
      placeholder='Search Log'
      onChange={(e)=> textSet( e.target.value.length > 0 ? e.target.value : false)}
      autoFocus
      required
    /></label>
  </div>
);
        
const BackdateIssue = ({ eqId, users })=> {
  
  const tzoffset = (new Date()).getTimezoneOffset() * 60000;
  
  function newBackIssue(e) {
    e.preventDefault();
    const title = this.backtitle.value.trim();
    const log = this.backlog.value.trim();
    
    const date = this.backdate.value;
    const userID = this.backuser.value;
    const wip = this.backwip.checked;
    
    Meteor.call('backdateEqIssue', eqId, title, log, date, userID, wip, (err, re)=>{
      err && console.log(err);
      if(re) {
        this.backtitle.value = '';
        this.backlog.value = '';
        this.backuser.value = Meteor.userId();
        this.backwip.checked = true;
        
        let nxtiso = new Date(Date.now() - tzoffset).toISOString();
        this.backdate.value = nxtiso.substring(0, nxtiso.indexOf("T") + 6);
      }else{
        toast.warning('Not Allowed');
      }
    });
  }
  
  let iso = new Date(Date.now() - tzoffset).toISOString();
  let max = iso.substring(0, iso.indexOf("T") + 6);
  
  return(
    <div>
      <form id='backeqissue' onSubmit={(e)=>newBackIssue(e)}>
        <h4>Backdate New Issue</h4>
        <div className='balance gapsC'>
        <div>
          <p>
            <label>Issue<br />
              <input type='text' id='backtitle' required />
            </label>
            <span className='blk small max250 vmarginquarter'>Only the Point-Person will be able to edit the title.</span>
          </p>
          <p>
            <label>Action / Troubleshooting<br />
              <textarea id='backlog' rows='4' style={{maxWidth: '240px'}} required></textarea>
            </label>
            <span className='blk small max250'>Issue logs are permanent and non-editable</span>
          </p>
        </div>
        <div>
          <p>
            <label>Date<br />
              <input 
                type='datetime-local'
                id='backdate'
                defaultValue={max}
                max={max}
                required
              />
            </label>
          </p>
          <p>
            <label className='beside'>Work In Progress
            <input type='checkbox' id='backwip' className='gapL' defaultChecked={true} />
            </label>
          </p>
          <p>
            <label>Point-Person<br />
              <select id='backuser' defaultValue={Meteor.userId()} required>
                {users.map( (u)=>(
                  <option key={u._id} value={u._id}>{u.username}</option>
                ))}
              </select>
            </label>
          </p>
          
          <p className='centreText'>
            <button type='submit' className='action midnightSolid'>Save</button>
          </p>
        </div>
        </div>
      </form>
    </div>
  );
};