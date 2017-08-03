import React, {Component} from 'react';

import AccountPanel from './appPanels/AccountPanel.jsx';
import AccountsManagePanel from './appPanels/AccountsManagePanel.jsx';
import PrefPanel from './appPanels/PrefPanel.jsx';
import MetaPanel from './appPanels/MetaPanel.jsx';

import Tabs from '../../components/smallUi/Tabs.jsx';

export default class AppWrap extends Component	{

  render() {
    
    const admin = Roles.userIsInRole(Meteor.userId(), 'admin');
    
    if(admin) {
      return (
        <div id='view'>
          <div className='cardView'>
            
            <Tabs
              tabs={['profile', 'accounts', 'preferences', 'meta']}
              stick={true}>
              
              <AccountPanel />
              <AccountsManagePanel users={this.props.users} />
              <PrefPanel app={this.props.app} />
              <MetaPanel />
            </Tabs>
            
  				</div>
        </div>
      );
    }

    return (
      <div id='view'>
        <div className='cardView'>
          
          <Tabs
            tabs={['profile', 'meta']}
            stick={true}>
            
            <AccountPanel />
            <MetaPanel />
          </Tabs>
          
				</div>

      </div>
    );
  }
}