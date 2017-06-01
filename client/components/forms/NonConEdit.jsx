import React, {Component} from 'react';
import Pref from '/client/global/pref.js';

import Model from '../smallUi/Model.jsx';
import NCChange from '../river/NCChange.jsx';
import NCSkip from '../river/NCSkip.jsx';

export default class NonConEdit extends Component {
        
  render () {

    return (
      <Model
        button={<p><i className='fa fa-pencil-square-o'></i> edit {Pref.nonCon}s</p>}
        title={'Edit ' + Pref.nonCon + 's for ' + this.props.bar}
        type='smallAction red wide'
        lock={!Meteor.user().power}>
        <div>
          <i>repaired and inspected {Pref.nonCon}s are locked</i>
          <div className='grid'>
            <br />
            {this.props.data.map( (entry, index)=>{
              return (
                <EditLine
                  key={index}
                  id={this.props.id}
                  ncKey={entry.key}
                  ncref={entry.ref}
                  nctype={entry.type + '|' + entry.cat}
                  skip={entry.skip}
                  lock={entry.inspect}
                  nons={this.props.nons}
                />
                )})}
            <br />
          </div>
        </div>
      </Model>
    );
  }
}



class EditLine extends Component {
  
  handleUnSkip() {
		const id = this.props.id;
    const ncKey = this.props.ncKey;
      Meteor.call('UnSkipNC', id, ncKey, (error)=> {
        if(error)
          console.log(error);
				Bert.alert("Un-Skipped", 'success');
			});
  }
    
  render() {
    
    return(
      <div className='gridRow wide'>
        <div className='gridCell'>
          {this.props.ncref}
        </div>
        <div className='gridCell'>
          <NCChange 
            type={this.props.nctype}
            id={this.props.id}
            ncKey={this.props.ncKey}
            lock={this.props.lock}
            nons={this.props.nons}
          />
        </div>
        <div className='gridCell'>
          {!this.props.skip ?
            <NCSkip 
              id={this.props.id}
              ncKey={this.props.ncKey}
              lock={this.props.lock}
            />
            :
            <button
              className='miniAction big yellowT'
              onClick={this.handleUnSkip.bind(this)}
              disabled={this.props.lock}
            >activate
            <i className="fa fa-play"></i>
            </button>
          }
        </div>
      </div>
      );
  }
}