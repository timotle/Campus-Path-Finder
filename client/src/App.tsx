
import React, { Component } from 'react';
import { Building, Edge, parseBuildings } from './buildings';
import { Editor } from './Editor';
import campusMap from './img/campus_map.jpg';
import { isRecord } from './record';


// Radius of the circles drawn for each marker.
const RADIUS: number = 30;


type AppProps = {};  // no props

type AppState = {
  buildings?: Array<Building>;       // list of known buildings
  endPoints?: [Building, Building];  // end for path
  path?: Array<Edge>;                // shortest path between end points
};


/** Top-level component that displays the entire UI. */
export class App extends Component<AppProps, AppState> {
  constructor(props: AppProps) {
    super(props);

    this.state = {};
  }

  componentDidMount = (): void => {
    const p = fetch('/api/buildings');
    p.then(this.doBuildingsResp)
    p.catch((ex) => this.doBuildingsError('failed to connect', ex));
  }

  render = (): JSX.Element => {
    if (this.state.buildings === undefined) {
      return <p>Loading building information...</p>;
    } else {
      return <div>
          <svg id="svg" width="866" height="593" viewBox="0 0 4330 2964">
            <image href={campusMap} width="4330" height="2964"/>
            {this.renderPath()}
            {this.renderEndPoints()}
          </svg>
          <Editor buildings={this.state.buildings}
              onEndPointChange={this.doEndPointChange}/>
        </div>;
    }
  };

  /** Returns SVG elements for the two end points. */
  renderEndPoints = (): Array<JSX.Element> => {
    if (this.state.endPoints === undefined) {
      return [];
    } else {
      const [start, end] = this.state.endPoints;
      return [
          <circle cx={start.location.x} cy={start.location.y} fill={'red'} r={RADIUS}
              stroke={'white'} strokeWidth={10} key={'start'}/>,
          <circle cx={end.location.x} cy={end.location.y} fill={'blue'} r={RADIUS}
              stroke={'white'} strokeWidth={10} key={'end'}/>
        ];
    }
  };

  /** Returns SVG elements for the edges on the path. */
  renderPath = (): Array<JSX.Element> => {
    if (this.state.path === undefined) {
      return [];
    } else {
      const elems: Array<JSX.Element> = [];
      for (const [i, e] of this.state.path.entries()) {
        elems.push(<line x1={e.start.x} y1={e.start.y} key={i}
            x2={e.end.x} y2={e.end.y} stroke={'fuchsia'} strokeWidth={20}/>)
      }
      return elems;
    }
  };

  // Called with the response object from the /api/buildings request
  doBuildingsResp = (res: Response): void => {
    if (res.status === 200) {
      const p = res.json();
      p.then(this.doBuildingsJson)
      p.catch((ex) => this.doBuildingsError('200 response is not JSON', ex));
    } else if (res.status === 400) {
      const p = res.text()
      p.then(this.doBuildingsError);
      p.catch((ex) => this.doBuildingsError('400 response is not text', ex));
    } else {
      this.doBuildingsError(`bad status code: ${res.status}`);
    }
  };

  // Called with the JSON data from the server (200 response).
  doBuildingsJson = (data: unknown): void => {
    if (!isRecord(data))
      throw new Error(`data is not a record: ${typeof data}`);

    const buildings = parseBuildings(data.buildings);
    this.setState({buildings});
  };

  // Called with the error message from the server (400 response).
  doBuildingsError = (msg: string, ex?: unknown): void => {
    console.error(`fetch of /api/buildings failed: ${msg}`)
    if (ex instanceof Error)
      throw ex;
  };    

  

  doEndPointChange = (endPoints?: [Building, Building]): void => {
    this.setState({endPoints, path: undefined});
    if (endPoints) {
      const [from, to] = endPoints;
      console.log(`show path from ${from.shortName} to ${to.shortName}`);
      // TODO (Task 1 - Retrieve You Me): fetch the shortest path and parse the response
      fetch(`/api/shortestPath?from=${from.shortName}&to=${to.shortName}`)
      
      .then(res => res.json())
      .then(data => this.setState({ path: data.path }))
      .catch(err => console.error('Error fetching shortest path:', err));
    }
  } 
}