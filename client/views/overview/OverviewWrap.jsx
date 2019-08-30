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
      sortBy: 'batch',
      hotBatches: false,
      warmBatches: false,
      lukeBatches: false,
      coolBatches: false,
    };
  }
  
  dataStart() {
    const clientTZ = moment.tz.guess();
    this.splitInitial()
      .then(this.sortHot(clientTZ));
  }
  
  changeSort(e) {
    const sort = e.target.value;
    this.setState({ sortBy: sort }, ()=>{
      this.dataStart();    
    });
  }
  
  splitInitial() {
    return new Promise(() => {
      const batches = this.props.b;
      let warmBatches = [];
      let coolBatches = [];
      
      let orderedBatches = batches;
      
      if(this.state.sortBy === 'sales') {
        orderedBatches = batches.sort((b1, b2)=> {
          if (b1.salesOrder < b2.salesOrder) { return 1 }
          if (b1.salesOrder > b2.salesOrder) { return -1 }
          return 0;
        });
      }else if( this.state.sortBy === 'due') {
        orderedBatches = batches.sort((b1, b2)=> {
          if (b1.end < b2.end) { return -1 }
          if (b1.end > b2.end) { return 1 }
          return 0;
        });
      }else{
        orderedBatches = batches.sort((b1, b2)=> {
          if (b1.batch < b2.batch) { return 1 }
          if (b1.batch > b2.batch) { return -1 }
          return 0;
        });
      }
        
        warmBatches = orderedBatches.filter( x => typeof x.floorRelease === 'object' );
        coolBatches = orderedBatches.filter( x => x.floorRelease === false );
      
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
    const sortBy = this.state.sortBy;
    return new Promise(() => {
      Meteor.call('activeCheck', clientTZ, sortBy, (error, reply)=> {
        error && console.log(error);
        if(reply) {
          const warmBatches = this.state.warmBatches;
          const hot = warmBatches.filter( x => reply.includes( x.batch ) === true );
          const luke = warmBatches.filter( x => reply.includes( x.batch ) === false );
          this.setState({
            hotBatches: hot,
            lukeBatches: luke,
            loadTime: moment()
          });
        }
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
          <span>
            <i>sort by: </i>
            <select
              id='sortSelect'
              title='Change List Order'
              className='overlistSort'
              defaultValue={this.state.sortBy}
              onClick={(e)=>this.changeSort(e)}>
              <option value='batch'>{Pref.batch}</option>
              <option value='sales'>{Pref.salesOrder}</option>
              <option value='due'>{Pref.end}</option>
            </select>
          </span>
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
              hB={this.state.hotBatches}
              lB={this.state.lukeBatches}
              cB={this.state.coolBatches}
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