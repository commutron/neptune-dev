import React, {Component} from 'react';
import { Meteor } from 'meteor/meteor';
//import Pref from '/client/global/pref.js';

import TopBar from './TopBar.jsx';
import TaskBar from '/client/components/bigUi/TaskBar.jsx';
import ActionBar from '/client/components/bigUi/ActionBar.jsx';
import CookieBar from './CookieBar.jsx';

export const ExploreLayout = ({content, link}) => {
  let w = window.innerWidth;
  let h = window.innerHeight;
  w < 500 || h < 500 ? 
  alert('Uh O! Your window or display is too small, this page is not going to look good')
  : null;
  return(
    <div className='containerEx'>
      <div className='gridHeaderNav'>
        <TopBar link={link} />
      </div>
      <aside className='taskBarEx'>
        <TaskBar />
      </aside>
      <section className='contentAreaEx'>
        {content}
      </section>
    </div>
  );
};

export class TraverseWrap extends Component	{

  render() {
    
    let scrollFix = {
      overflowY: 'auto'
    };
    
    return (
      <div className='traverseContainer'>
        <div className='cookieNavEx'>
          <CookieBar
            batchData={this.props.batchData}
            itemData={this.props.itemData}
            widgetData={this.props.widgetData}
            versionData={this.props.versionData}
            groupData={this.props.groupData}
            action={this.props.action} />
        </div>
        
        <section className='traverseContent' style={scrollFix}>
          {this.props.children[0]}
        </section>
        
        <aside className='traverseList' style={scrollFix}>
          {this.props.children[1]}
        </aside>
        
        <div className='actionBarEx'>
          <ActionBar
            batchData={this.props.batchData}
            itemData={this.props.itemData}
            widgetData={this.props.widgetData}
            versionData={this.props.versionData}
            groupData={this.props.groupData}
            app={this.props.app}
            action={this.props.action} />
        </div>
              
        {/*React.cloneElement(this.props.children[0], this.props)*/}
      </div>
    );
  }
}