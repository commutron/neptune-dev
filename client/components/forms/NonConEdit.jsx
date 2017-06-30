import React, {Component} from 'react';
import Pref from '/client/global/pref.js';

import Model from '../smallUi/Model.jsx';
import NCChange from '../river/NCChange.jsx';
import NCSkip from '../river/NCSkip.jsx';

/*
ncData={batchData.nonCon}
id={batchData._id}
serial={itemData.serial}
nons={app.nonConOption}
*/

export default class NonConEdit extends Component {
  
  nonCons() {
    relevant = this.props.ncData.filter( 
        x => x.serial === this.props.serial && x.inspect === false );
    relevant.sort((n1, n2)=> {
      if (n1.ref < n2.ref) { return -1 }
      if (n1.ref > n2.ref) { return 1 }
      return 0;
    });
    return relevant;
  }
        
  render () {
    
    let nc = this.nonCons();
    
    let now = Session.get('nowStep');
		let lock = now === 'done';
    
    let button = 
      <span className='actionIconWrap'>
          <label htmlFor='dtToggle' id='boltSwitch' className='navIcon'>
            <i className="fa fa-pencil-square-o fa-2x fa-inverse redT"></i>
            <span className='actionIconText redT'>edit {Pref.nonCon}s</span>
          </label>
      </span>;
    

    return (
      <Model
        button={button}
        title={'Edit ' + Pref.nonCon + 's for ' + this.props.serial}
        type='miniAction'
        lock={lock}>
        <div>
          <i>repaired and inspected {Pref.nonCon}s are locked</i>
          <div className='grid'>
            <br />
            {nc.map( (entry, index)=>{
              return (
                <EditLine
                  key={index}
                  id={this.props.id}
                  ncKey={entry.key}
                  ncref={entry.ref}
                  nctype={entry.type}
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
        <div className='gridCell bigger'>
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