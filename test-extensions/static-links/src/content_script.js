import { init } from '../../../client';

// Inject Counter GUI into topright of page
const counter = document.createElement('div');
counter.setAttribute('style', 'z-index: 99999; position: fixed; top: 0; right: 0; background-color: white');
counter.innerHTML = `
<label> Local Link Count: <input id="local" disabled/></label>
<label> Global Link Count: <input id="global" disabled/></label>`;
document.body.appendChild(counter);

const localLinks = document.querySelectorAll('a').length;
document.getElementById('local').value = localLinks;


init({
  log: true,
  subscriptions: ['links'],
  onConnect: [{ action: 'NEW_PAGE', arg: localLinks }],
  onDisconnect: [{ action: 'CLOSE_PAGE', arg: localLinks }],
  actions: {
    LINKS: (globalLinks) => {
      document.getElementById('global').value = globalLinks;
    }
  }
});
