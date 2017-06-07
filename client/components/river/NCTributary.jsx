import React, {Component} from 'react';

import NonConEdit from '../forms/NonConEdit.jsx';

// props
/// id={b._id}
/// bar={i.serial}
/// nonCons={nc}
/// ncOps={a.nonConOption}

export default class NCTributary extends Component {
  
  constructor() {
    super();
    this.state = {
      show: false
    };
    this.viewEdit = this.viewEdit.bind(this);
  }
  
  viewEdit(e) {
    e.preventDefault();
    this.setState({ show: !this.state.show });
  }
  
  render() {
    return(
      <div>
        {this.state.show ?
    		  <NonConEdit
    		    data={this.props.nonCons}
    		    id={this.props.id}
    		    bar={this.props.bar}
    		    nons={this.props.ncOps} />
    		: null }
      
        <div className='grid' onContextMenu={this.viewEdit.bind(this)}>
          {this.props.nonCons.map( (entry, index)=>{
            return (
              <NCStream key={index} entry={entry} id={this.props.id} />
            )})}
        </div>
      </div>
      );
  }
}

export class NCStream extends Component {

    handleFix() {
      this.fixline.disabled = true;
			const id = this.props.id;
      const ncKey = this.props.entry.key;
        Meteor.call('fixNC', id, ncKey, (error)=> {
					if(error)
					  console.log(error);
				});
				let findBox = document.getElementById('find');
				findBox.focus();
        }

	  handleInspect() {
	    this.fixline.disabled = true;
      const id = this.props.id;
      const ncKey = this.props.entry.key;
        Meteor.call('inspectNC', id, ncKey, (error)=> {
					if(error)
					  console.log(error);
				});
				let findBox = document.getElementById('find');
				findBox.focus();
        }
        
        
  render () {
    
    const fixed = this.props.entry.fix;
    const name = fixed ? 'Inspected' : 'Repaired';
    const luster = fixed ? '/inspectMini.svg' : '/repair.svg';
    const act = fixed ? this.handleInspect.bind(this) : this.handleFix.bind(this);
    const same = this.props.entry.fix.who === Meteor.userId();
    const inspector = Roles.userIsInRole(Meteor.userId(), 'inspect');
    const lock = fixed ? !same && inspector ? false : true : false;
    let skip = this.props.entry.skip;
    let style = !skip ? 'cap gridRow fadeRed' : 'cap gridRow fadeYellow';

    return (
      <div className={style}>
        <div className='gridCell'>{this.props.entry.ref}</div>
        <div className='gridCell'>{this.props.entry.type}</div>
        {!skip ? 
          <div className='gridCell'>
            <button 
              ref={(i)=> this.fixline = i}
              className='pebble green'
              readOnly={true}
              onClick={act}
              disabled={lock}>
            <img src={luster} className='pebbleSVG' />
            {name}
            </button>
          </div>
          :
          <div className='gridCell'>Skipped</div>
        }
      </div>
    );
  }
}