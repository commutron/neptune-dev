import React, {Component} from 'react';
import moment from 'moment';
import AnimateWrap from '/client/components/tinyUi/AnimateWrap.jsx';
import Pref from '/client/global/pref.js';

import OrgWip from './panels/OrgWIP.jsx';
import BigPicture from './panels/BigPicture.jsx';

export default class OrgWIP extends Component	{
  
  render() { 
    
    return(
      <AnimateWrap type='cardTrans'>
        <div className='denseData' key={0}>
          <span>
            <BigPicture
              g={this.props.g}
              w={this.props.w}
              b={this.props.b}
              a={this.props.a} />
          </span>
          <span>
            <OrgWip 
              g={this.props.g}
              w={this.props.w}
              b={this.props.b}
              a={this.props.a} />
          </span>
        </div>
      </AnimateWrap>
    );
  }
}