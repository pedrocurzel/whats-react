const url = "http://localhost:3001";

const apiFunctions = {
    get: async (endpoint, authenticated = true) => {
        try {
            let user = localStorage.getItem("user");
            if (user) {user = JSON.parse(user);}
            const response =  await fetch(url + endpoint, {
                method: "GET",
                headers: authenticated ? {
                    Authorization: user.token
                } : undefined
            });
            if (!response.ok) {
                throw new Error(`${await response.text()}`);
            }
            return response;
        } catch(error) {
            return error.message;
        }
    }, 
    post: async (endpoint, JSONBody, authenticated = true) => {
        let user = localStorage.getItem("user");
        if (user) {user = JSON.parse(user);}
        const headers = {"Content-Type": "application/json"};
        if (authenticated) {headers["Authorization"] = user.token};
        return await fetch(url + endpoint, {
            method: "POST",
            headers,
            body: JSONBody
        });
    }
}

export const {get, post} = apiFunctions;