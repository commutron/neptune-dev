import React, {Component} from 'react';
import { Meteor } from 'meteor/meteor';
//import Pref from '/client/global/pref.js';

import FindBox from './FindBox.jsx';
import TopBar from './TopBar.jsx';
import FormBar from '/client/components/bigUi/FormBar.jsx';
import ProgressCounter from '/client/components/utilities/ProgressCounter.js';

export const ProductionLayout = ({content, link}) => (
  <div className='containerPro'>
    <div className='proSearch'>
      <FindBox />
    </div>
    <div className='gridHeaderNav'>
      <TopBar link={link} />
    </div>
    {content}
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
    let topClass = !riverExpand ? 'proDefault' : 'proExpand';
    let toggleClass = !riverExpand ? 'riverExpandToggle' : 'riverShrinkToggle';
    
    return (
      <section className={topClass}>
        
        <div className='proLeft' style={scrollFix}>
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
          {React.cloneElement(this.props.children[this.props.children.length - 2],
            { 
              expand: this.state.expand,
              flow: path.flow,
              flowAlt: path.flowAlt,
              progCounts: path.progCounts
            }
          )}
        </div>
        
        <button
          type='button'
          className={toggleClass}
          onClick={()=>this.handleExpand()}>
          <i className='fas fa-chevron-right fa-2x'></i>
        </button>
          
        <div className='proRight' style={scrollFix}>
          {this.props.children[this.props.children.length - 1]}
        </div>

        <FormBar
          batchData={this.props.batchData}
          itemData={this.props.itemData}
          widgetData={this.props.widgetData}
          versionData={this.props.versionData}
          users={this.props.users}
          app={this.props.app} />
        
      </section>
    );
  }
  componentDidMount() {
    const open = Session.get('riverExpand');
    !open ? null : this.setState({ expand: true });
  }
}