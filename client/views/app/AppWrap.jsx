import React, {Component} from 'react';

import PrefPanel from './appPanels/PrefPanel.jsx';
import AccountsPanel from './appPanels/AccountsPanel.jsx';

import Tabs from '../../components/smallUi/Tabs.jsx';

export default class AppWrap extends Component	{

  render() {

    return (
      <div id='view'>
        <div className='cardView'>
          
          <Tabs
            tabs={['preferences', 'accounts', 'help']}
            stick={true}>
            
            <PrefPanel app={this.props.app} />
            <AccountsPanel users={this.props.users} />
            <div>help</div>
          </Tabs>
          
				</div>

      </div>
    );
  }
}