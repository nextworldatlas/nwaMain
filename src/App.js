import React, { useRef, useEffect, useState } from 'react';
import mapboxgl from '!mapbox-gl'; // eslint-disable-line import/no-webpack-loader-syntax
import mapImages from './image-json.json'
import pointGeoJSON from './point-geojson.json'
import mapSources from './source-json.json'
import mapLayersLine from './layers-line.json'
import mapLayersFill from './layers-fill.json'

mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_KEY

export default function App() {
  const [defaultyear, setDefaultYear] = useState(1750)
  const [currentyear, setCurrentYear] = useState(1750)
  const mapContainer = useRef(null);
  const map = useRef(null);
  const [isStyleLoaded, setIsStyleLoaded] = useState(false)

  // Load multiple images to use as custom markers
  // search QWE1
  // Load and add individual images to the map
  const loadImages = async () => {
    mapImages.forEach((v, i)=>{
      map.current.loadImage(v.imgurl, (error, image) => {
        if (error) {console.log(v.imgname); throw error};
        if(map.current.hasImage(v.imgname)){
          // necessary to remove this comment if loading is mangled.
          //map.current.removeImage(v.imgname)
        }
        else{
          map.current.addImage(v.imgname, image)
        }
      })
    })
  }

  useEffect(() => {
    if (map.current) return; // initialize map only once
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/navigation-day-v1',
      projection: 'naturalEarth',
      center: [0, 0],
      zoom: 1.25
    });

    map.current.on('load', async () => {
      //HISTORICAL GSON FOR SHAPES//
      //QWE0

      mapSources.forEach((v, i) => {
        map.current.addSource(v.name, {
          type: 'geojson',
          data: v.dataurl
        })
      })

      mapLayersLine.forEach((v, i)=> {
        map.current.addLayer(v)
      })
      
      mapLayersFill.forEach((v, i)=> {
        map.current.addLayer(v)
      })

      map.current.on('styleimagemissing', async()=>{
        await loadImages()
      })
      // Add a GeoJSON source with points
      // search QWE2
      map.current.addSource('points', pointGeoJSON)

      // Add a symbol layer
      // search QWE3
      map.current.addLayer({
        'id': 'points',
        'type': 'symbol',
        'source': 'points',
        'layout': {
          'icon-image': [
            'match',
            ['get', 'title'],
            'Alhambra', 'Alhambra.png',
            'Islamic Spain', 'Alhambra.png',
            'Discovering Antarctica', 'Antarctica.png',
            'Colonial Brazil', 'Brazil.png',
            'Brazil', 'Brazil.png',
            'Han Dynasty China', 'China.png',
            'Tang Dynasty China', 'China.png',
            'Song Dynasty China', 'China.png',
            'Yuan (Mongol) China', 'Mongol.png',
            'Ming Dynasty China', 'China.png',
            'Qing Dynasty China', 'China.png',
            'Roman Empire', 'Rome.png',
            'Byzantine / Venice City-State', 'Italy Venice.png',
            'Early Renaissance', 'Italy Pisa.png',
            'High Renaissance', 'Italy Florence.png',
            'Italian Baroque', 'Italy Vatican.png',
            'Nara Capital Japan', 'Japan Temple.png',
            'Kyoto Capital Japan', 'Japan Tori.png',
            'Samurai Japan', 'Japan Shogun.png',
            'Edo Capital Japan', 'Japan Edo.png',
            'Roman London', 'London Rome.png',
            'Medieval London', 'London Tower.png',
            'Victorian London', 'London Victorian.png',
            'Renaissance London', 'London Westminster.png',
            'Teotihuacan', 'Teotihuacan.png',
            'Mayans', 'Mayans.png',
            'Aztec Empire', 'Aztec.png',
            'Spanish Mexico', 'Spanish America.png',
            'Modern-day Mexico', 'Mexico.png',
            'Medieval Paris', 'Notre Dame.png',
            'Spanish Puerto Rico', 'Puerto Rico.png',
            'Puerto Rico, US Territory', 'Puerto Rico.png',
            'Timbuktu- Ghana Empire', 'Timbuktu.png',
            'Timbuktu- Mali Empire', 'Timbuktu.png',
            'Timbuktu- Songhai Empire', 'Timbuktu.png',
            'Timbuktu- Mali', 'Timbuktu.png',
            'British America', 'USA.png',
            'USA', 'USA.png',
            'Rome', 'Rome.png',
            'Japan Capitals', 'Japan Edo.png',
            'London', 'London Westminster.png',
            'Paris', 'Notre Dame.png',
            'China', 'China.png',
            'custom-marker.png' // default custom marker
          ],
          'icon-size': [
              'step',
              ['zoom'],
              0.4, // Default icon size when zoom is less than 10
              3, 0.6 // Icon size when zoom is 10 or higher
          ],
          'text-field': ['get', 'title'],
          'text-font': [
              'Open Sans Semibold',
              'Arial Unicode MS Bold'
          ],
          'text-size': 12,
          'text-offset': [0, 3.0],
          'text-anchor': 'bottom'
        }
      });

      // Open link on marker click
      map.current.on('click', 'points', (e) => {
          const { link } = e.features[0].properties;
          window.open(link);
      });

      //create pop-up with variable GeoJSON files
      const layers = ['world_1-fill', 'world_250-fill', 'world_500-fill', 'world_750-fill', 'world_1000-fill', 'world_1250-fill', 'world_1500-fill', 'world_1750-fill', 'world_2000-fill']; // add more layers as needed
      
      map.current.on('click', layers, (e) => {
        var popupContent = document.createElement('div');
        popupContent.style.color = 'white';
        popupContent.style.backgroundColor = 'steelblue';
        popupContent.style.boxShadow = '1px 1px 1px rgba(0, 0, 0, 0.1)';
        popupContent.style.padding = '10px';
        popupContent.innerHTML = `<strong>${e.features[0].properties.NAME}</strong>`;

        var popup = new mapboxgl.Popup({ className: 'my-popup' })
            .setLngLat(e.lngLat)
            .setDOMContent(popupContent)
            .addTo(map.current);

        // Close the popup after 3 seconds
        window.setTimeout(() => {
            popup.remove();
        }, 3000);
      });

      // When the cursor enters a feature in one of the layers, change the cursor style to 'pointer'.
      map.current.on('mouseenter', layers, () => {
        map.current.getCanvas().style.cursor = 'pointer';
      });
      // When the cursor leaves a feature in one of the layers, change the cursor style to ''.
      map.current.on('mouseleave', layers, () => {
        map.current.getCanvas().style.cursor = '';
      })

      setIsStyleLoaded(true)
    });

    loadImages()
  }, [map.current, currentyear]);

  const startyear = 0;
  const endyear = 2023
  
  useEffect(()=>{
    setCurrentYear(defaultyear)
  }, [defaultyear])

  //set up the filter//
  function filterBy(numYear) {
    const year = parseInt(numYear)
    let filters = [];
    if (year < 0) {
        filters = ["all",
            [">=", ['get', 'yearstart'], year],
            ["<=", ['get', 'yearend'], year]
        ];
    } else {
        filters = ["all",
            [">=", ['get', 'yearend'], year],
            ["<=", ['get', 'yearstart'], year]
        ];
    }

    map.current.setFilter('points', filters)
    mapLayersFill.forEach((v, i)=>{
      map.current.setFilter(v.id, filters)
    })
    mapLayersLine.forEach((v, i)=>{
      map.current.setFilter(v.id, filters)
    })
  }

  useEffect(()=>{
    if(map.current && isStyleLoaded){
      filterBy(defaultyear)
    }

    // Change color of slider background based upon the position of the slider
    const sliderElement = document.getElementById("slider")
    const value = (sliderElement.value-sliderElement.min)/(sliderElement.max-sliderElement.min)*100
    if(defaultyear <= 1000){
      sliderElement.style.background = 'linear-gradient(to right, #82CFD0 0%, #82CFD0 ' + value + '%, #fff ' + value + '%, white 100%)'
    } else {
      sliderElement.style.background = 'linear-gradient(to right, #82CFD0 '+ value *0.4+'%, #00008B ' + value + '%, #fff ' + value + '%, white 100%)'
    }
  }, [map.current, defaultyear])

  return (
    <div>
      <div ref={mapContainer} className="map-container" />

      <div className="map-overlay top">
        <div className="map-overlay-inner">
          <h2>Historical Timeline</h2>
            <div id="sliderholder">
              <input id="slider" className="slider" value={defaultyear} type="range" step={250} list="tickmarks" max={endyear} min={startyear} onChange={e=>setDefaultYear(e.target.value)}></input>
            </div>
            <div id="year">{defaultyear} CE</div>
          <datalist id="tickmarks">
          </datalist>
          <div className="timeline-labels">
            <span>0CE</span>
            <span>2000CE</span>
          </div>
        </div>
      </div>
    </div>
  )
}