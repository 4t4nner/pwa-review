
export default function (action,data = {}) {
    let fUrl = new URL(`${document.location.origin}/rest/pwa.php?method=${action}`);

    /**
     *
     * @param {Array} newHeaders - array of [key,val] arrays
     */
    const setHeaders = (newHeaders) => {
        if(!(data.headers instanceof Headers)){
            data.headers = new Headers();
        }
        if(!Array.isArray(newHeaders) || !Array.isArray(newHeaders[0])){
            throw new TypeError('expected array of arrays');
        }
        newHeaders.map((h) => data.headers.set(h[0],h[1]))

        return this
    }

    this.callApi = () => {
        return fetch(fUrl.toString(),data)
            .then(response => {
                console.log(response);
                if(!response.ok){
                    console.log('fetch failed',response);
                    return null;
                }
                const contentType = response.headers.get("content-type");
                if(contentType && contentType.includes("application/json")) {
                    return response.json();
                }
                throw new TypeError("Oops, we haven't got JSON!");
            })
            .catch((e) => {
                console.log('fetch failed, e:',e);

                return null;
            })
    }
    this.setAuth = (authStr) => {
        console.log('authStr',authStr)
        setHeaders([['Authorization',`Basic ${authStr}`]]);
        return this;
    }
    this.setMethod = (method = 'GET') => {
        data.method = method

        return this
    }
    this.setParams = (params) => {
        Object.keys(params).forEach(key => fUrl.searchParams.append(`arg[${key}]`, params[key]));

        return this
    }
    this.setJson = (jsonData) => {
        setHeaders([
            ['Accept', 'application/json'],
            ['Content-Type', 'application/json']
        ])

        data.body = JSON.stringify(jsonData)

        return this
    }

    return this;
}
