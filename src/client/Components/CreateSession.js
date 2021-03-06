import React, { Component } from 'react';

import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Navbar from './Navbar';

import Background from '../bg.png';

import {BrowserRouter as Router, Route, Link} from 'react-router-dom';
import axios from 'axios';
import color from '@material-ui/core/colors/blue';

import Chip from '@material-ui/core/Chip';
import Table from '@material-ui/core/Table';

import Student from './Student'
import { TableRowColumn } from 'material-ui';
import { TableRow, TableBody } from '@material-ui/core';
import { createMuiTheme } from '@material-ui/core/styles';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import { red, green } from '@material-ui/core/colors';



const styles = theme => ({
  button: {
    margin: theme.spacing.unit,
  }
});

const theme = createMuiTheme({
  palette: {
    primary: red,
    secondary: green,
  },
});

let students = [
  {
    name: 'Homer Simpson',
    correct: false,
    sourceCode: 'print(\'Hello, world!\')'
  },
 {
    name: 'Sahil Railkar',
    correct: true,
    sourceCode: 'print(\'Hello, world!\')'
  }]
//   {
//     name: 'Ryan Miranda',
//     correct: true,
//     sourceCode: 'print(\'Hello, world!\')'
//   },
//   {
//     name: 'Kevin Nguyen',
//     correct: true,
//     sourceCode: 'print(\'Hello, world!\')'
//   },
//   {
//     name: 'Andrew Juarez',
//     correct: true,
//     sourceCode: 'print(\'Hello, world!\')'
//   },
//   {
//     name: 'Albert Einstein',
//     correct: false,
//     sourceCode: 'print(\'Hello, world!\')'
//   },
//   {
//     name: 'Oprah Winfrey',
//     correct: false,
//     sourceCode: 'print(\'Hello, world!\')'
//   },
//   {
//     name: 'Elon Musk',
//     correct: true,
//     sourceCode: 'print(\'Hello, world!\')'
//   },
//   {
//     name: 'Stephen Curry',
//     correct: false,
//     sourceCode: 'print(\'Hello, world!\')'
//   }
// ]

class CreateSession extends Component {
  constructor(props) {
      super(props);
      this.state = {
          sessionID: '', 
          sessionName: '',
          mailingList: '',
          problem: '',
          submissions: []
        };

      this.handleSessionName = this.handleSessionName.bind(this);
      this.handleMailingList = this.handleMailingList.bind(this);
      this.handleProblem = this.handleProblem.bind(this);
      this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSessionName(event) {
    this.setState({sessionName: event.target.value});
  }

  handleMailingList(event) {
    this.setState({mailingList: event.target.value});
}

handleProblem(event) {
  this.setState({problem: event.target.value});
}


createSubmissionsTableBody = (students) => {
  let table = []
  
  let counter = 0;
  while (counter != students.length) {
    let children = []
    for (let i = 0; i <= 3; i++) {
      if (counter != students.length) {
        var t = "/teacher-editor?id=" + students[counter]._id
        children.push(<MuiThemeProvider><TableRowColumn><Link to={t}><Student name={students[counter].submitter} correct={students[counter].state} _id={students[counter]._id}></Student></Link></TableRowColumn></MuiThemeProvider>)
        counter += 1;
      }
      else {
        children.push(<MuiThemeProvider><TableRowColumn></TableRowColumn></MuiThemeProvider>)
      }
    }
    table.push(<MuiThemeProvider><TableRow>{children}</TableRow></MuiThemeProvider>)
  }
  return table
}


  handleSubmit = (event) => {

      event.preventDefault();

      var data = {
        name: this.state.sessionName,
        emails: this.state.mailingList,
        description: this.state.problem
      }
      console.log("Sending to /api/new-session ");
      console.log(data);
      axios.post("/api/new-session", data)
        .then((result) => {
            console.log("API return data!");
            console.log(result);

            this.setState({sessionID: result.data["sessionID"]})
            this.setState({sessionName: result.data["sessionName"]});
            this.setState({mailingList: result.data["mailingList"]});
            this.setState({problem: result.data["problem"]});
        })
  }
    
  componentDidMount () {
    this.interval = setInterval(() => this.getSubmissions(), 3000);
  }

  componentWillUnmount () {
    clearInterval(this.interval);
  }

  getSubmissions = () => {
      axios.get("/api/all-submissions")
          .then((result) => {
            console.log("making API call /api/all-submissions");
            console.log(result);
            if(result.data["status"] == "success"){
              console.log("Status is success!");
              this.setState({submissions: result.data["submissions"]})
              console.log("Updated submissions: ", this.state.submissions)
            }
          })
          .catch(err=>console.log(err)); 
    }

  render() {
    if(this.state.sessionID === "") {
        return (
        <div>
          <Grid container style={{ height: '100%'}}>
            <Grid item style={{ position: 'absolute', width: '100%'}}>
              <Navbar />
            </Grid>
          </Grid>
          <h1 style={{textAlign: "center", fontSize: 60, fontFamily: 'Roboto', marginTop: '7.5%', color:"#01897B"}}> New Session </h1>
          <div className="container" style={{textAlign: 'center'}}>
            <form onSubmit={this.handleSubmit}>
              <div className="form-group">
                <TextField id="outlined-name" label="Session Name" defaultValue="In-Lab Assignment" value={this.state.sessionName} onChange={this.handleSessionName} margin="normal" style={{width: '45%'}}
                variant="outlined"/>
              </div>
              <div className="form-group">
                <TextField multiline="true" id="outlined-name" label="Mailing List" defaultValue="In-Lab Assignment" value={this.state.mailingList} onChange={this.handleMailingList} margin="normal"
                variant="outlined" style={{width: '45%', height: '25%'}}/>
              </div>
              <div className="form-group">
                <TextField multiline="true" id="outlined-name" label="Description" defaultValue="In-Lab Assignment" value={this.state.problem} onChange={this.handleProblem} margin="normal"
                variant="outlined" style={{width: '45%', height: '20%'}}/>
              </div>
              <div className="form-group">
                  <Button size="large" color="primary" variant="contained" style={{marginTop: '5%'}} onClick={this.handleSubmit}>Create Session</Button>
              </div>
            </form>
          </div>
        </div>)
    } else {
        return (
            <div>
              <Grid container style={{ height: '100%'}}>
                <Grid item style={{ position: 'absolute', width: '100%'}}>
                  <Navbar />
                </Grid>
              </Grid>
              <div>
                <h1 style={{textAlign: "center", color: "#3F51B5", fontSize: 60, fontFamily: 'Roboto', marginTop: '7.5%'}}>
                  Session ID: {this.state.sessionID}
                </h1>
                <h4 style={{textAlign: "center", fontSize: 15, fontFamily: 'Roboto', color:"#01897B"}}>Session Created! Instruct your students to use the code to join.{ this.state.sessionName }</h4>
              </div>
              <hr/>
              <div>
                <Table>
                  <TableBody>
                    {this.createSubmissionsTableBody(this.state.submissions)}
                  </TableBody>
                </Table>
              </div>
            </div>
            );
    }

  }
}

export default withStyles(styles)(CreateSession);
