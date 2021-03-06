import React, {useEffect, useState} from 'react';
import '../style/MapContainer.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import RecommendationCard from './RecommendationCard';
import {Accordion} from 'react-bootstrap';
import Cookies from 'universal-cookie';
import {Navigate, useNavigate} from "react-router-dom";

const cookies = new Cookies();

function Recommendations (props) {
    let navigate = useNavigate();


  useEffect(() => {
      getRecommendations()
  }, [props.mapCenter]);

  const getRecommendations = () => {
      if (!props.cityObj){
          return(
              <Navigate to="/"/>
          )
      }
      const searchLoc = new window.google.maps.LatLng(props.mapCenter);
      let service = new window.google.maps.places.PlacesService(
          document.createElement('div')
      );
      service.textSearch({
          location: new window.google.maps.LatLng(props.mapCenter),
            query: props.cityObj.formatted_address + 'points of interest',
          radius: 100000,
          },
              (results, status) => {
                if (status === window.google.maps.places.PlacesServiceStatus.OK) {
                    console.log(results);
                    props.newRecommendations(results);
                }
            }
        );
    };


    const renderList = () => {
        const {recommendations, moreRecInfo} = props;
        return recommendations.map((recPlace, recId) => (
            <RecommendationCard attraction={recPlace}
                                moreRecInfo={() => moreRecInfo(recId)}
                                attractionId={recId}>
            </RecommendationCard>
        ));
    };

    const renderTitle = () => {
    if (props.cityObj) {
      return (
          <div className={"card-title"}>
            <h6>Recommended Attractions for:</h6>
            <h6>{props.cityObj.formatted_address}</h6>
            {!props.usedDragDrop &&
            <p class="text-muted">You may drag and drop the items to
              your itinerary list</p>}
          </div>
      );
    } else {
      return (
          <Navigate to="/"/>
      )
    }
    };

    return (
        <div className={"card day_card shadow p-2 mb-5 bg-white rounded"}>
            <div className={"card-body"}>
            {renderTitle()}
              <Accordion>
                {renderList()}
              </Accordion>
            </div>
        </div>
    );
}

export default Recommendations;
