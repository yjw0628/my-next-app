/* eslint-disable */
// custom-worker
import { default as handler } from "./.open-next/worker.js";
 
export default {
  fetch: handler.fetch,
 
  async scheduled(event) {
    // ...
  },
};
 
// The re-export is only required if your app uses the DO Queue and DO Tag Cache
// See https://opennext.js.org/cloudflare/caching for details
// export { DOQueueHandler, DOShardedTagCache } from "./.open-next/worker.js";