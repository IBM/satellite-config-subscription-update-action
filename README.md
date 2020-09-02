# satellite-config-subscription-update-action
A Github Actions that allow users to update an IBM Cloud Satellite Config subscription

# satellite-config-actions
A set of Github Actions that allow users to integrate IBM Cloud Satellite Config into their Github CI pipelines.

## Inputs

### `apikey`

**Required** The IBM Cloud API key.

### `satelliteHost`

**Optional** The IBM Cloud Satellite API endpoint. Defaults to https://config.satellite.cloud.ibm.com/graphql

### `tokenHost`

**Optional** IBM Cloud IAM endpoint. Defaults to https://iam.cloud.ibm.com/identity/token

### `subscriptionUuid`

**Required** The id of the subscription

### `versionUuid`

**Required** The id of the new version.

## Outputs

### `uuid`

The subscription id that was updated 

## Example usage

```
uses: IBM/satellite-config-subscription-update-action@v1
with:
  apikey: 'xxxxxxxxxxxxxxxxxxxx'
  subscriptionUuid: 'aaa-bbb-ccc'
  versionUuid: 'ddd-eee-fff'
```
