import { createApp } from 'vue'
import App from './App.vue'
import FetchAdapter from './infra/http/FetchAdapter'
import AccountGatewayHttp from './infra/gateway/AccountGatewayHttp'

const app = createApp(App)
const httpClient = new FetchAdapter()
const accountGateway = new AccountGatewayHttp(httpClient)
app.provide('accountGateway', accountGateway)
app.mount('#app')
