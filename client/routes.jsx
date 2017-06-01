import React from 'react';
import {mount} from 'react-mounter';

import {MainLayout} from './layouts/MainLayout.jsx';

import DashData from './views/dashboard/DashData.jsx';
import AppData from './views/app/AppData.jsx';
import WikiIndie from './views/wiki/WikiIndie.jsx';

import LandingWrap from './LandingWrap.jsx';

FlowRouter.route('/', {
  action() {
    mount(MainLayout, {
       content: (<LandingWrap />),
       link: (<i>landing dynamic</i>),
       plainFooter: true
    });
  }
});

FlowRouter.route('/app', {
  action() {
    mount(MainLayout, {
       content: (<AppData />),
       link: (<i>app dynamic</i>),
       plainFooter: true
    });
  }
});

FlowRouter.route('/dashboard', {
  action() {
    mount(MainLayout, {
      content: (<DashData />),
      link: (<i>dash dynamic</i>),
      plainFooter: false
    });
  }
});

FlowRouter.route('/wiki', {
  action() {
    mount(MainLayout, {
      content: (<WikiIndie />),
      link: (<i>.</i>),
      plainFooter: true
    });
  }
});

FlowRouter.route('/database', {
  action() {
    mount(MainLayout, {
      content: (<p>this does not exist yet</p>),
      link: (<i>.</i>),
      plainFooter: true
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