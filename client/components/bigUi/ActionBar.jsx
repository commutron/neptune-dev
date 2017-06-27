import React, {Component} from 'react';

import DataToggle from '../tinyUi/DataToggle.jsx';
import IkyToggle from '../tinyUi/IkyToggle.jsx';
import NCAdd from '../river/NCAdd.jsx';
import BatchForm from '../forms/BatchForm.jsx';
import MultiItemForm from '../forms/MultiItemForm.jsx';
import RiverSelect from '../forms/RiverSelect.jsx';
import NCEscape from '../forms/NCEscape.jsx';
import RMAForm from '../forms/RMAForm.jsx';
import Remove from '../forms/Remove.jsx';



export default class ActionBar extends Component	{
  
  render() {
    
    let snap = this.props.snap;
    let batchData = this.props.batchData;
    let itemData = this.props.itemData;
    let widgetData = this.props.widgetData;
    let versionData = this.props.versionData;
    let groupData = this.props.groupData;
    let app = this.props.app;
    
    return (
      <div className='dashAction'>
        <div className='footLeft'>
        {
          snap && batchData ?
          <div>
            <BatchForm
              batchId={batchData._id}
              batchNow={batchData.batch}
              versionNow={batchData.versionKey}
              start={batchData.start}
              end={batchData.end}
              widgetId={batchData.widgetId}
              versions={widgetData.versions}
              lock={!widgetData.versions || !batchData.active} />
            <MultiItemForm
              id={batchData._id}
              items={batchData.items}
              more={batchData.finishedAt === false}
              unit={versionData.unit} />
            <RiverSelect
              id={batchData._id}
              widget={widgetData}
              river={batchData.river}
              riverAlt={batchData.riverAlt}
              lock={batchData.finishedAt !== false} />
            <NCEscape
              id={batchData._id}
              nons={app.nonConOption} />
            <RMAForm
              id={batchData._id}
              edit={false}
              options={app.trackOption}
              end={app.lastTrack} />
            <Remove
              action='batch'
              title={batchData.batch}
              check={batchData.createdAt.toISOString()}
              entry={batchData} />
          </div>
          :null
        }

        </div>
        
        <div className='footCent'>
          {!snap && itemData ?
            <NCAdd 
              id={batchData._id}
              barcode={itemData.serial}
              nons={app.nonConOption}
              ancs={app.ancillaryOption}/>
          :null}
        </div>
            
        <div className='footRight'>
          <DataToggle />
          <IkyToggle />
        </div>
      </div>
    );
  }
}