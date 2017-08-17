import React, {Component} from 'react';
import {CSSTransitionGroup} from 'react-transition-group';

export default class InOutWrap extends Component	{

  render() {
    return (
      <CSSTransitionGroup
				component='span'
				transitionName={this.props.type}
				transitionEnter={true}
				transitionAppear={true}
				transitionLeave={true}
				transitionEnterTimeout={500}
				transitionAppearTimeout={500}
				transitionLeaveTimeout={500}>
				
        {this.props.children}
      
      </CSSTransitionGroup>
    );
  }
}