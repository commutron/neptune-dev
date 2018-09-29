import React, {Component} from 'react';
//import moment from 'moment';
//import Pref from '/client/global/pref.js';

// props id, fall, total, quantity, lock, app

export default class Waterfall extends Component	{
  
  constructor() {
    super();
    this.state = {
      lockPlus : false,
      lockMinus : false,
      showMenu : false
    };
  }
  
  plusMeta(meta) {
    const batchID = this.props.id;
    if(this.props.total < this.props.quantity) {
      Meteor.call('metaCounter', batchID, this.props.fall.wfKey, meta, (error)=>{
        error && console.log(error);
      });
    }
  }
  
  plusOne() {
    this.setState({ lockPlus : true });
    const batchID = this.props.id;
    if(this.props.total < this.props.quantity) {
      Meteor.call('positiveCounter', batchID, this.props.fall.wfKey, (error)=>{
        error && console.log(error);
        let speed = !Meteor.user().unlockSpeed ? 2000 : Meteor.user().unlockSpeed; 
        Meteor.setTimeout(()=> {
          this.setState({ lockPlus : false });
        }, speed/4);
      });
    }
  }
  
  minusOne() {
    this.setState({ lockMinus : true });
    const batchID = this.props.id;
    if(this.props.total > 0) {
      Meteor.call('negativeCounter', batchID, this.props.fall.wfKey, (error)=>{
        error && console.log(error);
        let speed = !Meteor.user().unlockSpeed ? 2000 : Meteor.user().unlockSpeed; 
        Meteor.setTimeout(()=> {
          this.setState({ lockMinus : false });
        }, speed/4);
      });
    }
  }
  
  render() {
    
    const metaTicks = this.props.fall.counts.filter( x => x.tick === 0);
    const starts = metaTicks.filter( x => x.meta === 'start').length;
    const stops = metaTicks.filter( x => x.meta === 'stop').length;
    const active = starts > 0 && starts > stops;
    
    let borderColor = this.props.borderColor;
    let fadeColor = this.props.fadeColor;
    
    const fadeDeg = Math.floor( (this.props.total / this.props.quantity ) * 100 );
  
    let fadeTick = fadeDeg < 10 ? '0' :
                   fadeDeg < 20 ? '10' :
                   fadeDeg < 30 ? '20' :
                   fadeDeg < 40 ? '30' :
                   fadeDeg < 50 ? '40' :
                   fadeDeg < 60 ? '50' :
                   fadeDeg < 70 ? '60' :
                   fadeDeg < 80 ? '70' :
                   fadeDeg < 90 ? '80' :
                   fadeDeg < 100 ? '90' :
                   '100';
    
    let fadeClass = 'countFill' + fadeColor + fadeTick;
    let startClass = fadeDeg <= 0 || this.props.lock ? 'countStop' : '';
    let doneClass = fadeDeg >= 100 || this.props.lock ? 'countStop' : '';
    let offClass = /*!active ? 'countStop' :*/ '';
    
    return (
      <div className='waterfallGrid'>
        <button
          id={'goMinus' + this.props.fall.wfKey}
          className={offClass + ' countMinus numFont ' + startClass}
          onClick={this.minusOne.bind(this)}
          disabled={/*!active ||*/ this.props.lock || this.state.lockMinus || this.props.total === 0}
        >-1</button>
        
        {/*active ?
          <button
            className='countOnOff countOff action'
            onClick={this.plusMeta.bind(this, 'stop')}
            disabled={this.props.lock}
          >&#x2BC0;</button>
        :
          <button
            className={'countOnOff countOn action ' + fadeColor.toLowerCase()}
            onClick={this.plusMeta.bind(this, 'start')}
            disabled={this.props.lock}
          >&#9654;</button>
        */}
        
        <span>
          <button
            className='countN action low'
            onClick={()=>this.setState({ showMenu: true })}
            disabled={
              !active || this.props.lock || 
              this.state.lockPlus || 
              this.props.total >= this.props.quantity || true
            }
          >+n</button>
          {this.state.showMenu ?
            <div className='overlay invert' key={1}>
              <div className='medModel'>
                <button
                  className='action clearRed'
                  onClick={()=>this.setState({ showMenu: false })}
                  title='close'
                ><i className='fas fa-times'></i></button>
                <br />
                add multiple
              </div>
            </div>
          : null}
        </span>
        
        <button
          className='countRec action low'
          disabled={
            !active || this.props.lock || 
            this.state.lockPlus || 
            this.props.total >= this.props.quantity || true
          }
        >rec</button>
        
        
        <button
          id={'goPlus' + this.props.fall.wfKey}
          className={offClass + ' countPlus ' + borderColor + ' ' + fadeClass + ' ' + doneClass}
          onClick={this.plusOne.bind(this)}
          disabled={/*!active || */ this.props.lock || this.state.lockPlus || this.props.total >= this.props.quantity}>
          <i className='countPlusTop numFont'>{this.props.total}</i>
          <br /><i className='numFont'>/{this.props.quantity}</i>
        </button>
    	</div>
    );
  }
}