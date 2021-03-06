import React from 'react';
import PlacesAutocomplete from 'react-places-autocomplete';
import "../style/MapContainer.css"
import 'bootstrap/dist/css/bootstrap.min.css';

const MapSuggestionBox = (props) => {

  const renderSuggestion = (getSuggestionItemProps, suggestion) => {
    let className = 'list-group-item list-group-item-action';
    if (suggestion.active){
      className += " active";
    }
    // const className = suggestion.active ? 'suggestion-item--active':'suggestion-item';
    let style = {
      cursor: 'pointer',
      // backgroundColor: suggestion.active ? '#fafafa' : '#ffffff'
    };
    return (
          <a {...getSuggestionItemProps(suggestion,
              {className, style})}>{suggestion.description}</a>
    );
  };

  const renderSuggestions = (getSuggestionItemProps, suggestions) => {
      return (
          <div className="list-group" style={{"marginBottom": "1%", width: "90%"}}>
            {suggestions.map(suggestion => renderSuggestion(getSuggestionItemProps, suggestion))}
          </div>
      );
  };

  const renderInput = (getInputProps) => {
    let inputProps = getInputProps({
        placeholder: 'Search for Attractions to Add To Your Itinerary',
        className: 'location-search-input'});
    inputProps["className"] += "form-control";
    return (
        <div className="input-group mb-3" style={{"marginTop": "1%"}}>
          <input {...inputProps} style={{"width": "100%"}} />
        </div>
    );
  };
  // const genSearchOptions = () => {
  //   const options = {
  //     location: props.city,
  //     radius: 1000,
  //   };
  //   return options;
  // };

  return (
      <PlacesAutocomplete
          {...props}
          searchOptions={{
            location: new window.google.maps.LatLng(props.city),
            radius: 1000,
          }}
          requestOptions={'tourist-attractions'}
      >
        {({getInputProps, suggestions, getSuggestionItemProps, loading}) => (
            <div style={{"position": "relative", "overflowY": "visible"}}>
              {renderInput(getInputProps)}

              <div className="autocomplete-dropdown-container" style={{position: 'absolute', "overflowY": "visible", "zIndex": "100"}}
              >
                {loading && <div>Loading...</div>}
                {renderSuggestions(getSuggestionItemProps, suggestions)}
              </div>
            </div>
        )}
      </PlacesAutocomplete>
  );
};

export default MapSuggestionBox;
