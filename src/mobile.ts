(() => {
  kintone.events.on("mobile.app.record.index.show", (event) => {
    return event;
  });
})();
