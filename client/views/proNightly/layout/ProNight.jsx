import React, {Component} from 'react';
import { Meteor } from 'meteor/meteor';
//import Pref from '/client/global/pref.js';

import FindBox from '/client/layouts/FindBox.jsx';
import NavFloat from '/client/layouts/NavFloat.jsx';
import FormBar from '/client/components/bigUi/FormBar.jsx';
import ProgressCounter from '/client/components/utilities/ProgressCounter.js';


export const ProductionNightlyLayout = ({content, link}) => (
  <div className='proXcontainer'>
    <div className='proXstatus'></div>
    {content}
  </div>
);


export class ProNightlyWrap extends Component	{
  
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
  
  getFlows() {
    const b = this.props.batchData;
    const w = this.props.widgetData;
    let flow = [];
    let flowAlt = [];
    let progCounts = false;
    if( b && w ) {
      const river = w.flows.find( x => x.flowKey === b.river);
      const riverAlt = w.flows.find( x => x.flowKey === b.riverAlt );
      flow = river ? river.flow : [];
      flowAlt = riverAlt ? riverAlt.flow : [];
      progCounts = ProgressCounter(flow, flowAlt, b, this.state.expand);
    }
    return { flow, flowAlt, progCounts };
  }
  
  render() {
    
    let scrollFix = {
      overflowY: 'auto'
    };
    
    const path = this.getFlows();
    
    let riverExpand = this.state.expand;
    let topClass = !riverExpand ? 'proXcontent' : 'proXcontentExpand';
    let sidebarClass = !riverExpand ? 'hide' : 'proXdata';
    //let leftClass = !riverExpand ? 'proLeftNightMinor' : 'proNightLeftMajor';
    //let rightClass = !riverExpand ? 'proRightNightMajor' : 'proNightRightMinor';
    let toggleClass = !riverExpand ? 'riverExpandToggle' : 'riverShrinkToggle';
    
    const b = this.props.batchData;
    const i = this.props.itemData;
    const exploreLink = !i ?
                        '/data/batch?request=' + b.batch :
                        '/data/batch?request=' + b.batch + '&specify=' + i.serial;
    
    return (
      <div className={topClass}>
        <div className='proXtop'>
          <NavFloat />
          <div className='proNightSearch'><FindBox /></div>
          <div className='proNightJump'>
            <button
              id='exBatch'
              title='View this in explore'
              className='exLeap'
              onClick={()=>FlowRouter.go(exploreLink)}>
              <i className='fas fa-rocket fa-fw'></i>
            </button>
          </div>
        </div>
        <div className='proXflow'>
          {this.props.children.length > 2 ?
            React.cloneElement(this.props.children[0],
              { 
                expand: this.state.expand,
                flow: path.flow,
                flowAlt: path.flowAlt,
                progCounts: path.progCounts
              }
            )
          :null}
        </div>
        <div className={sidebarClass}>
          {React.cloneElement(this.props.children[this.props.children.length - 2],
            { 
              expand: this.state.expand,
              flow: path.flow,
              flowAlt: path.flowAlt,
              progCounts: path.progCounts
            }
          )}
        </div>
        
        <div className='proXdocs'>
          {this.props.children[this.props.children.length - 1]}
        </div>
        
        <button
          type='button'
          className={toggleClass}
          onClick={()=>this.handleExpand()}>
          <i className='fas fa-chevron-right fa-2x'></i>
        </button>
{/*
        <FormBar
          batchData={this.props.batchData}
          itemData={this.props.itemData}
          widgetData={this.props.widgetData}
          versionData={this.props.versionData}
          users={this.props.users}
          app={this.props.app} />
        */}
      </div>
    );
  }
  componentDidMount() {
    const open = Session.get('riverExpand');
    !open ? null : this.setState({ expand: true });
  }
}