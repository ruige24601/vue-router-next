import { createRouter, createWebHistory } from '../../src'
import { createApp, ref, reactive, defineComponent } from 'vue'

const Home = defineComponent({
  template: `
    <div>
      <h2>Home</h2>
    </div>
  `,
})

const logs = ref<string[]>([])

const state = reactive({
  enter: 0,
  update: 0,
  leave: 0,
})

const Foo = defineComponent({
  template: '<div>foo {{ enterCallback }}</div>',
  data: () => ({ key: 'Foo', enterCallback: 0 }),
  beforeRouteEnter(to, from, next) {
    state.enter++
    logs.value.push(`enter ${from.path} - ${to.path}`)
    next(vm => {
      // @ts-ignore
      vm.enterCallback++
    })
  },
  beforeRouteUpdate(to, from) {
    if (!this || this.key !== 'Foo') throw new Error('no this')
    state.update++
    logs.value.push(`update ${from.path} - ${to.path}`)
  },
  beforeRouteLeave(to, from) {
    if (!this || this.key !== 'Foo') throw new Error('no this')
    state.leave++
    logs.value.push(`leave ${from.path} - ${to.path}`)
  },
})

const webHistory = createWebHistory('/' + __dirname)
const router = createRouter({
  history: webHistory,
  routes: [
    { path: '/', component: Home },
    {
      path: '/foo',
      component: Foo,
    },
    {
      path: '/f/:id',
      component: Foo,
    },
  ],
})
const app = createApp({
  template: `
    <div id="app">
      <h1>Instances</h1>
      <pre>
      route: {{ $route.fullPath }}
      enters: {{ state.enter }}
      updates: {{ state.update }}
      leaves: {{ state.leave }}
      </pre>
      <pre id="logs">{{ logs.join('\\n') }}</pre>
      <button id="resetLogs" @click="logs = []">Reset Logs</button>
      <ul>
        <li><router-link to="/">/</router-link></li>
        <li><router-link to="/foo">/foo</router-link></li>
        <li><router-link to="/f/1">/f/1</router-link></li>
        <li><router-link to="/f/2">/f/2</router-link></li>
        <li><router-link to="/f/2?foo">/f/2?foo</router-link></li>
      </ul>
      <router-view class="view" />
    </div>
  `,
  setup() {
    return { state, logs }
  },
})
app.use(router)

app.mount('#app')
