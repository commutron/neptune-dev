import React, {Component} from 'react';

import WikiFrame from './WikiFrame';

export default class WikiOps extends Component {

  address() {
    let wi = this.props.wi;
    const root = this.props.root;
    const anchor = this.props.brick;
    
    ////// custom Fallback for the transition \\\\\\\
    if(this.props.fallback) {
      const num = this.props.fallback;
      const yr = num.slice(0,2);
      let pisces = root + '/doku.php?id=workorders:';
      if(yr == '16') {
        pisces = pisces + '16000:' + num;
      }else{
        pisces = pisces + '17000:' + num;
      }
      return pisces;
    }
    //////////////////////////////////////////
    
    !wi || wi === 'home' || wi === 'none' ? wi = root : false;
    
    anchor ? wi = wi + '#' + anchor : false;

    //console.log(wi);// this is for diagnosics
    return wi;
  }

  render () {
    
    return (
      <div className='instructionFix'>
        <WikiFrame go={this.address()} />
      </div>
    );
  }
}