import React, {Component} from 'react';
import moment from 'moment';
import AnimateWrap from '/client/components/tinyUi/AnimateWrap.jsx';
import Pref from '/client/global/pref.js';
import Tabs from '../../../components/smallUi/Tabs.jsx';

//import JumpText from '../../../components/tinyUi/JumpText.jsx';
import WaterfallSelect from '/client/components/waterfall/WaterfallSelect.jsx';
import ReleaseAction from '/client/components/bigUi/ReleasesModule.jsx';
import { ReleaseNote } from '/client/components/bigUi/ReleasesModule.jsx';
//import StepsProgress from '../../../components/bigUi/StepsProgress.jsx';
//import NonConMiniSatus from '/client/components/charts/NonConMiniStatus.jsx';
//import NonConMiniTops from '/client/components/bigUi/NonConMiniTops.jsx';
import TagsModule from '../../../components/bigUi/TagsModule.jsx';
import NoteLine from '../../../components/smallUi/NoteLine.jsx';
import BlockList from '../../../components/bigUi/BlockList.jsx';

export default class BatchCardX extends Component	{
  
  render() {

    const b = this.props.batchData;
    //const iS = this.props.itemSerial;
    const w = this.props.widgetData;
    //const g = this.props.groupData;
    const u = this.props.user;
    const a = this.props.app;
    
    //const flow = this.props.flow;
    //const flowAlt = this.props.flowAlt;
    const done = b.completed === true;
    
    //const progCounts = this.props.progCounts;
    const expand = this.props.expand;

    //let iready = b.items.length === 0;

    //iready ? warn++ : null;
    
    let released = b.releases.find( x => x.type === 'floorRelease');

    return(
      <AnimateWrap type='cardTrans'>
        <div className='section sidebar' key={b.batch}>
          
          {!released ?
            <ReleaseAction id={b._id} rType='floorRelease' />
          :
            <WaterfallSelect batchData={b} app={a} />
          }
          
            <Tabs
              tabs={[
                <i className='fas fa-info-circle fa-fw' data-fa-transform='down-2' title='Info'></i>, 
                <i className='fas fa-tasks fa-fw' data-fa-transform='down-2' title='Progress'></i>, 
                <i className='fas fa-thumbs-down fa-fw' data-fa-transform='down-2' title='NonConformances'></i>
              ]}
              names={expand ? ['Info', 'Progress', 'NonCons'] : false}
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
                {released &&
                  <ReleaseNote
                    id={b._id}
                    release={released}
                    xBatch={true}
                    expand={expand} />}
                <NoteLine entry={b.notes} id={b._id} xbatch={true} versionKey={false} />
                <BlockList id={b._id} data={b.blocks} xbatch={true} lock={done} expand={expand} />
              </div>
              

              <div className='space cap'>
              {/*
                <StepsProgress
                  mini={true}
                  expand={expand}
                  progCounts={progCounts} />
                */}
              </div>
              
              <div className={!expand ? 'space' : 'space twooneSplit'}>
                <div className={!expand ? '' : 'onetwoSplitTwo'}>
                {/*
                  <NonConMiniSatus
                    noncons={b.nonCon}
                    flow={flow}
                    flowAlt={flowAlt}
                    user={u}
                    app={a} />
                  */}
                </div>
                {expand &&
                  <div className='onetwoSplitOne'>
                  {/*
                    <NonConMiniTops noncons={b.nonCon} items={b.items} user={u} app={a} />
                  */}
                  </div>}
              </div>
              
            </Tabs>
  				
  			  <br />
  
  			</div>
			</AnimateWrap>
    );
  }
}