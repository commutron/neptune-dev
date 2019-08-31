import React, {Component} from 'react';
import AnimateWrap from '/client/components/tinyUi/AnimateWrap.jsx';
import TideLock from '/client/components/tide/TideLock.jsx';
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
    //const done = i.finishedAt !== false;
    const scrap = i.history.find(x => x.type === 'scrap' && x.good === true);
    
    const flow = this.props.flow;
    const flowAlt = this.props.flowAlt;
    const progCounts = this.props.progCounts;
    
    if(!b.river) {
      Session.set('ncWhere', Pref.outOfFlow);
	    Session.set('nowStepKey', undefined);
      return (
        <AnimateWrap type='cardTrans'>
          <div className='section sidebar centre centreText' key={i.serial}>
            <p><i className="fas fa-exclamation-circle fa-5x redT"></i></p>
            <p className='medBig'>
              This {Pref.batch} does not have a {Pref.flow}
            </p>
            <br />
          </div>
        </AnimateWrap>
        );
    }
    
    if(b.floorRelease === false) {
      Session.set('ncWhere', Pref.outOfFlow);
	    Session.set('nowStepKey', undefined);
      return (
        <AnimateWrap type='cardTrans'>
          <div className='section sidebar centre centreText space' key={i.serial}>
            <p><i className="fas fa-exclamation-triangle fa-5x orangeT"></i></p>
            <p className='medBig'>
              This {Pref.batch} has not been released from Kitting
            </p>
            <p><em>
              "Release to the Floor" must be recorded
            </em></p>
            <br />
          </div>
        </AnimateWrap>
        );
    }

    return (
      <AnimateWrap type='cardTrans'>
        <div key={i.serial}>
          {scrap &&
            <div className='section sidebar' key={i.serial}>
              <ScrapBox entry={scrap} />
            </div>
          }
          
          <TideLock currentLive={this.props.currentLive}>
            <River
              itemData={i}
              batchData={b}
              widgetData={w}
              app={this.props.app}
              users={this.props.users}
              currentLive={this.props.currentLive}
              flow={flow}
              flowAlt={flowAlt}
              progCounts={progCounts}
              showVerify={this.props.showVerify}
              optionVerify={this.props.optionVerify}
              changeVerify={this.props.changeVerify} />
          </TideLock>
  			</div>
			</AnimateWrap>
    );
  }
}