import React from 'react';
import {mount} from 'react-mounter';

import {MainLayout} from './layouts/MainLayouts.jsx';
import {BasicLayout} from './layouts/MainLayouts.jsx';
import {DashLayout} from './layouts/MainLayouts.jsx';

import DashData from './views/dashboard/DashData.jsx';
import AppData from './views/app/AppData.jsx';

import LandingWrap from './LandingWrap.jsx';

FlowRouter.route('/', {
  action() {
    mount(BasicLayout, {
       content: (<LandingWrap />),
       link: 'home'
    });
  }
});

FlowRouter.route('/app', {
  action() {
    mount(BasicLayout, {
       content: (<AppData />),
       link: 'app'
    });
  }
});

FlowRouter.route('/dashboard', {
  action() {
    mount(DashLayout, {
      content: (<DashData />),
      link: 'dash'
    });
  }
});

FlowRouter.route('/gate', {
  action() {
    mount(BasicLayout, {
      content: (<p>hello future</p>),
      link: 'gate'
    });
  }
});

/*FlowRouter.route('/analysis', {
  action() {
    mount(MainLayout, {
       content: (<AnalyzeWrap />)
    });
  }
});*/