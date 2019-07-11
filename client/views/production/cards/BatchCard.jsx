import React, {Component} from 'react';
import moment from 'moment';
import AnimateWrap from '/client/components/tinyUi/AnimateWrap.jsx';
import TideLock from '/client/components/tide/TideLock.jsx';
import Pref from '/client/global/pref.js';
import Tabs from '/client/components/bigUi/Tabs/Tabs.jsx';

import GeneralChunk from '/client/views/data/panels/BatchPanel/GeneralChunk.jsx';
//import JumpText from '../../../components/tinyUi/JumpText.jsx';
import FloorRelease from '/client/components/smallUi/FloorRelease.jsx';
import StepsProgress from '../../../components/bigUi/StepsProgress/StepsProgress.jsx';


export default class BatchCard extends Component	{
  
  render() {

    const b = this.props.batchData;
    const iS = this.props.itemSerial;
    const w = this.props.widgetData;
    //const g = this.props.groupData;
    const u = this.props.user;
    const a = this.props.app;
    
    const flow = this.props.flow;
    const flowAlt = this.props.flowAlt;
    const done = b.finishedAt !== false;
    
    const progCounts = this.props.progCounts;

    let iready = b.items.length === 0;
    
    let warn = b.blocks.filter( x => x.solve === false ).length;
    iready ? warn++ : null;
    
    let released = b.floorRelease === undefined ? undefined : 
                    b.floorRelease === false ? false :
                    typeof b.floorRelease === 'object';
    
    let tabOps = [
      <i className='fas fa-info-circle fa-fw' data-fa-transform='down-2' title='Info'></i>, 
      <i className='fas fa-tasks fa-fw' data-fa-transform='down-2' title='Progress'></i>
    ];


    return(
      <AnimateWrap type='cardTrans'>
        <div className='sidebar' key={b.batch}>
          <TideLock currentLive={this.props.currentLive}>
            {iready ?
              <h2 className='actionBox centreText yellow'>
                No {Pref.itemSerial}s created
              </h2>
            :
              released === undefined || released === true ? null :
                <FloorRelease id={b._id} />
            }
            
            {b.finishedAt !== false &&
              <h2 className='actionBox centreText green'>
                Finished: {moment(b.finishedAt).calendar()}
              </h2>}
          </TideLock>
          
            <Tabs
              tabs={tabOps}
              names={false}
              wide={true}
              stick={false}
              hold={true}
              sessionTab='batchProPanelTabs'>
              
              <div className='space cap'>
                <GeneralChunk a={a} b={b} done={done} expand={false} />
              </div>
              
              <div className='space cap'>
                <StepsProgress progCounts={progCounts} truncate={true} />
              </div>
              
            </Tabs>
  				
  			<br />
  
  			</div>
			</AnimateWrap>
    );
  }
}