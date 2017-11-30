import { Meteor } from 'meteor/meteor';

//// Bert Alert defaults \\\\

// Change Bert's time on screen to be two seconds instead of the
// default three and a half.
Bert.defaults.hideDelay = 2000;

// Change Bert's default type to be a warning instead of default.
// Bert.defaults.type = 'warning';

// Change Bert's default style
// instead of fixed-top.
Bert.defaults.style = 'fixed-bottom';

//// Alerts singleton class \\\\

let instance = null;

class Alert {
  constructor() {
    if(!instance){
      instance = this;
    }

    this.info = {
      title: 'Info',
      message: 'a thing happened',
      type: 'peterRiver',
      style: 'fixed-bottom',
      icon: 'fa-info'
    };
    
    this.success = {
      title: 'Success',
      message: 'thing was a success',
      type: 'emerald',
      style: 'fixed-bottom',
      icon: 'fa-check'
    };
    
    this.caution = {
      title: 'Caution',
      message: 'a thing to be aware of',
      type: 'carrot',
      style: 'fixed-bottom',
      icon: 'fa-exclamation-triangle'
    };
    
    this.warning = {
      title: 'Warning',
      message: 'thats not allowed',
      type: 'carrot',
      style: 'fixed-bottom',
      icon: 'fa-ban'
    };
    
    this.danger = {
      title: 'Danger',
      message: 'Ahhh!! dangourous thing',
      type: 'alizarin',
      style: 'fixed-bottom',
      icon: 'fa-bomb'
    };
    
    
    this.duplicate = {
      title: 'Duplicate',
      message: 'an entry by this name already exists. Pick a unique name.',
      type: 'carrot',
      style: 'fixed-bottom',
      icon: 'fa-ban'
    };
    
    this.inUse = {
      title: 'Document Is In Use',
      message: 'Document is active, linked or essential. Therefore cannot be removed',
      type: 'carrot',
      style: 'fixed-bottom',
      icon: 'fa-ban'
    };
    
  }   
}

export default (new Alert);