import React, { Fragment } from 'react';
import Pref from '/client/global/pref.js';

import SlidesNested from '/client/components/smallUi/SlidesNested.jsx';

import RemoveUser from '/client/components/forms/RemoveUser.jsx';
import NumStatRing from '/client/components/charts/Dash/NumStatRing.jsx';
import NumLine from '/client/components/tinyUi/NumLine.jsx';
import TrendLine from '/client/components/charts/Trends/TrendLine.jsx';

import Tabs from '/client/components/bigUi/Tabs/Tabs.jsx';
import ActivityPanel from '/client/views/user/ActivityPanel.jsx';
import UserManageForm from '/client/components/forms/UserManageForm.jsx';
import UserDMForm from '/client/components/forms/UserDMForm.jsx';


import { ForceStopEngage } from '/client/views/app/appSlides/DataRepair.jsx';

const AccountsManagePanel = ({ app, users, bCache, brancheS, isDebug })=> {
  
  const auths = Pref.auths;
  const areas = Pref.areas;
  
  const usersSort = users.sort((user1, user2)=> {
          let u1 = user1.username.substr(0, 4).toLowerCase();
          let u2 = user2.username.substr(0, 4).toLowerCase();
          if (!Roles.userIsInRole(user1._id, 'active')) { return 1 }
          if (!Roles.userIsInRole(user2._id, 'active')) { return -1 }
          if (u1.username < u2.username) { return -1 }
          if (u1.username > u2.username) { return 1 }
          return 0;
        });
  
  let usersMenu = usersSort.map( (entry)=>{
    const clss = !Roles.userIsInRole(entry._id, 'active') ? 'strike fade' : '';
    return [ entry.username, clss ];
  });
  
  const isAdmin = Roles.userIsInRole(Meteor.userId(), 'admin');
  const isPeopleSuper = Roles.userIsInRole(Meteor.userId(), 'peopleSuper');
  const noAccess = <div className='centreText'>Permission Denied</div>;
  
  return (
    <SlidesNested
      menuTitle='User Accounts'
      menu={usersMenu}
      disableAll={!isAdmin && !isPeopleSuper}
      topPage={
        <AccountsTop users={usersSort} key={000} />
      }>
        
      {usersSort.map( (entry, index)=>{
        if(isAdmin || isPeopleSuper) {
          return(
            <div key={index+entry._id} className='invert'>
              <Tabs
                tabs={[
                  <b><i className='far fa-clock fa-fw'></i>   Time</b>,
                  <b><i className='far fa-envelope fa-fw'></i>  Message</b>,
                  <b><i className='fas fa-key fa-fw'></i>  Access</b>,
                ]}
                wide={false}
                hold={false}
                disable={[ (!isPeopleSuper && !isAdmin), !isAdmin, !isAdmin]}>
                
                <ActivityPanel
                  key={0}
                  app={app}
                  brancheS={brancheS}
                  user={entry}
                  isDebug={isDebug}
                  users={usersSort}
                  bCache={bCache} />
                
                <div key={1} className='vspace'>
                  <UserDMForm userID={entry._id} />
                </div>
                
                <div key={2}>
                {isAdmin ?
                  <Fragment>
                    <UserManageForm
                      userObj={entry}
                      id={entry._id}
                      name={entry.username}
                      org={entry.org}
                      auths={auths}
                      areas={areas}
                      brancheS={brancheS}
                    />
                    {!Roles.userIsInRole(entry._id, 'active') &&
                      entry._id !== Meteor.userId() &&
                      !entry.org ?
                        <RemoveUser userID={entry._id} />
                    :null}
                    
                    {isAdmin && isDebug ?
                      <ForceStopEngage 
                        userID={entry._id}
                        isAdmin={isAdmin}
                        isDebug={isDebug} />
                    :null}
                  </Fragment>
                : noAccess}
                </div>

              </Tabs>
            </div>
          );
        }else{
          return noAccess;
        }
      })}
    </SlidesNested>
  );
};

