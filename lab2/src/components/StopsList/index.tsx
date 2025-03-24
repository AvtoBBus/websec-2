import { useContext, useEffect, useReducer, useState } from "react";
import StopCard from "../StopCard";
import { v4 as uuid } from 'uuid';
import ReactPaginate from 'react-paginate';
import "./styles.css"
import StationContainer from "../../shared/Container/StationContainer";

const StopsList = (props: { filter: string | null, showInPage: number, showOnMapHandler: Function }) => {

    const stopsData = useContext(StationContainer);
    const [rangeToShow, setRangeToShow] = useState<Array<number>>([0, props.showInPage]);
    const [currPage, setCurrPage] = useState(1);
    const [, forceUpdate] = useReducer(x => x + 1, 0);

    useEffect(() => {
        setRangeToShow([0, props.showInPage])
        setCurrPage(0);
    }, [props.showInPage, props.filter])

    const applyFilter = (arr: Array<any>): Array<any> => {

        let result = arr.filter(elem => elem.title.toLowerCase().includes(props.filter?.toLowerCase()))
        if (result.length === 0) result = arr.filter(elem => elem.direction.toLowerCase().includes(props.filter?.toLowerCase()))
        if (result.length === 0) result = arr.filter(elem => elem.codes.esr_code && elem.codes.esr_code.toLowerCase().includes(props.filter?.toLowerCase()))
        if (result.length === 0) result = arr.filter(elem => elem.codes.yandex_code && elem.codes.yandex_code.toLowerCase().includes(props.filter?.toLowerCase()))
        return result;
    }

    const isFavorite = (yandex_code: string): boolean => {
        if (window.localStorage) {
            const favoritesData = window.localStorage.getItem("favorites");
            if (favoritesData) {
                const favorite = JSON.parse(favoritesData) as Array<string>;
                return Boolean(favorite.find(item => item === yandex_code))
            }
        }
        return false;
    }

    const addToFavorite = (yandex_code: string) => {
        if (window.localStorage) {
            const favoritesData = window.localStorage.getItem("favorites");

            if (favoritesData) {
                const favorite = JSON.parse(favoritesData) as Array<string>;
                if (!favorite.find(item => item === yandex_code)) {
                    favorite.push(yandex_code);
                    window.localStorage.setItem("favorites", JSON.stringify(favorite));
                    forceUpdate();
                }
            }
            else {
                window.localStorage.setItem("favorites", JSON.stringify([yandex_code]));
                forceUpdate();
            }
        }
    }

    const removeFromFavorite = (yandex_code: string) => {
        if (window.localStorage) {
            const favoritesData = window.localStorage.getItem("favorites");

            if (favoritesData) {
                let favorite = JSON.parse(favoritesData) as Array<string>;
                const id = favorite.indexOf(yandex_code);
                if (id !== -1) {
                    favorite = [...favorite.slice(0, id), ...favorite.slice(id + 1)];
                    window.localStorage.setItem("favorites", JSON.stringify(favorite));
                    forceUpdate();

                }
            }
        }
    }

    return <>
        {stopsData && <ReactPaginate
            onPageChange={(selectedItem) => {
                setCurrPage(selectedItem.selected)
                setRangeToShow([props.showInPage * selectedItem.selected, props.showInPage * (selectedItem.selected + 1)])
            }}
            forcePage={currPage}
            pageCount={Math.ceil(applyFilter(stopsData.stations).length / props.showInPage)}
            renderOnZeroPageCount={null}
            pageRangeDisplayed={1}
            className="stops-page__pagination"
            previousLabel={"<"}
            nextLabel={">"}
        />}

        <div className="stops-page__stops-list">
            {stopsData && applyFilter(stopsData.stations).slice(...rangeToShow).map((stop: any) => {
                return <StopCard
                    key={uuid()}
                    data={stop}
                    yandex_code={stop.codes.yandex_code}
                    showOnMapHandler={(yandex_code: string) => props.showOnMapHandler(yandex_code)}
                    isFavorite={isFavorite(stop.codes.yandex_code)}
                    addToFavorite={(yandex_code: string) => addToFavorite(yandex_code)}
                    removeFromFavorite={(yandex_code: string) => removeFromFavorite(yandex_code)}
                />
            })}
        </div>


    </>
}

export default StopsList;