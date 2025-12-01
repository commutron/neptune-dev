import React from 'react';
import Pref from '/public/pref.js';

const PermissionHelp = ({ auths, admin })=> {
  
  const r = auths;
  
  return(
    <div className='space5x5'>
    
      <h2>Available Permissions</h2>
      <small>Last updated by Matthew, Nov. 30, 2025</small>
      
      <RoleList
        userroles={r}
        role='active'
        tasks={[
          `View ${Pref.group} and ${Pref.xBatch} information`,
          'Record "Build" steps',
          'Record nonconformances',
          `Record ${Pref.shortfall}s`,
          'Record "Repaired" nonconformances',
          `Add ${Pref.xBatch} notes`
        ]}
      />
      
      <RoleList
        userroles={r}
        role='inspect'
        tasks={[
          'Record "Inspect" steps and counters',
          'Record "Inspected" nonconformances',
          'Edit nonconformances',
          `Edit ${Pref.shortfall}s`,
          `Active ${Pref.rapidEx} on an ${Pref.item}`
        ]}
      />
      
      <RoleList
        userroles={r}
        role='verify'
        tasks={[
          'Record "Verify" or "First-Off" inspections',
          `Set and Remove ${Pref.shortfall}s`,
          'Trash and re-activate nonconformances',
          'Set nonconformances as "Inspected, no repair required"',
          `Set ${Pref.item} to use an alternative process flow`,
        ]}
      />
  
      <RoleList
        userroles={r}
        role='test'
        tasks={[
          'Record "Test" steps and counters',
        ]}
      />
      
      <RoleList
        userroles={r}
        role='xray'
        tasks={[
          'Record "X-Ray" optional/sampling steps',
        ]}
      />
  
      
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
      
      
      multitask_time
  

     
      
    
      
        
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
            <li>Add, Edit, Solve and Remove notes</li>
            
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
      
      
      
      {r.includes('kitting') ?
        <ul>
          <li><b>Kiting</b></li>
          <ul>
            <li>Set Upstream clearances</li>
            <li>Set Release to the Floor 'Create new serial numbers'</li>
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
      
      npiSuper
      
      
      equipPlus
      
      
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
      
      
      
       {r.includes('peopleSuper') ?
        <ul>
          <li><b>People Super</b></li>
          <li><em>Can ONLY be enabled on {Pref.allowedSupers} user{Pref.allowedSupers === 1 ? '' : 's'}</em></li>
          <li><em>RESPECT USER PRIVACY</em></li>
          <ul>
            <li>View and Edit production time records</li>
            <li>View the daily revolving PIN</li>
            <li>Set holidays</li>
          </ul>
        </ul>
      : null}
      
      
      
      <RoleList
        userroles={r}
        role='nightly'
        tasks={[
          'View and Use features that are under development',
        ]}
      />
      
      <RoleList
        userroles={r}
        role='readOnly'
        tasks={[
          'Read-Only',
        ]}
      />
      
      <RoleList
        userroles={r}
        role='debug'
        tasks={[
          'Records information on your activity',
          'Allows Admins to view private information about your account and activity',
          'Logs meta data to your browsers console'
        ]}
        notes='Should ONLY be used for finding and fixing problems in the software. RESPECT USER PRIVACY'
      />
      
      <RoleList
        userroles={r}
        role='admin'
        tasks={[
          'Access additional user information',
          'Activate or de-activate users',
          'Set user permissions',
          'Change user passwords',
          'Set app preferences',
          'Set workday and ship schedules',
          'Access dangerous functions'
        ]}
      />
      
    </div>
  );
};

export default PermissionHelp;

const RoleList = ({ userroles, role, tasks, notes })=> {
  if(userroles.includes(role)) {
    return(
      <ul>
        <li><b className='cap'>{role}</b></li>
        <ul>
          {tasks.map( (tsk, indx)=> <li key={indx}>{tsk}</li> )}
        </ul>
        {notes && <dt><em>{notes}</em></dt>}
      </ul>
    );
  }
};

