import React, {Component} from 'react';
import { Meteor } from 'meteor/meteor';
import ScanListenerUtility from '/client/components/utilities/ScanListener.js';
//import Pref from '/client/global/pref.js';

import FindBox from './FindBox.jsx';
import TopBar from './TopBar.jsx';
import FormBar from '/client/components/bigUi/FormBar.jsx';

export const ProductionLayout = ({content, link}) => (
  <div className='containerPro'>
    <div className='proSearch'>
      <FindBox />
    </div>
    <div className='gridHeaderNav'>
      <TopBar link={link} />
    </div>
    <section className='contentAreaPro'>
      {content}
    </section>
  </div>
);

export class ProWrap extends Component	{
  
  constructor() {
    super();
    this.state = {
      expand: false,
    };
    this.handleExpand = this.handleExpand.bind(this);
  }
  
  handleExpand() {
    const openState = this.state.expand;
    this.setState({ expand: !openState });
    Session.set( 'riverExpand', !openState );
  }
  
  render() {
    
    let scrollFix = {
      overflowY: 'auto'
    };
    
    let riverExpand = this.state.expand;
    let topClass = riverExpand === true ? 'proExpand' : 'proDefault';
    let leftClass = riverExpand === true ? 'proLeftMajor' : 'proLeftMinor';
    let rightClass = riverExpand === true ? 'proRightMinor' : 'proRightMajor';
    let toggleClass = riverExpand === true ? 'riverShrinkToggle' : 'riverExpandToggle';
    
    return (
      <div className={topClass}>
        
        <div className={leftClass} style={scrollFix}>
          {this.props.children.length > 2 ?
            React.cloneElement(this.props.children[0],
              { expand: this.state.expand }
            )
          :null}
          {React.cloneElement(this.props.children[this.props.children.length - 2],
            { expand: this.state.expand }
          )}
        </div>
        
        <button
          type='button'
          className={toggleClass}
          onClick={()=>this.handleExpand()}>
          <i className='fas fa-chevron-right fa-2x'></i>
        </button>
          
        <div className={rightClass} style={scrollFix}>
          {this.props.children[this.props.children.length - 1]}
        </div>

        <FormBar
          batchData={this.props.batchData}
          itemData={this.props.itemData}
          widgetData={this.props.widgetData}
          versionData={this.props.versionData}
          users={this.props.users}
          app={this.props.app} />
        
      </div>
    );
  }
  componentDidMount() {
    const open = Session.get('riverExpand');
    !open ? null : this.setState({ expand: true });
  }
}