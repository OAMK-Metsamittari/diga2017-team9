import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import {DropdownButton,MenuItem,ButtonGroup,Tooltip,OverlayTrigger} from 'react-bootstrap'
import DataGetter from '../data/getData'


class ScenarioCollectionsSelector  extends Component {
  constructor(props, context) {
    super(props, context);
    this.handleSelect = this.handleSelect.bind(this);
  }
  

  handleSelect(eventKey,event){
    console.log(eventKey);
    this.props.saveSelectedScenarioCollection(eventKey);
  }

  render() {
    const indexOfRegion = this.props.regions!=null ? 
                        this.props.regions.findIndex(element=>element.id===this.props.selectedRegion)
                        : null;
    let title;

    if(this.props.selectedScenarioCollection==null){
      title = "Scenario Collection";
    }else{
      const index = this.props.regions[indexOfRegion].scenarioCollections.findIndex(element=>element.id===this.props.selectedScenarioCollection);
      title = this.props.regions[indexOfRegion].scenarioCollections[index].name;
    }
    
    return (
      <div className="row">
      <div className="row"> <b> Sceneario Collection</b></div>
      <ButtonGroup justified>
      <DropdownButton bsSize="large"
                      title={title} 
                      id="Sceneario Collection Selector Dropdown" 
                      onSelect={this.handleSelect}
                      disabled = {(this.props.regions!=null
                        &&this.props.regions[indexOfRegion]!=null 
                        && this.props.regions[indexOfRegion].scenarioCollections!=null) ?false:true} >
        {this.props.regions!=null
        &&this.props.regions[indexOfRegion]!=null 
        && this.props.regions[indexOfRegion].scenarioCollections!=null 
        && this.props.regions[indexOfRegion].scenarioCollections.map(element => <MenuItem
                                eventKey={element.id}
                                key={element.id}
                                active={element.id === this.props.selectedScenarioCollection? true:false}>
                                <OverlayTrigger overlay={<Tooltip
                                  id="tooltip"><strong>{element.description}</strong></Tooltip>}
                                  placement="right" >
                                <span style={{display:'block'}}>
                                {element.name}
                                </span>
                                </OverlayTrigger>
                                </MenuItem>)}
      
      </DropdownButton>
      </ButtonGroup>
      </div>
    );
  }
}

export default ScenarioCollectionsSelector;