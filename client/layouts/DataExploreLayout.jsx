import React, {Component} from 'react';
import { Meteor } from 'meteor/meteor';
import Pref from '/client/global/pref.js';

import TopBar from './TopBar.jsx';
import ActionBar from '/client/components/bigUi/ActionBar.jsx';
import CookieBar from '/client/components/bigUi/CookieBar.jsx';

export const ExploreLayout = ({content, link}) => {
  let w = window.innerWidth;
  let h = window.innerHeight;
  w < 1000 || h < 500 ? 
  alert('Uh O! Your window or display is too small, this page is not going to look good')
  : null;
  return(
    <div className='containerEx'>
      <div className='gridHeaderNav'>
        <TopBar link={link} />
      </div>
      <aside className='taskBarEx'>
        <button
          className='action clear'
          onClick={()=>FlowRouter.go('/data/overview?request=batches')}
        >{Pref.batch}</button>
      </aside>
      <section className='contentAreaEx'>
        {content}
      </section>
      <div className='basicFooter'></div>
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
        <div className='cookieNav'>
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