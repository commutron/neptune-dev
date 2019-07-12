import React, {Component} from 'react';
import moment from 'moment';
import { ToastContainer } from 'react-toastify';
import AnimateWrap from '/client/components/tinyUi/AnimateWrap.jsx';
import Pref from '/client/global/pref.js';

import Spin from '../../components/uUi/Spin.jsx';
import HomeIcon from '/client/components/uUi/HomeIcon.jsx';
import TideFollow from '/client/components/tide/TideFollow.jsx';

import BatchHeaders from './columns/BatchHeaders.jsx';
import BatchDetails from './columns/BatchDetails.jsx';

export default class OverviewWrap extends Component	{
  componentDidMount() {
    this.dataStart();
    
    this.tickingClock = Meteor.setInterval( ()=>{
      this.setState({ tickingTime: moment() });
    },1000*60);
  }
  componentWillUnmount() {
    Meteor.clearInterval(this.tickingClock);
  }
  
  constructor() {
    super();
    this.state = {
      loadTime: moment(),
      tickingTime: moment(),
      hotBatches: false,
      hotStatus: [],
      warmBatches: false,
      lukeBatches: false,
      lukeStatus: [],
      coolBatches: false,
      coolStatus: []
    };
  }
  
  dataStart() {
    const clientTZ = moment.tz.guess();
    this.splitInitial()
      .then(this.sortHot(clientTZ));
  }
  
  splitInitial() {
    return new Promise(() => {
      const batches = this.props.b;
      let warmBatches = [];
      let coolBatches = [];
      // if(Roles.userIsInRole(Meteor.userId(), 'debug')) {
      //   const orderedBatches = batches.sort((b1, b2)=> {
      //     if (b1.batch < b2.batch) { return 1 }
      //     if (b1.batch > b2.batch) { return -1 }
      //     return 0;
      //   });
      //   warmBatches = orderedBatches.filter( x => typeof x.floorRelease === 'object' );
      //   coolBatches = orderedBatches.filter( x => x.floorRelease === false );
      // }else{
        warmBatches = batches.filter( x => typeof x.floorRelease === 'object' );
        coolBatches = batches.filter( x => x.floorRelease === false );
      //}
      //const batchesX = this.props.bx;
      //const warmBx = batchesX.filter( x => x.releases.find( y => y.type === 'floorRelease') == true );
      //const warmBx = batchesX.filter( x => x.releases.find( y => y.type === 'floorRelease') != true );
      this.setState({
        warmBatches: warmBatches,
        coolBatches: coolBatches,
      });
    });
  }
  
  sortHot(clientTZ) {
    return new Promise(() => {
      Meteor.call('activeCheck', clientTZ, (error, reply)=> {
        error && console.log(error);
        if(reply) {
          const warmBatches = this.state.warmBatches;
          const hot = warmBatches.filter( x => reply.includes( x.batch ) === true );
          const luke = warmBatches.filter( x => reply.includes( x.batch ) === false );
          this.setState({
            hotBatches: hot,
            lukeBatches: luke,
          });
          this.populate(clientTZ, reply);
        }
      });
    });
  }
  
  populate(clientTZ, activeList) {
    this.fetchInitial(clientTZ, 'hot', 'hotStatus', activeList)
      .then(this.fetchInitial(clientTZ, 'luke', 'lukeStatus', activeList))
        .then(this.fetchInitial(clientTZ, 'cool', 'coolStatus', activeList))
          .then(this.setState({ loadTime: moment() }));
  }
    
  fetchInitial(clientTZ, temp, slot, activeList) {
    return new Promise(() => {
      Meteor.call('statusSnapshot', clientTZ, temp, activeList, (error, reply)=> {
        error && console.log(error);
        this.setState({ [slot]: reply });
      });
    });
  }
  
  render() {
    
    //console.log({hot: this.state.hotBatches});
    //console.log({hotStuff: this.state.hotStatus});
    //console.log({luke: this.state.lukeBatches});
    //console.log({lukeStuff: this.state.lukeStatus});
    //console.log({coolStuff: this.state.coolStatus});
    
    const duration = moment.duration(
      this.state.loadTime.diff(this.state.tickingTime))
        .humanize();
    
    if(!this.state.warmBatches) {
      return (
        <div className='centreContainer'>
          <div className='centrecentre'>
            <Spin />
          </div>
        </div>
      );
    }
    
    return(
      <AnimateWrap type='contentTrans'>
      <div key={0} className='overviewContainer'>
        <ToastContainer
          position="top-right"
          autoClose={2500}
          newestOnTop />
        <div className='tenHeader'>
          <div className='topBorder'></div>
          <HomeIcon />
          <div className='frontCenterTitle'>Overview</div>
          <div className='auxRight'>
            <button
              type='button'
              title='Refresh Information'
              onClick={(e)=>this.dataStart(e)}>
            <i className='fas fa-sync-alt primeRightIcon'></i>
            </button>
          </div>
          <TideFollow />
        </div>
        
        <nav className='scrollToNav overviewNav'>
          {Roles.userIsInRole(Meteor.userId(), 'debug') &&
          <React.Fragment>
            <span><a href='#hotBatch'>Active</a></span>
            <span><a href='#lukewarmBatch'>In Progress</a></span>
            <span><a href='#coolBatch'>In Kitting</a></span>
          </React.Fragment>}
          
          <span>Sorted by {Pref.batch}, high to low</span>
          <span className='flexSpace' />
          <span>Updated {duration} ago</span>
        </nav>
          
        <div className='overviewContent forceScrollStyle' tabIndex='0'>
        
          <div className='overGridFrame'>
      
            <BatchHeaders
              key='fancylist0'
              hB={this.state.hotBatches}
              lB={this.state.lukeBatches}
              cB={this.state.coolBatches}
              bCache={this.props.bCache}
            />
            
            <BatchDetails
              key='fancylist1'
              hBs={this.state.hotStatus}
              lBs={this.state.lukeStatus}
              cBs={this.state.coolStatus}
              bCache={this.props.bCache}
              user={this.props.user}
              app={this.props.app}
            />
              
          </div>
        </div>
        
        </div>
      </AnimateWrap>
    );
  }
}