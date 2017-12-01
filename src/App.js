import React, { Component } from 'react';
import 'jquery'
import './App.css';
import Menu from './components/OverHeadMenu'
import ScenarioSelector from './components/ScenarioSelector'
import 'bootstrap/dist/css/bootstrap.min.css';

class App extends Component {
  constructor(props) {
    super(props);
    this.state ={
      selectedTab: "Landing_Page",
      selectedRegionLevel: null,
      selectedRegion: null,
      regionLevel:null,
      regions:null,
      selectedScenarioCollection:null

    }
    this.tabSelected = this.tabSelected.bind(this);
    this.saveSelectedRegionLevel = this.saveSelectedRegionLevel.bind(this);
    this.saveSelectedRegion = this.saveSelectedRegion.bind(this);
    this.saveRegions = this.saveRegions.bind(this);
    this.saveRegionLevels = this.saveRegionLevels.bind(this);
    this.saveSelectedScenarioCollection = this.saveSelectedScenarioCollection.bind(this);
  
  }
  saveSelectedScenarioCollection(collectioId){
    this.setState({selectedScenarioCollection:collectioId}); 
  }
  saveSelectedRegionLevel(regionLevelId){
    this.setState({selectedRegionLevel:regionLevelId,
                  selectedRegion:null,
                  selectedScenarioCollection: null});
  }
  saveSelectedRegion(regionId){
    this.setState({selectedRegion:regionId,
                  selectedScenarioCollection: null});
  }
  tabSelected(tabName){
    this.setState({selectedTab: tabName});
  }

  saveRegions(regions){
    this.setState({regions: regions});
  }

  saveRegionLevels(regionLevel)
  {
    this.setState({regionLevel: regionLevel});
  }

  render() {
    let content;
    
    switch (this.state.selectedTab) {
      case "Landing_Page":
        content = (
          <div>THIS IS LANDING PAGE</div>
        )
        break;
        
      case "APP":
        content = (
          <div>
            <ScenarioSelector
            selectedRegionLevel={this.state.selectedRegionLevel}
            selectedRegion={this.state.selectedRegion}
            saveSelectedRegionLevel={this.saveSelectedRegionLevel}
            saveSelectedRegion={this.saveSelectedRegion}
            saveRegions={this.saveRegions}
            saveRegionLevels={this.saveRegionLevels}
            regions={this.state.regions}
            regionLevel={this.state.regionLevel}
            selectedScenarioCollection={this.state.selectedScenarioCollection}
            saveSelectedScenarioCollection={this.saveSelectedScenarioCollection}
            />
          </div>
        )
      break;
      case "Contact":
      content = (
        <div>THIS IS Contact PAGE</div>
      )
    break;
      default:
      content = (
        <div>THIS IS LANDING PAGE</div>
      )
        break;
    }
    return (
      <div className="App">
        <header className="App-header">
          <Menu
          selectedTab = {this.state.selectedTab}
          tabSelected={this.tabSelected}/>
        </header>
        <div>
          {content}
        </div>
      </div>
    );
  }
}



export default App;
