import { getInput, setOutput, setFailed } from '@actions/core';
import fetch from 'node-fetch';
import jwtDecode from 'jwt-decode';

/*
* Get the IAM bearer token using an API key
*/
const getBearer = async (tokenHost, apikey) => {
    console.log( 'Signing in to IBM Cloud' );
    const params = new URLSearchParams();
    params.append('grant_type', 'urn:ibm:params:oauth:grant-type:apikey');
    params.append('apikey', apikey);
    const response = await fetch(tokenHost, { method: 'POST', body: params });
    const json = await response.json();
    const bearer = json.access_token;
    return bearer;
}

/*
* Call the SatCon API to set a new version for a subscription
*/
const setSubscriptionVersion = async (token, host, subscriptionUuid, versionUuid) => {
    console.log( 'Updating subscription %s to version %s', subscriptionUuid, versionUuid )

    const jwt = jwtDecode(token);
    const bss = jwt.account.bss;

    const request =
    {
        "query": "mutation setSubscription($orgId: String!, $uuid: String!, $versionUuid: String!) { setSubscription(orgId: $orgId, uuid: $uuid, versionUuid: $versionUuid) {success uuid}}",
        "variables":
        {
            "orgId": bss,
            "uuid": subscriptionUuid,
            "versionUuid": versionUuid
        },
        "operationName": "setSubscription"
    };

    // Call API
    const headers = { 'content-type': 'application/json', 'authorization': 'Bearer ' + token };
    const fetchResponse = await fetch(host, { method: 'POST', headers: headers, body: JSON.stringify(request) })
    const response = await fetchResponse.json();
    if ( response.errors ) {
        throw new Error (response.errors[0].message);
    }
    console.log( 'Subscription ID %s updated', response.data.setSubscription.uuid );
    return response.data.setSubscription.uuid;
} 

async function main() {
    try {
        const apikey = getInput('apikey');
        if ( !apikey ) {
            throw new Error('Missing apikey');
        }

        const subscriptionUuid = getInput('subscriptionUuid');
        if ( !subscriptionUuid ) {
            throw new Error('Missing subscriptionUuid');
        }

        const versionUuid = getInput('versionUuid');
        if ( !versionUuid ) {
            throw new Error('Missing versionUuid');
        }

        const tokenHost = getInput('tokenHost');
        const bearer = await getBearer(tokenHost, apikey);
        const host = getInput('satelliteHost'); 

        const uuid = await setSubscriptionVersion(bearer, host, subscriptionUuid, versionUuid);

        setOutput("uuid", uuid);
    } catch (error) {
        setFailed(error.message);
    }
}

main();