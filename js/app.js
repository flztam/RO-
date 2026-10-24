/**
 * app.js – Application entry point: registers pages, bootstraps everything
 */
(function () {
  // Stamp refine log entries with timestamp
  const _origAddLog = State.addRefineLog.bind(State);
  // We'll just add time in refine.js if needed – no override needed

  // Register all pages
  Router.register('page-landing', {});
  Router.register('page-main',    { onEnter: () => MainPage.refresh() });
  Router.register('page-refine',  { onEnter: () => Refine.open() });
  Router.register('page-inventory',{ onEnter: () => Inventory.open() });
  Router.register('page-shop',    { onEnter: () => Shop.open() });
  Router.register('page-achievements', { onEnter: () => Achievements.open() });
  Router.register('page-settings',{ onEnter: () => Settings.open() });

  // Init modules
  Landing.init();
  MainPage.init();
  Settings.init();

  // Attempt auto-login
  if (State.autoLogin()) {
    MainPage.refresh();
    Router.go('page-main');
  } else {
    Router.go('page-landing');
  }

  // Periodically save state
  setInterval(() => { if (State.isLoggedIn()) State.save(); }, 30000);

  // Save on page hide
  document.addEventListener('visibilitychange', () => {
    if (document.hidden && State.isLoggedIn()) State.save();
  });

  window.addEventListener('beforeunload', () => {
    if (State.isLoggedIn()) State.save();
  });

  console.log('%cRO+ Refine 🔨 – Fan game. All RO IP belongs to Gravity Co., Ltd.', 'color:#e8a832;font-size:14px;');
})();
