import React, {Component} from 'react';
import moment from 'moment';
import AnimateWrap from '/client/components/tinyUi/AnimateWrap.jsx';
import Pref from '/client/global/pref.js';
import UserName from '/client/components/uUi/UserName.jsx';
import Tabs from '../../../components/smallUi/Tabs.jsx';

//import JumpText from '../../../components/tinyUi/JumpText.jsx';
import FloorRelease from '/client/components/river/FloorRelease.jsx';
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

          <div className='cardTitle'>
            <i className={showWarn + ' ' + exSpace}></i>
            <i className='bigger'>{b.batch}</i>
            <button
              id='exBatch'
              title='View this in explore'
              className='exLeap'
              onClick={()=>FlowRouter.go(exploreLink)}>
              {expand && <i className='small'>Explore </i>}
              <i className='fas fa-rocket fa-fw'></i>
            </button>
          </div>
          
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
                <NoteLine entry={b.notes} id={b._id} versionKey={false} />
                {released === true &&
                  <fieldset className='noteCard'>
                    <legend>Released to the Floor</legend>
                      {moment(b.floorRelease.time).calendar()}
                      {expand && ' by '}
                      {expand && <UserName id={b.floorRelease.who} />}
                    </fieldset>}
                <BlockList id={b._id} data={b.blocks} lock={done} expand={expand} />
              </div>
              
              <div className='space cap'>
                <StepsProgress
                  //batchData={b}
                  //flow={flow}
                  //flowAlt={flowAlt}
                  mini={true}
                  expand={expand}
                  progCounts={progCounts} />
              </div>
              
              <div className={!expand ? 'space' : 'indent twooneSplit'}>
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
                    <NonConMiniTops noncons={b.nonCon} user={u} app={a} />
                  </div>}
              </div>
              
            </Tabs>
  				
  			<br />
  
  			</div>
			</AnimateWrap>
    );
  }
}