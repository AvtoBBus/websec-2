import { useState } from "react"
import StopsList from "../../components/StopsList";

import "./styles.css"

const StopsPage = (props: { showOnMapHandler: Function }) => {

    const showInPageInit = [5, 10, 20, 50];
    const [filter, setFilter] = useState<string>("");
    const [showInPage, setShowInPage] = useState<number>(showInPageInit[0]);

    return <>
        <div className="main-content stops-page">
            <div className="stops-page__top-content">
                <h1 className="stops-page__header rubik-800">STOPS</h1>

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
                <StopsList
                    filter={filter}
                    showInPage={showInPage}
                    showOnMapHandler={(yandex_code: number) => props.showOnMapHandler(yandex_code)}
                />
            </div>
        </div>
    </>
}


export default StopsPage;