import React, {Component} from 'react';
import moment from 'moment';
import AnimateWrap from '/client/components/tinyUi/AnimateWrap.jsx';
import Pref from '/client/global/pref.js';

import Tabs from '../../../components/smallUi/Tabs.jsx';

//import JumpText from '../../../components/tinyUi/JumpText.jsx';
import StepsProgress from '../../../components/bigUi/StepsProgress.jsx';
import NonConMiniSatus from '/client/components/charts/NonConMiniStatus.jsx';
import NonConMiniTops from '/client/components/bigUi/NonConMiniTops.jsx';
import TagsModule from '../../../components/bigUi/TagsModule.jsx';
import NoteLine from '../../../components/smallUi/NoteLine.jsx';
import BlockNotes from '../../../components/smallUi/BlockNotes.jsx';

export default class BatchCard extends Component	{
  
  render() {

    const b = this.props.batchData;
    const iS = this.props.itemSerial;
    const w = this.props.widgetData;
    //const g = this.props.groupData;
    const u = this.props.user;
    const a = this.props.app;
    
    //const v = w.versions.find( x => x.versionKey === b.versionKey );
    
    const flow = w.flows.find( x => x.flowKey === b.river);
    const riverFlow = flow ? flow.flow : [];
    
    const flowAlt = w.flows.find( x => x.flowKey === b.riverAlt );
    const riverAltFlow = flowAlt ? flowAlt.flow : [];
    
    let iready = b.items.length === 0;
    
    let warn = b.blocks.filter( x => x.solve === false ).length;
    iready ? warn++ : null;
    const showWarn = warn === 0 ? 'alertCount invisible' : 'alertCount';
    
    const expand = this.props.expand;
    
    const exploreLink = !iS ?
                        '/data/batch?request=' + b.batch :
                        '/data/batch?request=' + b.batch + '&specify=' + iS;

    return (
      <AnimateWrap type='cardTrans'>
        <div className='section sidebar' key={b.batch}>

          <div className='cardTitle'>
            <i className={showWarn}></i>
            <i className='bigger'>{b.batch}</i>
            <label htmlFor='exBatch' title='view in explore'>
              <button
                id='exBatch'
                title='explore'
                onClick={()=>FlowRouter.go(exploreLink)}>
              </button>
                <i className='fas fa-search'></i>
            </label>
          </div>
          
          {iready ?
            <h2 className='actionBox centreText yellow'>
              No {Pref.itemSerial}s created
            </h2>
          :null}
          
          {b.finishedAt !== false ?
            <h2 className='actionBox centreText green'>
              Finished: {moment(b.finishedAt).calendar()}
            </h2>
          :null}
          
          
          {/*!expand ?*/}
            <Tabs
              tabs={[
                <i className='fas fa-info-circle' data-fa-transform='down-2' title='Info'></i>, 
                <i className='fas fa-tasks' data-fa-transform='down-2' title='Progress'></i>, 
                <i className='fas fa-thumbs-down' data-fa-transform='down-2' title='NonConformances'></i>
              ]}
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
                <BlockNotes data={b.blocks} />
              </div>
              
              <div className='space cap'>
                <StepsProgress
                  batchData={b}
                  flow={riverFlow}
                  flowAlt={riverAltFlow}
                  mini={true}
                  expand={expand} />
              </div>
              
              <div className={!expand ? 'space' : 'indent twooneSplit'}>
                <div className={!expand ? '' : 'onetwoSplitTwo'}>
                  <NonConMiniSatus
                    noncons={b.nonCon}
                    flow={riverFlow}
                    flowAlt={riverAltFlow}
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