import React, {Component} from 'react';

import NCAdd from '../river/NCAdd.jsx';
import NonConSkip from '../forms/NonConSkip.jsx';
import MultiItemForm from '../forms/MultiItemForm.jsx';

export default class FormBar extends Component	{
  
  render() {

    let batchData = this.props.batchData;
    let itemData = this.props.itemData;
    let versionData = this.props.versionData;
    let app = this.props.app;
    let act = this.props.action;
    let ncedit = Roles.userIsInRole(Meteor.userId(), 'inspect');
    
    return (
      <div className='dashAction'>
        <div className='footLeft'>
          {batchData && itemData && ncedit ?
            <NonConSkip
      		    ncData={batchData.nonCon}
      		    id={batchData._id}
              serial={itemData.serial}
      		    nons={app.nonConOption} />
        	: batchData && 
        	    act === 'batchBuild' &&
        	      batchData.items
        	        .filter( x => x.history.length < 1 )
      	            .length < 1 ?
          	  <MultiItemForm
                id={batchData._id}
                items={batchData.items}
                more={batchData.finishedAt === false}
                unit={versionData.units} />
          :null}
        </div>
        <div className='footCent'>
          {batchData && itemData ?
            <NCAdd 
              id={batchData._id}
              barcode={itemData.serial}
              app={app} />
            :null}
        </div>
        <div className='footRight'></div>
      </div>
    );
  }
}