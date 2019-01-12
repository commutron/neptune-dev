import React, {Component} from 'react';
import AnimateWrap from '/client/components/tinyUi/AnimateWrap.jsx';
import CreateTag from '/client/components/uUi/CreateTag.jsx';
import Pref from '/client/global/pref.js';
import WidgetsDepth from '/client/components/bigUi/WidgetsDepth.jsx';
import TagsModule from '/client/components/bigUi/TagsModule.jsx';
//import WatchButton from '/client/components/bigUi/WatchModule/WatchModule.jsx';

export default class GroupPanel extends Component	{

  render() {

    const g = this.props.groupData;
    const widgetData = this.props.widgetData;
    const allBatch = this.props.allBatch;
    const active = this.props.active;
    const app = this.props.app;
    //const user = this.props.user;

    return (
      <AnimateWrap type='cardTrans'>
        <div className='section centre overscroll' key={g.alias}>
        
          <div className='titleSection'>
            <span className='cap'>{g.group}</span>
            {/*
            <span>
              <WatchButton 
                list={user.watchlist}
                type='group'
                keyword={g.alias} />
            </span>
            */}
          </div>
          
          <div className='space edit'>
          
            <p className='capFL'>
              {Pref.instruct} index: <a className='clean wordBr' href={g.wiki} target='_blank'>{g.wiki}</a>
            </p>
            
            <br />
            
            <TagsModule
              id={g._id}
              tags={g.tags}
              vKey={false}
              group={true}
              tagOps={app.tagOption} />
          </div>
          
          <WidgetsDepth
            groupAlias={g.alias}
            widgetData={widgetData}
            allBatch={allBatch}
            active={active} />

          <CreateTag
            when={g.createdAt}
            who={g.createdWho}
            whenNew={g.updatedAt}
            whoNew={g.updatedWho}
            dbKey={g._id} />
        </div>
      </AnimateWrap>
    );
  }
}