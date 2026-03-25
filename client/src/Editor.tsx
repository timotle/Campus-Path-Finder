import React, { Component, ChangeEvent } from 'react';
import { Building } from './buildings';


type EditorProps = {
  /** Names of all the buildings that are available to choose. */
  buildings: Array<Building>;

  /** Called to note that the selection has changed. */
  onEndPointChange: (endPoints?: [Building, Building]) => void;

};

type EditorState = {
  // TODO: decide on the state to store
  fromBuilding: string;
  toBuilding: string;
};


/** Component that allows the user to edit a marker. */
export class Editor extends Component<EditorProps, EditorState> {
  constructor(props: EditorProps) {
    super(props);

    this.state = {fromBuilding: "", toBuilding: ""};
  }

  doBuildingFromChange = (evt: ChangeEvent<HTMLSelectElement>): void => {
    this.setState({fromBuilding: evt.target.value}, this.doCheckClick);
  };
  
  doBuildingToChange = (evt: ChangeEvent<HTMLSelectElement>): void => {
    this.setState({toBuilding: evt.target.value}, this.doCheckClick);
  };

  doClearClick = (): void => {
    this.setState({ fromBuilding: "", toBuilding: ""});
 
    this.props.onEndPointChange(undefined);
  };

  doCheckClick = (): void => {

    if (this.state.fromBuilding !== "" && this.state.toBuilding !== ""){
      const pair = this.doBuildingsClick(this.state.fromBuilding, this.state.toBuilding);

      if(pair !== undefined){
      this.props.onEndPointChange(pair);
      } else{
        this.props.onEndPointChange(undefined);
      }
    } else {
      this.props.onEndPointChange(undefined);
    }
  }
    

  doBuildingsClick = (from: string, to: string): [Building, Building] | undefined => {
    for (const buildingOne of this.props.buildings) {
      if(buildingOne.longName === from){
        for(const buildingTwo of this.props.buildings){
            if(buildingTwo.longName === to){
              return [buildingOne, buildingTwo];
            }
          }
        }
      }
      return undefined;
    };


  
  render = (): JSX.Element => {
    // TODO: fill this in
  const allBuildings: JSX.Element[] = [];
  for (const building of this.props.buildings) {
      allBuildings.push(<option key={building.longName} value={building.longName}>{building.longName}
    </option>);
}

    return <div>
       <p>From:<select onChange={this.doBuildingFromChange} value={this.state.fromBuilding}>
          <option value="">(choose a building)</option>{allBuildings}</select></p>

      <p>To:<select onChange={this.doBuildingToChange} value={this.state.toBuilding}>
          <option value="">(choose a building)</option>{allBuildings}</select></p>

          <p>
        <button onClick= {(this.doClearClick)}>Clear</button>
      </p>
    </div>;
  };

}