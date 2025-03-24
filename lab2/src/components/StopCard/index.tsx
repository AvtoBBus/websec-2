import "./style.css"

import FavotireIcon from "../../shared/assets/favorite.svg"
import FavotireEnableIcon from "../../shared/assets/favoriteEnable.svg"
import { ConvertStationType } from "../../shared/HelpFunctions"

const StopCard = (props: {
    data: any,
    yandex_code: string,
    showOnMapHandler: Function,
    isFavorite: boolean,
    addToFavorite: Function,
    removeFromFavorite: Function
}) => {

    // console.log(props)

    return <>
        <div className="stops-page__stop-card rubik-400">
            <div className="stop-card__left-content">
                <p className="left-content__title rubik-600">{props.data.title}</p>
                <p className="left-content__direction">Направление в сторону {props.data.direction}</p>
                <p className="left-content__station-type rubik-600">Тип остановки: {ConvertStationType[props.data.station_type as keyof typeof ConvertStationType]}</p>
            </div>
            <div className="stop-card__right-content">

                <button
                    className="right-content__add-to-favorite"
                    style={{ backgroundImage: `url(${props.isFavorite ? FavotireEnableIcon : FavotireIcon})` }}
                    onClick={() => props.isFavorite ? props.removeFromFavorite(props.yandex_code) : props.addToFavorite(props.yandex_code)}
                />

                <button
                    className="right-content__show-on-map-button"
                    onClick={() => props.showOnMapHandler(props.yandex_code)}
                >
                    Показать на карте
                </button>



            </div>
        </div>
    </>
}

export default StopCard