export const PermissionHelp = ({ auths, admin })=> {
  
  const r = auths;
  
  return(
    <div className='space5x5'>
    
      <h2>Available Permissions</h2>
      
      {admin ?
        <ul>
          <li><b>Admin</b></li>
          <ul>
            <li>Activate or de-activate users</li>
            <li>Set user permissions</li>
            <li>Change user passwords</li>
            <li>Set app preferences</li>
          </ul>
        </ul>
      : null}
      
      {r.includes('debug') ?
        <ul>
          <li><b>Debug</b></li>
          <li><em>Should ONLY be used for finding and fixing problems in the software</em></li>
          <li><em>RESPECT USER PRIVACY</em></li>
          <ul>
            <li>Records information on your activity</li>
            <li>Allows Admins to view private information about your account and activity</li>
            <li>Logs meta data to your browsers console</li>
          </ul>
        </ul>
      : null}
      
      {r.includes('nightly') ?
        <ul>
          <li><b>Nightly</b></li>
          <ul>
            <li>Veiw and Use features that are under development</li>
          </ul>
        </ul>
      : null}
      
      {r.includes('peopleSuper') ?
        <ul>
          <li><b>People Super</b></li>
          <li><em>Can ONLY be enabled on ONE user</em></li>
          <li><em>RESPECT USER PRIVACY</em></li>
          <ul>
            <li>View information about individuals production performance</li>
            <li>Turns off the anonymous filter</li>
          </ul>
        </ul>
      : null}
      
      {r.includes('qa') ?
        <ul>
          <li><b>QA</b></li>
          <ul>
            <li>Create and edit {Pref.rmaProcess}es</li>
            <li><i className='cap'>{Pref.scrap}</i> a {Pref.item}</li>
            <li>Add {Pref.escape}</li>
          </ul>
        </ul>
      : null}
      
      {r.includes('remove') ?
        <ul>
          <li><b>Remove</b></li>
          <ul>
            <li>Remove a {Pref.group}, {Pref.widget}, {Pref.version} *</li>
            <li>Remove a {Pref.batch}, {Pref.item}, or nonconformace *</li>
            <p className='small'>* subject to "in-use" checks</p> 
          </ul>
        </ul>
      : null}
        
      {r.includes('create') ?
        <ul>
          <li><b>Create</b></li>
          <ul>
            <li>Create a new {Pref.group}</li>
            <li>Create a new {Pref.widget} notes</li>
            <li>Create a new {Pref.version}</li>
            <li>Create a new {Pref.batch}</li>
            <li>Create a new batch+</li>
            <li>Create new {Pref.itemSerial}s</li>
          </ul>
        </ul>
      : null}
      
      {r.includes('edit') ?
        <ul>
          <li><b>Edit</b></li>
          <ul>
            <li>Edit {Pref.group} or {Pref.widget} names or descriptions</li>
            <li>Edit {Pref.widget} notes</li>
            <li>Add or edit a {Pref.widget} {Pref.version}</li>
            <li>Add or edit or remove* a {Pref.flow}</li>
            <li>Mark a process step as {Pref.ng}</li>
            <p className='small'>* subject to "in-use" checks</p> 
          </ul>
        </ul>
      : null}
        
      {r.includes('run') ?
        <ul>
          <li><b>Run</b></li>
          <ul>
            <li>Edit {Pref.batch} name or dates</li>
            <li>Add or Remove {Pref.tag}s</li>
            <li>Edit {Pref.batch} notes</li>
            <li>Change {Pref.unit}</li>
            <li>Set a {Pref.batch} {Pref.flow}</li>
            <li>Add {Pref.block}s</li>
            <li>Skip/ship nonconformaces</li>
            <li>Add {Pref.escape}</li>
            <li>Add, Edit or Remove {Pref.omit}s</li>
          </ul>
        </ul>
      : null}
      
      {r.includes('finish') ?
        <ul>
          <li><b>Finish</b></li>
          <ul>
            <li><i className='cap'>{Pref.trackLast}</i> a {Pref.item}</li>
          </ul>
        </ul>
      : null}
        
      {r.includes('test') ?
        <ul>
          <li><b>Test</b></li>
          <ul>
            <li>Record "Test" steps</li>
          </ul>
        </ul>
      : null}
      
      {r.includes('verify') ?
        <ul>
          <li><b>Verify</b></li>
          <ul>
            <li>Record "Verify" or "First-Off' inspections</li>
            <li>Remove {Pref.shortfall}s</li>
          </ul>
        </ul>
      : null}
      
      {r.includes('inspect') ?
        <ul>
          <li><b>Inspect</b></li>
          <ul>
            <li>Record "Inspect" steps</li>
            <li>Record "Inspected" nonconformaces</li>
            <li>Edit nonconformaces</li>
            <li>Edit {Pref.shortfall}s</li>
            <li>Resolve {Pref.shortfall}s</li>
            <li>Snooze and re-activate nonconformaces</li>
            <li>Active an {Pref.rmaProcess} on a {Pref.item}</li>
          </ul>
        </ul>
      : null}
      
      {r.includes('active') ?
        <ul>
          <li><b>Active</b></li>
          <ul>
            <li>View {Pref.group} and {Pref.batch} information</li>
            <li>Record "Build" steps</li>
            <li>Record nonconformaces</li>
            <li>Record {Pref.shortfall}s</li>
            <li>Record "Repaired" nonconformaces</li>
          </ul>
        </ul>
      : null}
      
    </div>
  );
};

export default AccountsManagePanel;

const AccountsTop = ({ users })=> {
  
  const all = users.length;
  const active = users.filter( x => Roles.userIsInRole(x._id, 'active') ).length;
  const nightly = users.filter( x => Roles.userIsInRole(x._id, 'nightly') ).length;
  const debug = users.filter( x => Roles.userIsInRole(x._id, 'debug') ).length;
  const readOnly = users.filter( x => Roles.userIsInRole(x._id, 'readOnly') ).length;
  
  const pSup = users.filter( x => Roles.userIsInRole(x._id, 'peopleSuper') );
  const pSupNames = Array.from(pSup, x => x.username );
  const pSupNamesNice = pSupNames.length > 0 ? pSupNames.join(" & ") : 'no one';
  const pMulti = pSupNames.length < 2;
  
  return(
    <div className='splitReverse'>
        
      <div className='bigger'>
        <NumLine
          num={pSupNamesNice}
          name={`${pMulti ? 'is the' : 'are'} People Super${pMulti ? '' : 's'}`}
          color='blueT'
          big={true} />
          
        <NumLine
          num={nightly}
          name='can access Nightly features'
          color='tealT'
          big={true} />
          
        <NumLine
          num={debug}
          name={`${debug === 1 ? 'has' : 'have'} Debug reporting`}
          color='redT'
          big={true} />
        
        <NumLine
          num={readOnly}
          name='are limited to Read Only'
          color='grayT'
          big={true} />
      </div>
      
      <div className='centre'>
      
        <NumStatRing
          total={active}
          nums={[ active, ( all - active ) ]}
          name='Active Users'
          title={`${active} active users,\n${( all - active )} inactive users`}
          colour='blueBi'
          maxSize='chart15Contain'
          noGap={all - active === 0}
        />
        
        <TrendLine 
          title='new users'
          statType='newUser'
          cycleCount={12}
          cycleBracket='month'
          lineColor='rgb(52, 152, 219)' />
      </div>
      
    </div>
  );
};