import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import { ContextMenu, MenuItem, ContextMenuTrigger } from 'react-contextmenu';
import InOutWrap from '/client/components/tinyUi/InOutWrap.jsx';
import Pref from '/client/global/pref.js';

const NCTributary = ({ id, serial, nonCons, sType })=> {

  function handleFix(ncKey) {
    Meteor.call('fixNC', id, ncKey, (error)=> {
			if(error)
			  console.log(error);
		});
		let findBox = document.getElementById('lookup');
		findBox.focus();
  }

  function handleInspect(ncKey) {
    Meteor.call('inspectNC', id, ncKey, (error)=> {
			if(error)
			  console.log(error);
		});
		let findBox = document.getElementById('lookup');
		findBox.focus();
  }
    
  function handleReject(ncKey, fixTime, fixWho) {
    Meteor.call('rejectNC', id, ncKey, fixTime, fixWho, (error)=> {
			if(error)
			  console.log(error);
		});
		let findBox = document.getElementById('lookup');
		findBox.focus();
  }
    
  function handleSkip(ncKey) {
    Meteor.call('skipNC', id, ncKey, (error)=> {
			if(error)
        console.log(error);
		});
	}
	
	function handleSnooze(ncKey) {
    Meteor.call('snoozeNC', id, ncKey, (error)=> {
			if(error)
        console.log(error);
		});
	}
	
	function handleUnSkip(ncKey) {
    Meteor.call('UnSkipNC', id, ncKey, (error)=> {
      if(error)
        console.log(error);
		});
  }
  
  function handleComment(ncKey, com) {
    Meteor.call('commentNC', id, ncKey, com, (error)=> {
      if(error)
        console.log(error);
		});
  }
  
  return(
    <InOutWrap type='ncTrans' add='ncTrib'>
      {nonCons.map( (entry)=>{
        sType === 'finish' && entry.snooze === true ?
          handleUnSkip(entry.key) : null;
        return (
          <NCStream
            key={entry.key}
            entry={entry}
            id={id}
            end={sType === 'finish'}
            fix={()=> handleFix(entry.key)}
            inspect={()=> handleInspect(entry.key)}
            reject={()=> handleReject(entry.key, entry.fix.time, entry.fix.who)}
            skip={()=> handleSkip(entry.key)}
            snooze={()=> handleSnooze(entry.key)}
            unSkip={()=> handleUnSkip(entry.key)}
            comment={(e)=> handleComment(entry.key, e)}
          />
        )})}
    </InOutWrap>
  );
};

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

    return(
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
              <i><i className='fas fa-clock fa-2x'></i></i>
              :
              <b><i className='fas fa-truck fa-2x'></i></b>
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

export default NCTributary;