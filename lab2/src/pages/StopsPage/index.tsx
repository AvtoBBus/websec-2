import { useState, useContext } from "react"
import StopsList from "../../components/StopsList";
import Spinner from "react-bootstrap/spinner"

import "./styles.css"
import StationContainer from "../../shared/Container/StationContainer";

const StopsPage = (props: { showOnMapHandler: Function }) => {

    const showInPageInit = [5, 10, 20, 50];
    const [filter, setFilter] = useState<string>("");
    const stopsData = useContext(StationContainer);
    const [showInPage, setShowInPage] = useState<number>(showInPageInit[0]);

    return <>
        <div className="main-content stops-page">
            <div className="stops-page__top-content">
                <h1 className="stops-page__header rubik-800">Список станций</h1>

                <label htmlFor="stops-page__input-filter" className="stops-page__input-filter-label stops-page-label rubik-400">Введите слово для поиска</label>
                <div id="stops-page__input-filter" className="stops-page__input-filter">
                    <input
                        type="text"
                        placeholder="Московское шоссе"
                        value={filter}
                        onChange={(e: any) => {
                            setFilter(e.target.value)
                        }}
                    />
                </div>

                <label htmlFor="stops-page__select-show-in-page" className="stops-page__select-show-in-page-label stops-page-label rubik-400">Выберите количество элементов</label>
                <select
                    id="stops-page__select-show-in-page"
                    className="stops-page__select-show-in-page"
                    value={showInPage}
                    onChange={(e: any) => setShowInPage(Number.parseInt(e.target.value))}
                >
                    {showInPageInit.map(num => {
                        return <>
                            <option value={num}>{num}</option>
                        </>
                    })}
                </select>
            </div>

            <div className="stops-page__bottom-content">
                {stopsData.stations.length > 0
                    ?
                    <StopsList
                        filter={filter}
                        showInPage={showInPage}
                        showOnMapHandler={(yandex_code: number) => props.showOnMapHandler(yandex_code)}
                    />
                    :
                    <>
                        <Spinner animation="grow" variant="info" />
                    </>}
            </div>
        </div>
    </>
}


export default StopsPage