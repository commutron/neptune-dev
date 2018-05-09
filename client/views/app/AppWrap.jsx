import React from 'react';

import AccountsManagePanel from './appPanels/AccountsManagePanel.jsx';
import PrefPanel from './appPanels/PrefPanel.jsx';

import Tabs from '../../components/smallUi/Tabs.jsx';

const AppWrap = ({ users, app })=> {
  
  const admin = Roles.userIsInRole(Meteor.userId(), 'admin');
  
  if(admin) {
    return (
      <div id='view'>
        <div className='cardView'>
          
          <Tabs
            tabs={['user permissions', 'preferences']}
            stick={true}
            wide={true}>
            
            <AccountsManagePanel key={1} users={users} />
            <PrefPanel key={2} app={app} />
          </Tabs>
          
				</div>
      </div>
    );
  }

  return (
    <div id='view centreTrue'>
      <p className='medBig centreText'>This page is limited to administrators only</p>
    </div>
  );
};

export default AppWrap;