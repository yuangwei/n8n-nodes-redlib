/* eslint-disable */
import type {
 ICredentialType,
 INodeProperties,
 IAuthenticateGeneric,
 ICredentialTestRequest,
} from 'n8n-workflow';

export class RedlibApi implements ICredentialType {
 name = 'redlibApi';
 displayName = 'Redlib API';
 documentationUrl = 'https://github.com/redlib-org/redlib';
 testedBy = 'redlib';
 properties: INodeProperties[] = [
 {
  displayName: 'Instance URL',
  name: 'instanceUrl',
  type: 'string',
  default: 'https://redlib.catsarch.com',
  required: true,
  description: 'URL of the Redlib instance to use',
 },
 {
  displayName: 'Authentication',
  name: 'authType',
  type: 'options',
  options: [
  {
   name: 'None',
   value: 'none',
   description: 'No authentication required',
  },
  {
   name: 'Basic Auth',
   value: 'basicAuth',
   description: 'Username and password authentication',
  },
  ],
  default: 'none',
 },
 {
  displayName: 'Username',
  name: 'username',
  type: 'string',
  displayOptions: {
  show: {
   authType: ['basicAuth'],
  },
  },
  default: '',
 },
 {
  displayName: 'Password',
  name: 'password',
  type: 'string',
  typeOptions: {
  password: true,
  },
  displayOptions: {
  show: {
   authType: ['basicAuth'],
  },
  },
  default: '',
 },
 ];
 authenticate: IAuthenticateGeneric = {
  type: 'generic',
  properties: {
  headers: {
   'User-Agent': 'n8n-redlib-node/1.0',
  },
  },
 };
 test: ICredentialTestRequest = {
  request: {
  baseURL: '={{$credentials.instanceUrl}}',
  url: '/',
  },
 };
}
