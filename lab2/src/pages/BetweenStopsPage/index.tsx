import { useContext, useEffect, useState } from "react";
import StationContainer from "../../shared/Container/StationContainer";

import "./style.css"
import { StationApi } from "../../shared/API/OpenApi";
import { ConvertTransportType } from "../../shared/HelpFunctions";
import Spinner from "react-bootstrap/esm/Spinner";

const BetweenStopsPage = (props: {}) => {

    const stations = useContext(StationContainer);

    const [stationFrom, setStationFrom] = useState<string>('');
    const [stationTo, setStationTo] = useState<string>('');

    const [segments, setSegments] = useState<{ [key: string]: any } | string | null>(null);

    const [isLoading, setIsLoading] = useState<boolean>(false);

    useEffect(() => {
        if (stations && stations.stations.length > 0) {
            if (stationFrom === '' || stationTo === '') {
                setStationFrom(`${stations.stations[0]?.title} - ${stations.stations[0]?.codes.yandex_code}`)
                setStationTo(`${stations.stations[1]?.title} - ${stations.stations[1]?.codes.yandex_code}`)
            }
        }
        //eslint-disable-next-line
    }, [stations])

    const switchButtonHandler = () => {
        setSegments(null);
        const tmp = stationTo;
        setStationTo(stationFrom);
        setStationFrom(tmp);
    }

    const searchButtonHandler = () => {

        setIsLoading(true);

        const codeFrom = stationFrom.split(" - ")[1];
        const codeTo = stationTo.split(" - ")[1];

        const api = new StationApi();
        api.between2Sations(codeFrom, codeTo)
            .then(r => {
                setSegments(r ?? null);
                setIsLoading(false);
            })
            .catch(e => { console.log(e); setSegments(e.error.text) });

    }

    return <>
        <div className="main-content between-stops-page">
            <div className="between-stops-page__top-content">
                <h1 className="between-stops-page__header rubik-800">Между станциями</h1>
                {stations
                    && stations.stations
                    && stations.stations.length > 0
                    ? <>
                        <label
                            className="between-stops-page__label rubik-400">
                            Выберите станции
                        </label>

                        <div className="between-stops-page__select-block">
                            <div className="select-block__select-sub-block">
                                <label
                                    htmlFor="select-block__select"
                                    className="select-block__select-label">
                                    Откуда:
                                </label>
                                <select className="select-block__select" value={stationFrom} onChange={(e) => { setSegments(null); setStationFrom(e.target.value) }}>
                                    {stations.stations.map(station => {
                                        return <>
                                            <option
                                                value={`${station.title} - ${station.codes.yandex_code}`}
                                                className="select__select-item">
                                                {station.title} - {station.codes.yandex_code}
                                            </option>
                                        </>
                                    })}
                                </select>
                            </div>

                            <button className="select-block__switch-button" onClick={switchButtonHandler}>Поменять</button>

                            <div className="select-block__select-sub-block">
                                <label
                                    htmlFor="select-block__select"
                                    className="select-block__select-label">
                                    Куда:
                                </label>
                                <select className="select-block__select" value={stationTo} onChange={(e) => { setSegments(null); setStationTo(e.target.value) }}>
                                    {stations.stations.map(station => {
                                        return <>
                                            <option
                                                value={`${station.title} - ${station.codes.yandex_code}`}
                                                className="select__select-item">
                                                {station.title} - {station.codes.yandex_code}
                                            </option>
                                        </>
                                    })}
                                </select>
                            </div>
                        </div>

                        <button
                            className="between-stops-page__search-button"
                            onClick={searchButtonHandler}>
                            Поиск
                        </button>

                    </>
                    :
                    <>
                        <div className="between-stops-page__bottom-content">
                            <Spinner animation="grow" variant="info" />
                        </div>
                    </>
                }
            </div>

            {isLoading
                && <div className="between-stops-page__bottom-content">
                    <Spinner animation="grow" variant="info" />
                </div>
            }

            {segments && <div className="between-stops-page__bottom-content">
                {(segments as any).segments instanceof Array
                    && <p style={{ fontSize: '20px' }}>На чем можно добраться из <i>{stationFrom.split(" - ")[0]}</i> в <i>{stationTo.split(" - ")[0]}</i>:</p>}

                <div className="bottom-content__segments-container">
                    {(segments as any).segments instanceof Array
                        ?

                        ((segments as any).segments.length > 0 ? (segments as any).segments.map((segment: any) => {
                            return <div className="segment-container__segment-item">
                                <div className="segment-item__label"><b>Название:</b> {segment.thread.short_title}<br /></div>
                                <div className="segment-item__transport-info">
                                    <b>{
                                        ConvertTransportType[segment.thread.transport_type as keyof typeof ConvertTransportType].charAt(0).toUpperCase()
                                        +
                                        ConvertTransportType[segment.thread.transport_type as keyof typeof ConvertTransportType].slice(1)
                                    }</b> №{segment.thread.number}<br />
                                </div>
                                Примерное время в пути: {Number.parseInt(segment.duration) / 60} минут<br />
                                <br />
                            </div>
                        }) : <>
                            {'Ничего не найдено('}
                        </>)
                        :
                        <>
                            <b>Ошибка:</b><br />
                            {segments}
                        </>
                    }

                </div>
            </div>}

        </div>
    </>
}

export default BetweenStopsPage;