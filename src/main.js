const http = require('https');
const zendeskConfig = require('./config/zendesk-config.json')
const jiraConfig = require('./config/jira-config.json')

const zendeskApi = (method, path, body, callback) => {
    const auth = Buffer.from(`${zendeskConfig.username}/token:${zendeskConfig.token}`).toString('base64');
    const headers = {
        'Accept': 'application/json',
        'Authorization': `Basic ${auth}`
    }

    if (body) {
        headers['Content-Length'] = Buffer.byteLength(body)
    }

    const request = http.request({
        hostname: 'panintelligencesupport.zendesk.com',
        path: path,
        method: method,
        headers: headers
    }, (res) => {
        res.setEncoding('utf8');
        const chunks = [];
        res.on('data', (chunk) => {
            chunks.push(chunk);
        });
        res.on('end', () => {
            let data = "";
            try {
                data = Buffer.concat(chunks).toString();
            }
            catch (e) {
                data = chunks.join("");
            }
            if (callback) {
                callback(data);
            }
        });
    });

    if (body) {
        request.write(body)
    }
    return request;
};

const jiraApi = (method, path, extraHeaders, body, callback) => {
    const auth = Buffer.from(`${jiraConfig.username}:${jiraConfig.password}`).toString('base64');
    const headers = {
        'Accept': 'application/json',
        'Authorization': `Basic ${auth}`
    }

    if (typeof body === 'string') {
        headers['Content-Length'] = Buffer.byteLength(body)
    }

    if(extraHeaders){
        Object.keys(extraHeaders).forEach((h) => {
            headers[h] = extraHeaders[h];
        });
    }

    const request = http.request({
        hostname: jiraConfig.hostname,
        path: path,
        method: method,
        headers: headers
    }, (res) => {
        res.setEncoding('utf8');
        const chunks = [];
        res.on('data', (chunk) => {
            chunks.push(chunk);
        });
        res.on('end', () => {
            let data = "";
            try {
                data = Buffer.concat(chunks).toString();
            }
            catch (e) {
                data = chunks.join("");
            }
            if (callback) {
                callback(data);
            }
        });
    });

    if (body) {
        request.write(body)
    }
    return request;
};

const syncCustomers = () => {
    zendeskApi('GET', '/api/v2/organizations.json', null, (zenOrgsString) => {
        const zenOrgs = JSON.parse(zenOrgsString);
        const zenOrgNames = zenOrgs.organizations
            .filter((o)=>{return !zendeskConfig.ignoreOrgs.includes(o.name)})
            .map((o) => { return o.name });
        jiraApi('GET', '/rest/jiracustomfieldeditorplugin/1/user/customfields/10100/contexts/10205/options', null, null, (jiraCustomersString) => {
            const jiraCustomers = JSON.parse(jiraCustomersString);
            const jiraCustomersNames = jiraCustomers.map((o) => { return o.optionvalue });
            const customersToAdd = [];
            zenOrgNames.forEach((org) => {
                if(!jiraCustomersNames.includes(org)){
                    customersToAdd.push(org);
                }
            });
            if(customersToAdd.length > 0){
                console.log(`Updating ${customersToAdd.length} customers.`);
            }
            customersToAdd.forEach((customerName) => {
                const option = JSON.stringify({"optionvalue": customerName});
                const header = {'Content-Type':'application/json'};
                jiraApi('POST', '/rest/jiracustomfieldeditorplugin/1/user/customfields/10100/contexts/10205/options', header, option, (data)=>{
                    // console.log(data);
                });
            });
        }).end();
    }).end()
}

syncCustomers();