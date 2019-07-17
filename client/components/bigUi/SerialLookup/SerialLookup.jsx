import React, {PureComponent} from 'react';

import LeapRow from '/client/components/tinyUi/LeapRow.jsx';

export default class SerialLookup extends PureComponent {
	
	constructor() {
		super();
		this.state = {
			searchText: false,
			results: null,
			exact: false,
		};
	}
    
	handleSmarts(e) {
    const value = e.target.value;
    const valid = !value || value.length < 4 ? false : true;
    if(valid) {
     this.setState({ searchText : value, results: undefined });
      Meteor.call('serialLookupPartial', value, (error, reply)=>{
        error && console.log(error);
        this.setState({ 
          results: reply.results, 
          exact: reply.exact
        });
  	  });
    }else{
      this.setState({ results: null });
      e.target.reportValidity();
    }
  }

	
	render() {
		
		const re = this.state.results;
		
		return(
			<div className='centre space'>
		  
		    <div className='tableList'>
		  
		    <div className='centre noCopy'>
          <p>
            <label className='blackT variableInput bigger'>
              <i className='bigger fas fa-search fa-fw'></i>
            </label>
            <input
              id='serialNum'
              className='cap'
              type='search'
              minLength='4'
              className='variableInput bigger'
              disabled={false}
              onChange={(e)=>this.handleSmarts(e)}
              autoFocus={true}
              required />
          </p>
          <p>Find an item serial number with fuzzy search</p>
        </div>
	    
        {re === null ?
          <div></div>
        : re === undefined ?
          <div>
            <p className='centreText'><em>looking</em></p>
          </div>
        : re === false || re.length === 0 ?
  	      <div>
            <p className='centreText'><b>NO RESULT</b></p>
          </div>
        : this.state.exact === true ?
          <div>
            <LeapRow
              key='1a'
              title={re[0].batch}
              cTwo={re[0].meta}
              cThree={this.state.searchText}
              sty='greenB'
              address={'/data/batch?request=' + re[0].batch + '&specify=' + this.state.searchText}
            />
          </div>
        :
          re.map( (entry, index)=> {
            return (
              <LeapRow
                key={index}
                title={entry.batch}
                cTwo={entry.meta}
                address={'/data/batch?request=' + entry.batch}
              />
          )})
        }
        
      </div>    
            
      </div>
		);
	}
}