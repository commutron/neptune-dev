import React, {Component} from 'react';
import {CSSTransitionGroup} from 'react-transition-group';

export default class InOutWrap extends Component	{

  render() {
  	
  	let more = this.props.add ? this.props.add : '';
  	
    return (
      <CSSTransitionGroup
				component='div'
				className={more}
				transitionName={this.props.type}
				transitionEnter={true}
				transitionAppear={true}
				transitionLeave={true}
				transitionEnterTimeout={400}
				transitionAppearTimeout={400}
				transitionLeaveTimeout={400}>
				
        {this.props.children}
      
      </CSSTransitionGroup>
    );
  }
}

// these timouts are 100ms shorter than the duration in the css
// this seems to avoid a flicker at the end of the animation