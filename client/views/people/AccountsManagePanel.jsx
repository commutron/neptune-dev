import React from 'react';
import Pref from '/client/global/pref.js';

import SlidesNested from '/client/components/smallUi/SlidesNested.jsx';

import UserManageForm from '/client/components/forms/UserManageForm.jsx';
import RemoveUser from '/client/components/forms/RemoveUser.jsx';

const AccountsManagePanel = ({ users })=> {
    
  const roles = Pref.roles;
  
  let usersMenu = users.map( (entry)=>{
    const clss = !Roles.userIsInRole(entry._id, 'active') ? 'strike fade' : '';
    return <b className={clss}>{entry.username}</b>;
  });
  
  return (
    <SlidesNested
      menuTitle='User Accounts'
      menu={usersMenu}
      topPage={
        <div key={000}>
          <h1>Accounts Manager</h1>
        </div>
      }>
        
      {users.map( (entry, index)=>{
        return (
          <div key={index+entry._id}>
            <UserManageForm
              id={entry._id}
              name={entry.username}
              org={entry.org}
              roles={roles}
            />
            {!Roles.userIsInRole(entry._id, 'active') &&
              entry._id !== Meteor.userId() &&
              !entry.org ?
                <RemoveUser userID={entry._id} />
            :null}
          </div>
      )})}
    </SlidesNested>
  );
};

export const PermissionHelp = ({ roles, admin })=> {
  let r = roles;
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
            <li>Create a new {Pref.group}, {Pref.widget} or {Pref.version}</li>
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
            <li>Create new {Pref.itemSerial}s</li>
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