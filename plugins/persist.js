import VuexPersistence from 'vuex-persist'

import { version } from "../package.json"

export default ({ store }) => {
  new VuexPersistence({
    key: `engine-${version}`,
    storage: window.localStorage,
    reducer: state => ({
      avail: state.avail,
      pwaPromptSeen: state.pwaPromptSeen,
    }),
  }).plugin(store);
}
