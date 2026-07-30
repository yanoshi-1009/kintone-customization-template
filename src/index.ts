import "./i18n";

(() => {
  kintone.events.on("app.record.index.show", (event) => {
    return event;
  });
})();
