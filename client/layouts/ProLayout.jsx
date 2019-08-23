import React, {Component} from 'react';
import { Meteor } from 'meteor/meteor';
import ErrorCatch from '/client/components/utilities/ErrorCatch.jsx';
import { ToastContainer } from 'react-toastify';
//import Pref from '/client/global/pref.js';

import HomeIcon from '/client/components/uUi/HomeIcon.jsx';
import TideControl from '/client/components/tide/TideControl/TideControl.jsx';
import TideFollow from '/client/components/tide/TideFollow.jsx';
import FindBox from './FindBox.jsx';
import FormBar from '/client/components/bigUi/FormBar.jsx';
import ProgressCounter from '/client/components/utilities/ProgressCounter.js';

export class ProWrap extends Component	{
  
  constructor() {
    super();
    this.state = {
      expand: false,
      showVerify: false,
      optionVerify: false
    };
    this.handleVerify = this.handleVerify.bind(this);
    this.handleExpand = this.handleExpand.bind(this);
  }
  
  componentDidMount() {
    const open = Session.get('riverExpand');
    !open ? null : this.setState({ expand: true });
  }
  
  handleVerify(value) {
    this.setState({
      showVerify: !this.state.showVerify, 
      optionVerify: value 
    });
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
    let ncListKeys = [];
    let progCounts = false;
    if( b && w ) {
      const river = w.flows.find( x => x.flowKey === b.river);
      const riverAlt = w.flows.find( x => x.flowKey === b.riverAlt );
      if(river) {
        flow = river.flow;
        river.type === 'plus' && ncListKeys.push(river.ncLists);
      }
      if(riverAlt) {
        flowAlt = riverAlt.flow;
        riverAlt.type === 'plus' && ncListKeys.push(riverAlt.ncLists);
      }
      if(this.props.action !== 'xBatchBuild') {
        progCounts = ProgressCounter(flow, flowAlt, b);
      }
    }
    return { flow, flowAlt, ncListKeys, progCounts };
  }
  
  render() {
    
    let scrollFix = {
      overflowY: 'auto'
    };
    
    const u = this.props.user;
    const gAlias = this.props.groupAlias;
    const bData = this.props.batchData;
    const iS = this.props.itemSerial;
    const append = bData && iS ? bData.batch : null;
    
    const et = !u || !u.engaged ? false : u.engaged.tKey;
    const tide = !bData || !bData.tide ? [] : bData.tide;
    const currentLive = tide.find( 
      x => x.tKey === et && x.who === Meteor.userId() 
    );
    
    const exploreLink = iS && bData ?
                        '/data/batch?request=' + bData.batch + '&specify=' + iS :
                        bData ?
                        '/data/batch?request=' + bData.batch :
                        gAlias ?
                        '/data/group?request=' + gAlias :
                        '/data/overview?request=batches';
                        
                        
    const path = !bData ? { flow: [], flowAlt: [], ncListKeys: [], progCounts: false } 
                        : this.getFlows();

    const cSize = this.props.children.length;
    
    let riverExpand = this.state.expand;
    
    return(
      <ErrorCatch>
      <div className='containerPro'>
        <ToastContainer
          position="top-right"
          autoClose={2500}
          newestOnTop />
        <div className='tenHeader'>
          <div className='topBorder' />
          <HomeIcon />
          {bData && 
            <div className='auxLeft'>
              <TideControl 
                batchID={bData._id} 
                tideKey={et} 
                currentLive={currentLive}
                tideLockOut={this.props.tideLockOut} />
            </div>}
          <div className='frontCenterTitle'>
            <FindBox append={append} />
          </div>
          <div className='auxRight'>
            <button
              id='exBatch'
              title='View this in explore'
              onClick={()=>FlowRouter.go(exploreLink)}>
              <i className='fas fa-rocket primeRightIcon' data-fa-transform='left-1'></i>
            </button>
          </div>
          <TideFollow proRoute={true} />
        </div>
        
        {this.props.standAlone ?
          <div className='proFull'>
            {this.props.children}
          </div>
        :
        <section className={!riverExpand ? 'proNarrow' : 'proWide'}>
          
          <div 
            className={
              !riverExpand ? 'proSingle forceScrollStyle' : 
              cSize > 2 ? 'proDual forceScrollStyle' : 
              'proSingle forceScrollStyle'
            }
          >
            <div className='proPrime'>
              {React.cloneElement(this.props.children[0],
                { 
                  currentLive: currentLive,
                  flow: path.flow,
                  flowAlt: path.flowAlt,
                  progCounts: path.progCounts,
                  showVerify: this.state.showVerify,
                  optionVerify: this.state.optionVerify,
                  changeVerify: (q)=>this.handleVerify(q)
                }
              )}
            </div>
            
            {cSize > 2 && riverExpand ?
              <div className='proExpand'>
                {React.cloneElement(this.props.children[1],
                  { 
                    currentLive: currentLive,
                    flow: path.flow,
                    flowAlt: path.flowAlt,
                    progCounts: path.progCounts
                  }
                )}
              </div>
            :null}
          </div>
          
        
          <button
            type='button'
            className={!riverExpand ? 'riverExpandToggle' : 'riverShrinkToggle'}
            onClick={()=>this.handleExpand()}>
            <i className='fas fa-sort fa-2x' data-fa-transform='rotate-90'></i>
          </button>
            
          <div className='proInstruct' style={scrollFix}>
            {this.props.children[this.props.children.length - 1]}
          </div>
  
          <FormBar
            batchData={this.props.batchData}
            currentLive={currentLive}
            itemData={this.props.itemData}
            widgetData={this.props.widgetData}
            versionData={this.props.versionData}
            users={this.props.users}
            app={this.props.app}
            ncListKeys={path.ncListKeys}
            action={this.props.action}
            showVerify={this.state.showVerify}
            changeVerify={(q)=>this.handleVerify(q)} />
          
        </section>
        }
      </div>
      </ErrorCatch>
    );
  }
}