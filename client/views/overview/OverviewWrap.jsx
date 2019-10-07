import React, {useState, useEffect, useRef} from 'react';
import moment from 'moment';
import 'moment-timezone';
import { ToastContainer } from 'react-toastify';
import AnimateWrap from '/client/components/tinyUi/AnimateWrap.jsx';
import Pref from '/client/global/pref.js';

import Spin from '../../components/uUi/Spin.jsx';
import HomeIcon from '/client/components/uUi/HomeIcon.jsx';
import TideFollow from '/client/components/tide/TideFollow.jsx';

import BatchHeaders from './columns/BatchHeaders.jsx';
import BatchDetails from './columns/BatchDetails.jsx';

function useInterval(callback, delay) {
  const savedCallback = useRef();
  // Remember the latest callback.
  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  // Set up the interval.
  useEffect(() => {
    function tick() {
      savedCallback.current();
    }
    if (delay !== null) {
      let id = setInterval(tick, delay);
      return () => clearInterval(id);
    }
  }, [delay]);
}

const OverviewWrap = (props)=> {

  const [ loadTime, loadTimeSet ] = useState( moment() );
  const [ tickingTime, tickingTimeSet ] = useState( moment() );
  const [ sortBy, sortBySet ] = useState('batch');
  const [ hotState, hotSet ] = useState(false);
  const [ warmState, warmSet ] = useState(false);
  const [ lukeState, lukeSet ] = useState(false);
  const [ coolState, coolSet ] = useState(false);
  
  useEffect( ()=> {
    splitInitial();
  }, [sortBy, loadTime]);
  
  useEffect( ()=> {
    if(warmState) {
      sortHot();
    }
  }, [warmState]);
    
  useInterval( ()=> {
    tickingTimeSet( moment() );
  },1000*60);
  
  function changeSort(e) {
    const sort = e.target.value;
    sortBySet( sort );
  }
  
  function forceRefresh() {
    loadTimeSet( false );
    loadTimeSet( moment() );
    const clientTZ = moment.tz.guess();
    Meteor.call('FORCEcacheUpdate', clientTZ);
  }
  
  function splitInitial() {
    return new Promise((resolve) => {
      const batches = props.b;
      let warmBatches = [];
      let coolBatches = [];
      
      let orderedBatches = batches;
      
      if(sortBy === 'priority') {
        orderedBatches = batches.sort((b1, b2)=> {
          const pB1 = props.pCache.dataSet.find( x => x.batchID === b1._id);
          const pB1bf = pB1 ? pB1.estEnd2fillBuffer : 0;
          const pB2 = props.pCache.dataSet.find( x => x.batchID === b2._id);
          const pB2bf = pB2 ? pB2.estEnd2fillBuffer : 0;
          
          if (pB1bf < pB2bf) { return -1 }
          if (pB1bf > pB2bf) { return 1 }
          return 0;
        });
        
      }else if(sortBy === 'sales') {
        orderedBatches = batches.sort((b1, b2)=> {
          if (b1.salesOrder < b2.salesOrder) { return 1 }
          if (b1.salesOrder > b2.salesOrder) { return -1 }
          return 0;
        });
      }else if( sortBy === 'due') {
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
      
      warmSet( warmBatches );
      coolSet( coolBatches );
    });
  }
  
  function sortHot() {
    const clientTZ = moment.tz.guess();
    Meteor.call('activeCheck', clientTZ, sortBy, (error, reply)=> {
      error && console.log(error);
      if(reply) {
        const hot = warmState.filter( x => reply.includes( x.batch ) === true );
        const luke = warmState.filter( x => reply.includes( x.batch ) === false );
        hotSet( hot );
        lukeSet( luke );
      }
    });
  }
    
    //console.log({hot: this.state.hotBatches});
    //console.log({hotStuff: this.state.hotStatus});
    //console.log({luke: this.state.lukeBatches});
    //console.log({lukeStuff: this.state.lukeStatus});
    //console.log({coolStuff: this.state.coolStatus});
    
  const duration = moment.duration(
    loadTime.diff(tickingTime))
      .humanize();
  
  if(!warmState) {
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
              onClick={(e)=>forceRefresh()}>
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
              defaultValue={sortBy}
              onClick={(e)=>changeSort(e)}>
              <option value='batch'>{Pref.batch}</option>
              <option value='sales'>{Pref.salesOrder}</option>
              <option value='due'>{Pref.end}</option>
              <option value='priority'>priority</option>
            </select>
          </span>
          <span className='flexSpace' />
          <span>Updated {duration} ago</span>
        </nav>
          
        <div className='overviewContent forceScrollStyle' tabIndex='0'>
        
          <div className='overGridFrame'>
      
            <BatchHeaders
              key='fancylist0'
              hB={hotState}
              lB={lukeState}
              cB={coolState}
              bCache={props.bCache}
            />
            
            <BatchDetails
              key='fancylist1'
              hB={hotState}
              lB={lukeState}
              cB={coolState}
              bCache={props.bCache}
              pCache={props.pCache}
              user={props.user}
              app={props.app}
            />
              
          </div>
        </div>
        
      </div>
    </AnimateWrap>
  );
};

export default OverviewWrap;