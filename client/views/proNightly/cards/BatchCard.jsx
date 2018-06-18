import React, {Component} from 'react';
import moment from 'moment';
import AnimateWrap from '/client/components/tinyUi/AnimateWrap.jsx';
import Pref from '/client/global/pref.js';
import Tabs from '../../../components/smallUi/Tabs.jsx';

//import JumpText from '../../../components/tinyUi/JumpText.jsx';
import FloorRelease from '/client/components/smallUi/FloorRelease.jsx';
import { ReleaseNote } from '/client/components/bigUi/ReleasesModule.jsx';
import StepsProgress from '../../../components/bigUi/StepsProgress.jsx';
import NonConMiniSatus from '/client/components/charts/NonConMiniStatus.jsx';
import NonConMiniTops from '/client/components/bigUi/NonConMiniTops.jsx';
import TagsModule from '../../../components/bigUi/TagsModule.jsx';
import NoteLine from '../../../components/smallUi/NoteLine.jsx';
import BlockList from '../../../components/bigUi/BlockList.jsx';

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
    const expand = this.props.expand;

    let iready = b.items.length === 0;
    
    let warn = b.blocks.filter( x => x.solve === false ).length;
    iready ? warn++ : null;
    const showWarn = warn === 0 ? 'alertCount invisible' : 'alertCount';
    const exSpace = !expand ? 'nSpace' : 'exSpace';
    
    let released = b.floorRelease === undefined ? undefined : 
                    b.floorRelease === false ? false :
                    typeof b.floorRelease === 'object';
    
    const exploreLink = !iS ?
                        '/data/batch?request=' + b.batch :
                        '/data/batch?request=' + b.batch + '&specify=' + iS;

    return(
      <AnimateWrap type='cardTrans'>
        <div className='section sidebar' key={b.batch}>
          
          
          
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
          
            <Tabs
              tabs={[
                <i className='fas fa-info-circle fa-fw' data-fa-transform='down-2' title='Info'></i>, 
                <i className='fas fa-tasks fa-fw' data-fa-transform='down-2' title='Progress'></i>, 
                <i className='fas fa-thumbs-down fa-fw' data-fa-transform='down-2' title='NonConformances'></i>
              ]}
              names={false}
              wide={true}
              stick={false}
              hold={true}
              sessionTab='batchExPanelTabs'>
              
              <div className='space cap'>
                <TagsModule
                  id={b._id}
                  tags={b.tags}
                  vKey={false}
                  tagOps={a.tagOption} />
                <br />
                {released === true && 
                  <ReleaseNote id={b._id} release={b.floorRelease} expand={expand} />}
                <NoteLine entry={b.notes} id={b._id} versionKey={false} />
                <BlockList id={b._id} data={b.blocks} lock={done} expand={expand} />
              </div>
              
              <div className='space cap'>
                <StepsProgress
                  mini={true}
                  expand={true}
                  progCounts={progCounts} />
              </div>
              
              <div className={!expand ? 'space' : 'space twooneSplit'}>
                <div className={!expand ? '' : 'onetwoSplitTwo'}>
                  <NonConMiniSatus
                    noncons={b.nonCon}
                    flow={flow}
                    flowAlt={flowAlt}
                    user={u}
                    app={a} />
                </div>
                {expand &&
                  <div className='onetwoSplitOne'>
                    <NonConMiniTops noncons={b.nonCon} items={b.items} user={u} app={a} />
                  </div>}
              </div>
              
            </Tabs>
  				
  			<br />
  
  			</div>
			</AnimateWrap>
    );
  }
}