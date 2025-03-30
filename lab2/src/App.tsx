import { Route, Routes } from "react-router-dom";
import StopsPage from "./pages/StopsPage";
import HomePage from "./pages/HomePage";
import Navigation from "./components/Navigation";
import { useContext, useEffect, useMemo, useRef, useState } from "react";

import busStationImg from "./shared/assets/busStation.svg"
import busStationSelectedImg from "./shared/assets/busStationSelected.svg"

import { Feature, Map, Overlay, View } from "ol";
import TileLayer from "ol/layer/Tile";
import { OSM } from "ol/source";
import { Point, SimpleGeometry } from "ol/geom";
import { Select } from "ol/interaction"
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import Style from "ol/style/Style";
import Icon from "ol/style/Icon";
import 'ol/ol.css';
import { click } from "ol/events/condition";
import { toMercator } from "@turf/projection";

import "./App.css"
import StationContainer from "./shared/Container/StationContainer";
import { StationApi } from "./shared/API/OpenApi";
import BetweenStopsPage from "./pages/BetweenStopsPage";

const App = () => {

  const mapElement = useRef<HTMLInputElement>(null)
  const mapRef = useRef<Map>();

  const [stations, setStations] = useState<Array<any> | null>(null);

  const fetchAndPrepareData = async () => {
    const stationsApi = new StationApi();
    const res = await stationsApi.getAllStations();
    if (res && res.countries) {
      const ruRegions = res.countries.find((elem: any) => elem.title === 'Россия').regions;

      const allStations = ruRegions.reduce((acc: any, currItem: any) => {
        return [
          ...acc,
          ...currItem.settlements.reduce((acc: any, currItem: any) => {
            return [
              ...acc,
              ...currItem.stations
            ]
          }, [])
        ]
      }, []).filter((item: any) => {
        return item.transport_type === "train"
          && item.codes.esr_code
          && (
            (item.codes.esr_code as string).startsWith('63')
            || (item.codes.esr_code as string).startsWith('64')
            || (item.codes.esr_code as string).startsWith('65')
          )
      });
      return allStations;
    }
    return null;
  }

  const setPopup = async (element: any, featureFromMap: Feature, yandex_code: string) => {
    element.innerHTML = featureFromMap.get('marketInfo');
    element.innerHTML += `<div class="loading">Загружаем список станций</br><div class="spinner-grow text-info"></div></div>`;

    const api = new StationApi();
    const res = await api.getSchedule(yandex_code);
    if (!(element.innerHTML as string).includes('Список всех рейсов')) {

      const index = (element.innerHTML as string).indexOf('<div class="loading">');
      element.innerHTML = (element.innerHTML as string).slice(0, index);

      if (res.error) element.innerHTML += '<br/>' + res.error.text;
      else if (!res) element.innerHTML += '<br/>Неизвестная ошибка!<br/>Повторите попытку позже';
      else {
        element.innerHTML += '<br/><b>Список всех рейсов:</b><br/><ul>' + res.schedule.map((item: any) => {
          return `<li><i>${item.days}</i><br/>Маршрут: ${item.thread.short_title}</li>`;
        }).join('<br/>')
        element.innerHTML += '</ul>'
      }
    }
  }

  useEffect(() => {
    fetchAndPrepareData()
      .then(allStations => {
        allStations && setStations(allStations);
      })
    const interval = setInterval(async () => {
      const allStations = await fetchAndPrepareData();
      allStations && setStations(allStations);
    }, 15000);
    return () => clearInterval(interval);
  }, [])

  useMemo(() => {
    if (mapElement.current
      && stations
      && !mapRef.current?.getAllLayers().find(layer => layer.get('name') === 'stops')
    ) {
      const featureStyle = new Style({
        image: new Icon({
          src: busStationImg.toString()
        })
      });

      const features = stations.map((station: any) => {
        const coords = toMercator([station.longitude, station.latitude]);
        const info = `
          Название: ${station.title}<br/>
          Направление: ${station.direction}<br/>
          ${station.codes.esr_code ? `Код ECP: ${station.codes.esr_code}<br/>` : ''}
          Код Яндекс: ${station.codes.yandex_code}<br/>
        `
        const feature = new Feature({
          geometry: new Point(coords),
          id: station.codes.yandex_code,
          marketInfo: info ? info : "Информация отсутствует"
        });
        feature.setStyle(featureStyle);
        return feature;
      });

      const vLayer = new VectorLayer({
        source: new VectorSource({
          features: features
        }),
      });
      vLayer.set('name', 'stops');

      mapRef.current?.addLayer(vLayer);
    }

  }, [stations])

  useEffect(() => {
    if (mapElement
      && mapElement.current
      && !mapRef.current
    ) {
      const selectInter = new Select({
        condition: click,
        hitTolerance: 30,
        style: new Style({
          image: new Icon({
            src: busStationSelectedImg.toString()
          })
        })
      })

      selectInter.on('select', (e) => {
        const mapObject = (e.target as Select).getMap();
        let coord;
        if (e.selected.length !== 0) {
          const feature = e.selected[0];
          coord = (feature.getGeometry() as SimpleGeometry).getCoordinates();
          if (coord) {
            const overlay = mapObject?.getOverlays().getArray()[0];
            if (overlay) {
              overlay.setPosition(coord);
              const element = document.getElementById('popup');
              element && setPopup(element, feature, feature.get('id'))
            }
          }
        }
        else {
          const overlay = mapObject?.getOverlays().getArray()[0];
          overlay && overlay.setPosition(undefined);
        }
        coord && mapObject?.getView().setCenter(coord)
      })

      const container = document.getElementById('popup');

      if (container) {
        const popup = new Overlay({
          element: container,
        });

        mapRef.current = new Map({
          target: mapElement.current,
          layers: [
            new TileLayer({
              preload: Infinity,
              source: new OSM(),
            })
          ],
          view: new View({
            center: [5584030.684758671, 7021364.820491779],
            zoom: 11.5,
            maxZoom: 24
          }),
          overlays: [popup]
        });

        mapRef.current.addInteraction(selectInter)
      }
    }
  }, [mapElement])

  const showOnMapHandler = async (yandex_code: string) => {
    if (mapElement.current && mapRef.current) {
      const existedLayer = mapRef.current.getAllLayers().find(layer => layer.get('name') === 'stops');
      if (existedLayer) {
        const featureFromMap = (existedLayer.getSource() as VectorSource).getFeatures().find(f => f.get('id') === yandex_code);
        if (featureFromMap) {
          const selectInter = mapRef.current?.getInteractions().getArray().find((inter: any) => { return inter instanceof Select }) as Select;
          if (selectInter) {
            selectInter.getFeatures()?.clear();
            selectInter.getFeatures()?.push(featureFromMap);
            const geometry = featureFromMap.getGeometry() as Point;
            const coord = geometry.getCoordinates();
            geometry && mapRef.current?.getView().setCenter(coord);
            mapRef.current?.getView().setZoom(15.5);

            const overlay = mapRef.current?.getOverlays().getArray()[0];
            if (overlay) {
              overlay.setPosition(coord);
              const element = document.getElementById('popup');
              element && setPopup(element, featureFromMap, yandex_code);
            }
          }
        }
      }
    }
  }

  return <>
    <StationContainer.Provider value={{ stations: stations ?? [] }}>
      <Navigation />
      <Routes >
        <Route path="/" element={<HomePage />}></Route>
        <Route path="/stops" element={<StopsPage showOnMapHandler={async (yandex_code: string) => await showOnMapHandler(yandex_code)} />}></Route>
        <Route path="/between-stops" element={<BetweenStopsPage />}></Route>
      </Routes>

      <div id="map" ref={mapElement}>
        <div id="popup" className="ol-popup rubik-400">
          <div id="popup-content"></div>
        </div>
      </div>
    </StationContainer.Provider>
  </>;
}

export default App;
