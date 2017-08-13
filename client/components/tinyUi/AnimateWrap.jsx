import React, {Component} from 'react';
import {CSSTransitionGroup} from 'react-transition-group';

export default class AnimateWrap extends Component	{

  render() {
    return (
      <CSSTransitionGroup
				component='div'
				transitionName={this.props.type}
				transitionEnter={true}
				transitionAppear={true}
				transitionLeave={false}
				transitionEnterTimeout={500}
				transitionAppearTimeout={500}>
				
        {this.props.children}
      
      </CSSTransitionGroup>
    );
  }
}