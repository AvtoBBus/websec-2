class BaseApi {

    private basePath = `http://localhost:${process.env.REACT_APP_SERVER_PORT ?? 3000}/api/`;
    private apiKey = process.env.REACT_APP_API_KEY;

    constructor(basePath?: string) {
        if (basePath) this.basePath = basePath
    }

    protected sendRequest(
        method: 'GET' | 'POST' | 'DELETE',
        url: string,
        data?: any
    ): Promise<any> {
        const requestBody = {
            method: method,
            headers: {
                "Content-Type": "application/json",
            },
            withCredentials: true,
        }



        if (url.startsWith('/')) url = url.slice(1);

        const requestUrl = new URLSearchParams();

        this.apiKey && requestUrl.append('apikey', this.apiKey);

        if (data) {
            Object.keys(data).forEach(key => {
                requestUrl.append(key, data[key]);
            })
        }

        return fetch(this.basePath + url + requestUrl.toString(), requestBody)
            .then(r => { return r; })
    }

    protected parseXML(xmlString: string): any {
        const { XMLParser } = require("fast-xml-parser");
        const parser = new XMLParser();
        try {
            let jObj = parser.parse(xmlString);
            return jObj
        } catch (error) {
            throw error;
        }
    }
}

export class StationApi extends BaseApi {

    getAllStations() {
        return this.sendRequest('GET', "stations?", { format: 'json', lang: "ru_RU" })
            .then(response => {
                return response.json().then((r: any) => { return r; })
            })
    }


    getSchedule(station: string) {
        return this.sendRequest('GET', "schedule?", { station: station, format: 'json', lang: "ru_RU" })
            .then(response => {
                return response.json().then((r: any) => { return r; })
            })
    }

    before2Sations(from: string, to: string) {
        return this.sendRequest('GET', "search?", { from: from, to: to, format: 'json', lang: "ru_RU", transport_types: "train" })
            .then(response => {
                return response.json().then((r: any) => {
                    if (r.error)
                        throw r;
                    return r;
                });
            })
    }

}