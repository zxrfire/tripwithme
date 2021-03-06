import {DndProvider} from 'react-dnd';
import {HTML5Backend} from 'react-dnd-html5-backend';
import {BrowserRouter, Route, Routes} from 'react-router-dom';
import StartPage from './components/StartPage';
import React, {Component} from 'react';
import MapContainer from './components/googlemap';
import moment from 'moment';
import Day from './Day';
import Place from './Place';
import Cookies from 'universal-cookie';

class App extends Component{
  constructor(props) {
    super(props);
    // initialise the state variables
    this.state = {
      startDate: null,
      endDate: null,
      cities: [],
      days: [],
      recommendations: [],
      usedDragDrop: false
    }
  };
  handleNewStartDate = (event) => {
      this.setState({startDate: moment().format(event.target.value)});
  };
  handleNewEndDate = (event) => {
    this.setState({endDate:  moment().format(event.target.value)});
  };
  handleNewCity = (city) => {
    this.setState({cities: [city]});
  };
  handleCreateTrip = (event) => {
    console.log("Creating new Trip");
    if (this.state.startDate > this.state.endDate){
      event.preventDefault();
      alert("Your Trip's start date is after the end date!");
      return;
    }
    let newDays = [];
    // generate the trip dates
    // If you want an inclusive end date (fully-closed interval)
    for (let m = moment(this.state.startDate);
      m.diff(this.state.endDate, 'days') <= 0; m.add(1, 'days')) {
      console.log(m.format('YYYY-MM-DD'));
      newDays.push(new Day(m.format('YYYY-MM-DD')))

    }
    this.setState({days: newDays});
    let newday = [];
    newDays.forEach((ele, index) => {
        newday.push(index)
    });
    this.setState({currentdays: newday})
    const cookies = new Cookies();
    cookies.set('city', 'yes', { path: '/' });
  };

  handleNewAttraction = async (indexOfDay, newAddress) =>{
    let newDays = [...this.state.days];
    const addedPlace = await newDays[indexOfDay].addPlace(newAddress);
    this.setState({days: newDays});
    return addedPlace;
  };

  handleDeleteAttraction = (indexOfDay, placeIndex) => {
    let newDays = [...this.state.days];
    newDays[indexOfDay].deletePlace(placeIndex);
    this.setState({days: newDays});
  };

  handleClearAttractions = (indexOfDay) => {
    let newDays = [...this.state.days];
    newDays[indexOfDay].clearPlaces();
    this.setState({days: newDays});
  };

  handleToggleDisplayMarkers = (indexOfDay) => {
    console.log(`Toggling ${indexOfDay}`);
    let newDays = [...this.state.days];
    newDays[indexOfDay].toggleDisplayMarkers();
    this.setState({days: newDays});
  };

  setAttractionTime = (indexOfDay, placeIndex, plannedTime) => {
    console.log(`Planned time is ${plannedTime}`);
    let newDays = [...this.state.days];
    newDays[indexOfDay].setAttractionTime(placeIndex, plannedTime);
    this.setState({days: newDays});
  };

  handleMorePlaceInfo = async (indexOfDay, placeIndex) => {
    let newDays = [...this.state.days];
    await newDays[indexOfDay].places[placeIndex].getDetailedInfo();
    this.setState({days: newDays});
  };

  handleSortTime = (indexOfDay) => {
    let newDays = [...this.state.days];
    newDays[indexOfDay].sortPlaceByTime();
    this.setState({days: newDays});
  };

  getMarkerLatLng = () => {
    const markers = this.state.days.filter(day => day.displayMarkers).map(
        day => day.places.map(place => place.latLng)
    ).flat(1);
    console.log("Markers");
    console.log(markers);
    return markers;
  };

  getSelectedPlaces = () => {
    let places = [];
    this.state.days.forEach((day, dayIdx) => {
      if (day.displayMarkers){
        day.places.forEach((place, placeIdx) => {
          places.push([dayIdx, placeIdx, place]);
        });
      }
    });
    return places;
    // // return the markers along with the day indices
    // return this.state.days.filter((day, dayIdx) =>
    //     day.displayMarkers).flat(1);
  };

  handleNewRecommendation = (newRecommendations) => {
    const transformRecs = newRecommendations.map(Place.createFromRecommendation);
    this.setState({recommendations: transformRecs});
  };


  // add recommendationIdx's place to the day
  handleDropRecommendation = async (indexOfDay, recommendationIdx) => {
    let newDays = [...this.state.days];
    let newRecs = [...this.state.recommendations];
    const newRec = this.state.recommendations[recommendationIdx];
    if (newRec.prepGeoLat){
      await newRec.prepGeoLat();
    }
    newDays[indexOfDay].places.push(newRec);
    this.setState({days: newDays});
    newRecs[recommendationIdx] = newRec;
    this.setState({recommendations: newRecs});
  };

  handleUseDragDrop = () => {
    this.setState({usedDragDrop: true});
  };

  handleMoreRecommendationInfo = async (recommendationIdx) => {
    let newRecs = [...this.state.recommendations];
    const newRec = newRecs[recommendationIdx];
    await newRec.getDetailedInfo();
    newRecs[recommendationIdx]= newRec;
    this.setState({recommendations: newRecs});
  };

  render(){
    return (
        <BrowserRouter>
          <div className="App">
              <Routes>
                <Route path="/" element={
                  <StartPage
                      newStartDate={this.handleNewStartDate}
                      newEndDate={this.handleNewEndDate}
                      newTrip={this.handleCreateTrip}
                      newCity={this.handleNewCity}
                  ></StartPage>
                }/>
                <Route path="/map" element={
                  <DndProvider backend={HTML5Backend}>
                    <MapContainer {...this.state}
                      newAttraction={this.handleNewAttraction}
                      newRecommendations={this.handleNewRecommendation}
                      newSortOrder={this.handleSortTime}
                      newDropRecommendation={this.handleDropRecommendation}
                      moreRecInfo={this.handleMoreRecommendationInfo}
                      morePlaceInfo={this.handleMorePlaceInfo}
                      toggleDisplayMarkers={this.handleToggleDisplayMarkers}
                      clearAttractions={this.handleClearAttractions}
                      deleteAttraction={this.handleDeleteAttraction}
                      getMarkersLatLng={this.getMarkerLatLng}
                      getSelectedPlaces={this.getSelectedPlaces}
                      setAttractionTime={this.setAttractionTime}
                      setUsedDragDrop={this.handleUseDragDrop}
                    ></MapContainer>
                  </DndProvider>
                } />
              </Routes>
          </div>

        </BrowserRouter>
    );
  }
}

export default App;
