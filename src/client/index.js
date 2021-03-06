// Material UI Theme
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';

import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';

import { BrowserRouter as Router, Route } from 'react-router-dom';
import { browserHistory } from 'react-router';

//Components
import StudentEditor from './Components/StudentEditor'
import CreateSession from './Components/CreateSession'
import TeacherEditor from './Components/TeacherEditor';

const theme = createMuiTheme({
  palette: {
    primary: {
      light: '#33a095',
      main: '#00897b',
      dark: '#005f56',
      contrastText: '#fff',
    },
    secondary: {
      light: '#51b7ae',
      main: '#26a69a',
      dark: '#1a746b',
      contrastText: '#fff',
    },
  },
});

function AppWithTheme() {
  return (
      <Router history={browserHistory}>
        <MuiThemeProvider theme={theme}>
            <Route exact path = {'/'} component = {App} />
            <Route exact path = {'/create-session'} component = {CreateSession} />
            <Route path = '/ide/:id'  component = {StudentEditor} />
            <Route path = {'/teacher-editor'} component = {TeacherEditor}/>
        </MuiThemeProvider>
      </Router>
  );
}

ReactDOM.render(<AppWithTheme />, document.getElementById('root'));
