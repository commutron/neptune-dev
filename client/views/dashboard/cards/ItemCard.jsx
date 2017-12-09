import React, {Component} from 'react';
import AnimateWrap from '/client/components/tinyUi/AnimateWrap.jsx';
import Pref from '/client/global/pref.js';

import River from '../../../components/river/River.jsx';
import ScrapBox from '../../../components/smallUi/ScrapBox.jsx';

export default class ItemCard extends Component	{
  
  componentWillReceiveProps(nextProps) {
    this.props.itemData.serial !== nextProps.itemData.serial ?
      this.forceUpdate() : null;
  }

  render() {

    const b = this.props.batchData;
    const i = this.props.itemData;
    const w = this.props.widgetData;
    const done = i.finishedAt !== false;
    const scrap = done ? i.history.find(x => x.type === 'scrap') : false;
    
    if(!b.river) {
      Session.set('nowStep', 'unavailable');
      return (
        <AnimateWrap type='cardTrans'>
          <div className='section sidebar centre centreText big' key={i.serial}>
            <br />
            <i className="fas fa-exclamation-circle fa-5x redT" aria-hidden="true"></i>
            <br />
            <p>
              This {Pref.batch} does not have a {Pref.flow}
            </p>
            <br />
          </div>
        </AnimateWrap>
        );
    }
    
    if(scrap) { 
      Session.set('nowStep', 'done');
      return (
        <AnimateWrap type='cardTrans'>
          <div className='section sidebar' key={i.serial}>
            <ScrapBox entry={scrap} />
          </div>
        </AnimateWrap>
        );
    }

    return (
      <AnimateWrap type='cardTrans'>
        <div className='section sidebar' key={i.serial}>
          <River
            itemData={i}
            batchData={b}
            widgetData={w}
            app={this.props.app}
            users={this.props.users} />
  			</div>
			</AnimateWrap>
    );
  }
}