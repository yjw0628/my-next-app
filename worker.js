import originalWorker from "./.open-next/worker.js";

export default {
  ...originalWorker,
  async scheduled(event) {
    // add scheduled
  },
};

export * from "./.open-next/worker.js";