import React, {Component} from 'react';
import AnimateWrap from '/client/components/tinyUi/AnimateWrap.jsx';
import CreateTag from '/client/components/uUi/CreateTag.jsx';
import Pref from '/client/global/pref.js';

import TagsModule from '/client/components/bigUi/TagsModule.jsx';

export default class GroupPanel extends Component	{

  render() {

    let g = this.props.groupData;
    const a = this.props.app;

    return (
      <AnimateWrap type='cardTrans'>
        <div className='section' key={g.alias}>
        
          <div className='titleSection'>
            <span className='cap'>{g.group}</span>
            <span className='up'>{g.alias}</span>
          </div>
          
          <div className='space edit'>
          
            <p>{Pref.instruct} index: <a className='clean' href={g.wiki} target='_blank'>{g.wiki}</a></p>
            
            <br />
            
            <TagsModule
              id={g._id}
              tags={g.tags}
              vKey={false}
              group={true}
              tagOps={a.tagOption} />
              
          </div>
          
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