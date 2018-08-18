import React, {Component} from 'react';
//import moment from 'moment';
//import Pref from '/client/global/pref.js';

// props id, fall, total, quantity, lock, app

export default class Waterfall extends Component	{
  
  constructor() {
    super();
    this.state = {
      lockPlus : false,
      lockMinus : false
    };
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
  
    const type = this.props.app.countOption.find( x => x.key === this.props.fall.wfKey ).type;
    let borderColor = 'borderBlue';
    let fadeColor = 'Blue';
    //// Style the Stone Accordingly \\\\
  	if(type === 'inspect'){
  		borderColor = 'borderGreen';
  		fadeColor = 'Green';
    }else if(type === 'checkpoint'){
  		borderColor = 'borderWhite';
  		fadeColor = 'White';
    }else if(type === 'test'){
  		borderColor = 'borderTeal';
  		fadeColor = 'Teal';
    }else if(type === 'finish'){
  		borderColor = 'borderPurple';
  		fadeColor = 'Purple';
    }else{
      null }
    
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
    
    //console.log({fadeDeg, fadeTick, fadeClass});
    
    return (
      <div className='waterfallGrid'>
        <button
          id={'goMinus' + this.props.fall.wfKey}
          className={'countMinus numFont ' + startClass}
          onClick={this.minusOne.bind(this)}
          disabled={this.props.lock || this.state.lockMinus || this.props.total === 0}
        >-1</button>
        
        <button
          className='countN action'
          disabled={this.props.lock || true}
        >+n</button>
        
        <button
          className='countRec action'
          disabled={this.props.lock || true}
        >rec</button>
        
        <button
          id={'goPlus' + this.props.fall.wfKey}
          className={'countPlus ' + borderColor + ' ' + fadeClass + ' ' + doneClass}
          onClick={this.plusOne.bind(this)}
          disabled={this.props.lock || this.state.lockPlus || this.props.total >= this.props.quantity}>
          <i className='countPlusTop numFont'>{this.props.total}</i>
          <br /><i className='numFont'>/{this.props.quantity}</i>
        </button>
    	</div>
    );
  }
}