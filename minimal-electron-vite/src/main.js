import './style.css'

document.querySelector('#app').innerHTML = `
  <div>
    <h1>Minimal Electron + Vite</h1>
    <p>This is a working Electron app with Vite!</p>
    <div class="card">
      <button id="counter" type="button">Count: 0</button>
    </div>
  </div>
`

let count = 0;
document.querySelector('#counter').addEventListener('click', () => {
  count++;
  document.querySelector('#counter').textContent = `Count: ${count}`;
});
