import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import { ContextMenu, MenuItem, ContextMenuTrigger } from 'react-contextmenu';
import InOutWrap from '/client/components/tinyUi/InOutWrap.jsx';
import Pref from '/client/global/pref.js';

// props
/// id={b._id}
/// nonCons={nonCons}

export default class NCTributary extends Component {
  
  constructor() {
    super();
    this.handleFix = this.handleFix.bind(this);
    this.handleInspect = this.handleInspect.bind(this);
    this.handleReject = this.handleReject.bind(this);
    this.handleSkip = this.handleSkip.bind(this);
    this.handleSnooze = this.handleSnooze.bind(this);
    this.handleUnSkip = this.handleUnSkip.bind(this);
  }
  
  handleFix(ncKey) {
    const id = this.props.id;
    Meteor.call('fixNC', id, ncKey, (error)=> {
			if(error)
			  console.log(error);
		});
		let findBox = document.getElementById('find');
		findBox.focus();
  }

  handleInspect(ncKey) {
    const id = this.props.id;
    Meteor.call('inspectNC', id, ncKey, (error)=> {
			if(error)
			  console.log(error);
		});
		let findBox = document.getElementById('find');
		findBox.focus();
  }
    
  handleReject(ncKey, fixTime, fixWho) {
    const id = this.props.id;
    Meteor.call('rejectNC', id, ncKey, fixTime, fixWho, (error)=> {
			if(error)
			  console.log(error);
		});
		let findBox = document.getElementById('find');
		findBox.focus();
  }
    
  handleSkip(ncKey) {
    const id = this.props.id;
    Meteor.call('skipNC', id, ncKey, (error)=> {
			if(error)
        console.log(error);
		});
	}
	
	handleSnooze(ncKey) {
	  const id = this.props.id;
    Meteor.call('snoozeNC', id, ncKey, (error)=> {
			if(error)
        console.log(error);
		});
	}
	
	handleUnSkip(ncKey) {
	  const id = this.props.id;
    Meteor.call('UnSkipNC', id, ncKey, (error)=> {
      if(error)
        console.log(error);
		});
  }
  
  handleComment(ncKey, com) {
	  const id = this.props.id;
    Meteor.call('commentNC', id, ncKey, com, (error)=> {
      if(error)
        console.log(error);
		});
  }
  
  render() {
    return(
      <InOutWrap type='ncTrans' add='ncTrib'>
        {this.props.nonCons.map( (entry)=>{
          this.props.sType === 'finish' && entry.snooze === true ?
            this.handleUnSkip(entry.key) : null;
          return (
            <NCStream
              key={entry.key}
              entry={entry}
              id={this.props.id}
              end={this.props.sType === 'finish'}
              fix={()=> this.handleFix(entry.key)}
              inspect={()=> this.handleInspect(entry.key)}
              reject={()=> this.handleReject(entry.key, entry.fix.time, entry.fix.who)}
              skip={()=> this.handleSkip(entry.key)}
              snooze={()=> this.handleSnooze(entry.key)}
              unSkip={()=> this.handleUnSkip(entry.key)}
              comment={(e)=> this.handleComment(entry.key, e)}
            />
          )})}
      </InOutWrap>
    );
  }
}

export class NCStream extends Component {
  
  constructor() {
    super();
    this.state = {
      comment: false,
      moreInfo: false
    };
  }
  
  comment() {
    let val = window.prompt('Add a comment');
    val !== '' ? this.props.comment(val) : null;
  }
        
  render () {
    
    const fixed = this.props.entry.fix;
  
    const same = this.props.entry.fix.who === Meteor.userId();
    const inspector = Roles.userIsInRole(Meteor.userId(), 'inspect');
    const lockI = fixed ? !same && inspector ? false : true : false;
    let skip = this.props.entry.skip;
    let style = !skip ? 'cap tribRow darkRed noCopy' : 'cap tribRow yellow noCopy';
    
    let tryAgain = !this.props.entry.reject ? null :
                   this.props.entry.reject.length > 0 ?
                   <i className='badge'>
                    {this.props.entry.reject.length + 1}
                   </i>:
                   null;

    return (
      <ContextMenuTrigger id={this.props.entry.key} 
      attributes={ {className:style} }>
        <div className='tribCell up noCopy' title={this.props.entry.comm}>
          {this.props.entry.ref}
        </div>
        <div className='tribCell' title={this.props.entry.comm}>
          {this.props.entry.type}
        </div>
        <div className='tribCell'>
          {skip ?
            this.props.entry.snooze === true ?
              <i className='fas fa-clock fa-2x'></i>
              :
              <i className='fas fa-truck fa-2x'></i>
          :
            fixed ?
              <div className='twoSqIcons'>
                <button
                  title={Pref.inspect}
                  ref={(i)=> this.inspectline = i}
                  className='granule riverG'
                  readOnly={true}
                  onClick={this.props.inspect}
                  disabled={lockI}>
                <i className='fas fa-check fa-lg' aria-hidden='true'></i></button>
                <button
                  title={Pref.reject}
                  ref={(i)=> this.rejectline = i}
                  className='granule riverNG'
                  readOnly={true}
                  onClick={this.props.reject}
                  disabled={lockI}>
                <i className='fas fa-times fa-lg' aria-hidden='true'></i></button>
              </div>
          :
              <button
                title={Pref.repair}
                ref={(i)=> this.fixline = i}
                className='pebble'
                readOnly={true}
                onClick={this.props.fix}
                disabled={false}>
              <img src='/repair.svg' className='pebbleSVG' />{tryAgain}</button>
          }
        </div>
        <ContextMenu id={this.props.entry.key}>
          <MenuItem onClick={this.props.snooze} disabled={skip !== false || this.props.end}>
            Snooze
          </MenuItem>
          <MenuItem onClick={this.props.skip} disabled={skip !== false && !this.props.entry.snooze}>
            Skip
          </MenuItem>
          <MenuItem onClick={this.props.unSkip} disabled={!skip}>
            Activate
          </MenuItem>
          <MenuItem onClick={this.comment.bind(this)}>
            Comment
          </MenuItem>
        </ContextMenu>
      </ContextMenuTrigger>
    );
  }
}