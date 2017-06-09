import React, {Component} from 'react';
import SlideDownWrap from '/client/components/tinyUi/SlideDownWrap.jsx';
import Pref from '/client/global/pref.js';

import River from '../../../components/river/River.jsx';
import ScrapBox from '../../../components/smallUi/ScrapBox.jsx';

export default class ItemCard extends Component	{

  render() {

    const b = this.props.batchData;
    const i = this.props.itemData;
    const w = this.props.widgetData;
    const done = i.finishedAt !== false;
    const scrap = done ? i.history.find(x => x.type === 'scrap') : false;
    
    if(!b.river) {
      Session.set('nowStep', 'unavailable');
      return (
        <SlideDownWrap>
          <div className='card centre big'>
            <br />
            <i className="fa fa-exclamation-circle fa-5x redT" aria-hidden="true"></i>
            <br />
            <p>
              <i>A {Pref.buildFlow} has not been selected for this {Pref.batch}</i>
            </p>
            <br />
          </div>
        </SlideDownWrap>
        );
    }
    
    if(scrap) { 
      return (
        <SlideDownWrap>
          <div className='card'>
            <ScrapBox entry={scrap} />
          </div>
        </SlideDownWrap>
        );
    }

    return (
      <SlideDownWrap>
        <div className='card'>
          <River
            itemData={i}
            batchData={b}
            widgetData={w}
            app={this.props.app}
            users={this.props.users} />
  			</div>
			</SlideDownWrap>
    );
  }
}