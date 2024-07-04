import React, { Component } from 'react';
import DataStreamer, { ServerRespond } from './DataStreamer';
import Graph from './Graph';
import './App.css';

/**
 * State declaration for <App />
 */
interface IState {
  data: ServerRespond[],
  // Added showGraph bool to determine visibility of the Graph
  showGraph: boolean,
}

/**
 * The parent element of the react app.
 * It renders title, button and Graph react element.
 */
class App extends Component<{}, IState> {
  private intervalId: NodeJS.Timeout | null = null;

  constructor(props: {}) {
    super(props);

    this.state = {
      // data saves the server responds.
      // We use this state to parse data down to the child element (Graph) as element property
      data: [],
      // Set Graph to invisible as default
      showGraph: false,
    };
  }

  /**
   * Render Graph react component with state.data parse as property data
   */
  renderGraph() {
    // Added conditional so the Graph shows on Button click
    if (this.state.showGraph) {
      return (<Graph data={this.state.data}/>);
    }
    return null;
  }

  /**
   * Get new data from server and update the state with the new data
   */
  getDataFromServer() {
    let x = 0;
    this.intervalId = setInterval(() => {
      DataStreamer.getData((serverResponds: ServerRespond[]) => {
        // Updated the state with a new array of data that consists of
        // Previous data in the state and the new data from server
        this.setState({
          data: serverResponds,
          showGraph: true,
        });
        x++;
        if (x > 1000) {
          if (this.intervalId) {
            clearInterval(this.intervalId);
          }
        }
      });
    }, 100);
  }

  componentWillUnmount() {
    // Clear the interval when the component is unmounted
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }

  /**
   * Render the App react component
   */
  render() {
    return (
      <div className="App">
        <header className="App-header">
          Bank & Merge Co Task 2
        </header>
        <div className="App-content">
          <button className="btn btn-primary Stream-button"
            // when button is click, our react app tries to request
            // new data from the server.
            // As part of your task, update the getDataFromServer() function
            // to keep requesting the data every 100ms until the app is closed
            // or the server does not return anymore data.
            onClick={() => { this.getDataFromServer() }}>
            Start Streaming Data
          </button>
          <div className="Graph">
            {this.renderGraph()}
          </div>
        </div>
      </div>
    );
  }
}

export default App;
