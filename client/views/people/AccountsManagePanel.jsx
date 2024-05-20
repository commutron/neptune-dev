import React, { Fragment } from 'react';
import Pref from '/client/global/pref.js';

import SlidesNested from '/client/layouts/TaskBars/SlidesNested';

import DeleteUser from '/client/components/forms/User/DeleteUser';

import Tabs from '/client/components/smallUi/Tabs/Tabs';
import AccountsTop from './AccountsTop';
import ActivityPanel from '/client/views/user/ActivityPanel';
import UserManageForm from '/client/components/forms/User/UserManageForm';

import { ForceStopEngage } from '/client/views/app/appSlides/DataRepair';

const AccountsManagePanel = ({ app, users, traceDT, brancheS, isDebug })=> {
  
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
    const clss = !Roles.userIsInRole(entry._id, 'active') ? 'strike darkgrayT' : '';
    const sbtl = Roles.userIsInRole(entry._id, 'admin') ? 'Org Admin' : 
                 Roles.userIsInRole(entry._id, 'peopleSuper') ? 'People Super' :
                 Roles.userIsInRole(entry._id, 'equipSuper') ? 'Equipment Super' :
                 Roles.userIsInRole(entry._id, 'readOnly') ? 'Read Only' : null;
    return [ entry.username, clss, sbtl ];
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
            <div key={index+entry._id}>
              <Tabs
                tabs={[
                  <b><i className='far fa-clock fa-fw'></i>   Time</b>,
                  <b><i className='fas fa-key fa-fw'></i>  Access</b>,
                ]}
                wide={false}
                hold={false}
                disable={[ (!isPeopleSuper && !isAdmin), !isAdmin, (!isPeopleSuper && !isAdmin)]}>
                
                <ActivityPanel
                  key={0}
                  app={app}
                  brancheS={brancheS}
                  user={entry}
                  isDebug={isDebug}
                  users={usersSort}
                  traceDT={traceDT} />
                
                <div key={1}>
                {isAdmin ?
                  <Fragment>
                    <UserManageForm
                      userObj={entry}
                      id={entry._id}
                      name={entry.username}
                      org={entry.org}
                      keys={Pref.keys}
                      auths={Pref.auths}
                      areas={Pref.areas}
                      brancheS={brancheS}
                    />
                    {!Roles.userIsInRole(entry._id, 'active') &&
                      entry._id !== Meteor.userId() && !entry.org ?
                        <DeleteUser userID={entry._id} />
                    :null}
                    
                    {isAdmin && isDebug && entry.engaged !== false ?
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
            <li>Access additional user information</li>
            <li>Activate or de-activate users</li>
            <li>Set user permissions</li>
            <li>Change user passwords</li>
            <li>Set app preferences</li>
            <li>Set workday and ship schedules</li>
            <li>Access dangerous functions</li>
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
            <li>View and Use features that are under development</li>
          </ul>
        </ul>
      : null}
      
      {r.includes('peopleSuper') ?
        <ul>
          <li><b>People Super</b></li>
          <li><em>Can ONLY be enabled on ONE user</em></li>
          <li><em>RESPECT USER PRIVACY</em></li>
          <ul>
            <li>View and Edit production time records</li>
            <li>View the daily revolving PIN</li>
            <li>Set holidays</li>
          </ul>
        </ul>
      : null}
      
      {r.includes('equipSuper') ?
        <ul>
          <li><b>Equipment Super</b></li>
          <ul>
            <li>Create/Edit {Pref.equip} entries</li>
            <li>Set {Pref.maintain}-service patterns</li>
            <li>Set {Pref.maintain}-service tasks</li>
            <li>Receive an email if {Pref.maintain}-service is missed</li>
            <p className='small'>*Email is sent when the grace period begins and ends</p> 
          </ul>
        </ul>
      : null}
      
      {r.includes('qa') ?
        <ul>
          <li><b>QA</b></li>
          <ul>
            <li>Create and edit {Pref.rapidExs}</li>
            <li>Complete an incomplete {Pref.xBatch}</li>
            <li>Complete an incomplete {Pref.item}</li>
            <li><i className='cap'>{Pref.scrap}</i> a {Pref.item}</li>
            <li>Close {Pref.rapidExs}</li>
            <li>Active an {Pref.rapidExd} on a {Pref.item}</li>
            <li>Add nonconformances to multiple {Pref.items} at once</li>
            <li>Change all {Pref.item} {Pref.unit}s</li>
          </ul>
        </ul>
      : null}
      
      {r.includes('remove') ?
        <ul>
          <li><b>Remove</b></li>
          <ul>
            <li>Remove a {Pref.group}, {Pref.widget} or {Pref.variant} *</li>
            <li>Remove a {Pref.xBatch}, {Pref.item} or nonconformace *</li>
            <li>Break a serial number into multiple serial numbers *</li>
            <p className='small'>* subject to "in-use" checks</p> 
          </ul>
        </ul>
      : null}
        
      {r.includes('create') ?
        <ul>
          <li><b>Create</b></li>
          <ul>
            <li>Create new {Pref.equip}</li>
            <li>Create a new {Pref.group}</li>
            <li>Create a new {Pref.widget}</li>
            <li>Create a new {Pref.variant}</li>
            <li>Set {Pref.comp + 's'}</li>
            <li>Create a new {Pref.xBatch}</li>
            <li>Create new {Pref.itemSerial}s</li>
          </ul>
        </ul>
      : null}
      
      {r.includes('edit') ?
        <ul>
          <li><b>Edit</b></li>
          <ul>
            <li>Edit {Pref.equip}</li>
            <li>Edit {Pref.groups}</li>
            <li>Edit {Pref.widgets}</li>
            <li>Add or edit {Pref.widget} {Pref.variants}</li>
            <li>Set {Pref.comp + 's'}</li>
            <li>Edit {Pref.xBatchs}</li>
            <li>Set {Pref.xBatch} fulfill date</li>
            <li>Add and Edit notes</li>
            <li>Repeat some events</li>
            <li>Add a Custom Event</li>
            
            <li>Backdate {Pref.xBatch} completion**</li>
            <li>Change one or all {Pref.unit}s</li>
          
            <li>Add or edit or remove* a {Pref.flow}</li>
            <li>Set {Pref.timeBudget}s</li>
            <p className='small'>* subject to "in-use" checks</p>
            <p className='small'>** requires Complete permission as well</p> 
          </ul>
        </ul>
      : null}
      
      {r.includes('sales') ?
        <ul>
          <li><b>Sales</b></li>
          <ul>
            <li>Set {Pref.timeBudget}s</li>
            <li>Set {Pref.xBatch} fulfill date</li>
          </ul>
        </ul>
      : null}
      
      {r.includes('kitting') ?
        <ul>
          <li><b>Kiting</b></li>
          <ul>
            <li>Set Upstream clearances</li>
            <li>Set Release to the Floor</li>
          </ul>
        </ul>
      : null}
        
      {r.includes('run') ?
        <ul>
          <li><b>Run</b></li>
          <ul>
            <li>Set {Pref.group} as internal</li>
            <li>Edit limited {Pref.xBatch} values</li>
            <li>Set {Pref.xBatch} "live" status (before complete)</li>
            <li>Unlock {Pref.xBatchs}</li>
            <li>Add or Remove {Pref.series}</li>
            <li>Create and edit {Pref.rapidExs}</li>
            
            <li>Add or Remove {Pref.tag}s</li>
            <li>Add and Edit notes</li>
            
            <li>Change {Pref.unit}</li>
            <li>Undo Complete beyond {Pref.completeGrace} hours</li>
            
            <li>Close {Pref.rapidExs}</li>
            <li>Active an {Pref.rapidExd} on a {Pref.item}</li>
            
            <li>Set a {Pref.xBatch} {Pref.flow}</li>
            <li>Repeat some events</li>
            <li>Add a Custom Event</li>
            
            <li>Set Upstream clearances</li>
            <li>Set Release to the Floor</li>
            
            <li>Complete an incomplete {Pref.item}</li>
            <li>Set {Pref.item} to use an alternative process flow</li>
            <li>Add nonconformances to multiple {Pref.items} at once</li>
            
          </ul>
        </ul>
      : null}
      
      {r.includes('BRKt3rm1n2t1ng8r2nch') ?
        <ul>
          <li><b>Complete</b></li>
          <ul>
            <li>Complete {Pref.xBatch}</li>
            <li>Undo Complete within {Pref.completeGrace} hours</li>
            <li>Complete {Pref.item}</li>
          </ul>
        </ul>
      : null}
        
      {r.includes('test') ?
        <ul>
          <li><b>Test</b></li>
          <ul>
            <li>Record "Test" steps and counters</li>
          </ul>
        </ul>
      : null}
      
      {r.includes('verify') ?
        <ul>
          <li><b>Verify</b></li>
          <ul>
            <li>Record "Verify" or "First-Off' inspections</li>
            <li>Set and Remove {Pref.shortfall}s</li>
            <li>Trash and re-activate nonconformances</li>
            <li>Set nonconformances as "Inspected, no repair required"</li>
            <li>Set {Pref.item} to use an alternative process flow</li>
          </ul>
        </ul>
      : null}
      
      {r.includes('inspect') ?
        <ul>
          <li><b>Inspect</b></li>
          <ul>
            <li>Record "Inspect" steps and counters</li>
            <li>Record "Inspected" nonconformances</li>
            <li>Edit nonconformances</li>
            <li>Edit {Pref.shortfall}s</li>
            <li>Active {Pref.rapidEx} on an {Pref.item}</li>
          </ul>
        </ul>
      : null}
      
      {r.includes('active') ?
        <ul>
          <li><b>Active</b></li>
          <ul>
            <li>View {Pref.group} and {Pref.xBatch} information</li>
            <li>Record "Build" steps</li>
            <li>Record nonconformances</li>
            <li>Record {Pref.shortfall}s</li>
            <li>Record "Repaired" nonconformances</li>
          </ul>
        </ul>
      : null}
      
    </div>
  );
};

export default AccountsManagePanel;

