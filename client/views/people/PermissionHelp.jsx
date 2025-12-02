import React from 'react';
import Pref from '/public/pref.js';

const PermissionHelp = ({ auths })=> {
  return(
    <div className='space5x5 overscroll'>
    
      <h2>Available Permissions</h2>
      <small>descriptions last updated by Matthew, Nov. 30, 2025</small>
      
      <RoleList
        userroles={auths}
        role='active'
        tasks={[
          `View ${Pref.group} and ${Pref.xBatch} information`,
          'Record "Build" steps',
          'Record nonconformances',
          `Record ${Pref.shortfall}s`,
          'Record "Repaired" nonconformances',
          `Log ${Pref.equip} preventive maintenance`,
          `Log ${Pref.equip} issues`,
          `Add ${Pref.xBatch} notes`
        ]}
      />
      
      <RoleList
        userroles={auths}
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
        userroles={auths}
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
        userroles={auths}
        role='test'
        tasks={[
          'Record "Test" steps and counters',
        ]}
      />
      
      <RoleList
        userroles={auths}
        role='xray'
        tasks={[
          'Record "X-Ray" optional/sampling steps',
        ]}
      />
      
      <RoleList
        userroles={auths}
        role='BRKt3rm1n2t1ng8r2nch'
        title='Complete'
        tasks={[
          `Complete ${Pref.xBatch}`,
          `Undo Complete within ${Pref.completeGrace} hours`,
          `Complete ${Pref.item}`
        ]}
      />
      
      <RoleList
        userroles={auths}
        role='multitask_time'
        tasks={[
          `Can clock-in to two ${Pref.xBatchs} or tasks at once`
        ]}
      />
    
      <RoleList
        userroles={auths}
        role='run'
        tasks={[
          `Set ${Pref.group} as internal`,
          `Edit limited ${Pref.xBatch} values`,
          `Set ${Pref.xBatch} "live" status (before complete)`,
          `Unlock ${Pref.xBatchs}`,
          `Add or Remove ${Pref.series}`,
          `Create and edit ${Pref.rapidExs}`,
          
          `Add or Remove ${Pref.tag}s`,
          'Add, Edit, Solve and Remove notes',
          
          `Change ${Pref.unit}`,
          `Undo Complete beyond ${Pref.completeGrace} hours`,
          
          `Close ${Pref.rapidExs}`,
          `Active an ${Pref.rapidExd} on a ${Pref.item}`,
          
          `Set a ${Pref.xBatch} ${Pref.flow}`,
          'Repeat some events',
          'Add a Custom Event',
          
          'Set Upstream clearances',
          'Set Release to the Floor',
          
          `Complete an incomplete ${Pref.item}`,
          `Set ${Pref.item} to use an alternative process flow`,
          `Add nonconformances to multiple ${Pref.items} at once`
        ]}
      />
      
      <RoleList
        userroles={auths}
        role=''
        tasks={[
          `Edit ${Pref.equip}, ${Pref.groups}, ${Pref.widgets}, ${Pref.xBatchs}`,
          `Add or edit ${Pref.widget} ${Pref.variants}`,
          `Set ${Pref.comp + 's'}`,
          `Set ${Pref.xBatch} fulfill date`,
          'Add and Edit notes',
          'Repeat some events',
          'Add a Custom Event',
          `Backdate ${Pref.xBatch} completion (Complete permission as well)`,
          `Change one or all ${Pref.unit}s`,
          `Add or edit or remove a ${Pref.flow} (Cannot override "in-use")`,
          `Set ${Pref.timeBudget}s`
        ]}
      />
      
      <RoleList
        userroles={auths}
        role='create'
        tasks={[
          `Create new {Pref.equip}`,
          `Create a new {Pref.group}`,
          `Create a new ${Pref.widget}`,
          `Create a new ${Pref.variant}`,
          `Set ${Pref.comp + 's'}`,
          `Create a new ${Pref.xBatch}`,
          `Create new ${Pref.itemSerial}s`
        ]}
      />
      
      <RoleList
        userroles={auths}
        role='remove'
        tasks={[
          `Remove a {Pref.group}, {Pref.widget} or {Pref.variant}`,
          `Remove a {Pref.xBatch}, {Pref.item} or nonconformace`,
          'Break a serial number into multiple serial numbers'
        ]}
        notes='Cannot override "in-use" or other data protection'
      />
      
      <RoleList
        userroles={auths}
        role='qa'
        tasks={[
          `Create and edit ${Pref.rapidExs}`,
          `Complete an incomplete ${Pref.xBatch}`,
          `Complete an incomplete ${Pref.item}`,
          `${Pref.scrap} a ${Pref.item}`,
          `Close ${Pref.rapidExs}`,
          `Active an ${Pref.rapidExd} on a ${Pref.item}`,
          `Add nonconformances to multiple ${Pref.items} at once`,
          `Change all ${Pref.item} ${Pref.unit}s`
        ]}
      />
      
      <RoleList
        userroles={auths}
        role='Kiting'
        tasks={[
          'Create new serial numbers (Explore & Process)',
          'Set Upstream clearances',
          'Set Release to the Floor'
        ]}
      />
      
      <RoleList
        userroles={auths}
        role='sales'
        tasks={[
          `Set ${Pref.timeBudget}s`,
          `Set ${Pref.xBatch} fulfill date`,
          'Set Quote Time (in process flows)'
        ]}
      />
      
      <RoleList
        userroles={auths}
        role='npiSuper'
        tasks={[
          '',
        ]}
      />
      
      <RoleList
        userroles={auths}
        role='equipPlus'
        tasks={[
          `Create/Edit ${Pref.equip} contacts`,
          `Set ${Pref.equip} On/Off-Line state`,
          `Set ${Pref.equip} Connected state`,
          'Assign Equipment Stewards',
          `Receive an email if ${Pref.maintain}-service is missed`
        ]}
        notes='*Email is sent when the grace period begins and ends'
      />
      
      <RoleList
        userroles={auths}
        role='equipSuper'
        tasks={[
          `Create/Edit ${Pref.equip} entries`,
          `Set ${Pref.equip} On/Off-Line state`,
          `Set ${Pref.equip} Connected state`,
          `Set ${Pref.equip} Decommissioned state`,
          'Assign Equipment Stewards',
          `Set ${Pref.maintain}-service patterns`,
          `Set ${Pref.maintain}-service tasks`,
          `Receive an email if ${Pref.maintain}-service is missed`
        ]}
        notes='*Email is sent when the grace period begins and ends'
      />
      
      <RoleList
        userroles={auths}
        role='peopleSuper'
        tasks={[
          'View and Edit production time records',
          'Assign Equipment Stewards',
          'View sent email logs',
          'Send direct message to all users at once',
          'Veiw sent user direct messages (past 90 days)',
          'View the daily revolving PIN',
          'Set holidays'
        ]}
        notes={`Can ONLY be enabled on ${Pref.allowedSupers} user${Pref.allowedSupers === 1 ? '' : 's'}. RESPECT USER PRIVACY`}
      />
      
      <RoleList
        userroles={auths}
        role='nightly'
        tasks={[
          'View and Use features that are under development',
        ]}
      />
      
      <RoleList
        userroles={auths}
        role='readOnly'
        tasks={[
          'Read-Only',
        ]}
      />
      
      <RoleList
        userroles={auths}
        role='debug'
        tasks={[
          'Records information on your activity',
          'Allows Admins to view private information about your account and activity',
          'Logs meta data to your browsers console'
        ]}
        notes='Should ONLY be used for finding and fixing problems in the software. RESPECT USER PRIVACY'
      />
      
      <RoleList
        userroles={auths}
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

const RoleList = ({ userroles, role, title, tasks, notes })=> {
  if(userroles.includes(role)) {
    return(
      <ul>
        <li><b className={role.length < 3 ? 'up':'cap'}>{title || role}</b></li>
        <ul>
          {tasks.map( (tsk, indx)=> <li key={indx}>{tsk}</li> )}
        </ul>
        {notes && <dt><em>{notes}</em></dt>}
      </ul>
    );
  }
};

