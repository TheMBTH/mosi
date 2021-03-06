import { init, msg } from '../../../core';

let global_links = 0;

init({
  log: true,
  actions: {
    NEW_PAGE: (links) => {
      global_links += links;
      msg('links', 'LINKS', global_links);
    },
    CLOSE_PAGE: (links) => {
      global_links -= links;
      msg('links', 'LINKS', global_links);
    }
  }
});
