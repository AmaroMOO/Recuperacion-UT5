const llegadasUrl = 'recuperacion.xml';
const salidasUrl = 'recuperacion.json';

const tablaLlegadas = document.getElementById('tabla-llegadas');
const tablaSalidas = document.getElementById('tabla-salidas');
const tabLlegadas = document.getElementById('tab-llegadas');
const tabSalidas = document.getElementById('tab-salidas');

let llegadas = [], salidas = [];

function render(data, tipo) {
    const th = tipo === 'llegadas'
        ? '<th>Aerolínea</th><th>Código de vuelo</th><th>Hora de llegada</th><th>Origen</th><th>Estado</th><th>Terminal y puerta</th>'
        : '<th>Aerolínea</th><th>Código de vuelo</th><th>Hora de salida</th><th>Destino</th><th>Estado</th><th>Terminal y puerta</th>';
    return `<table class="table"><thead><tr>${th}</tr></thead><tbody>` +
        data.map(v => `<tr>
            <td class="logo"><img src="${v.logo}" alt="">${v.aerolinea}</td>
            <td>${v.codigo}</td>
            <td>${v.hora}</td>
            <td><b>${v.origen_destino}</b></td>
            <td><span class="estado ${v.estado.replace(/\s/g, '\\ ')}">${v.estado}</span></td>
            <td class="terminal">${v.terminal}</td>
        </tr>`).join('') +
        '</tbody></table>';
}

tabLlegadas.onclick = () => {
    tabLlegadas.classList.add('active');
    tabSalidas.classList.remove('active');
    tablaLlegadas.style.display = '';
    tablaSalidas.style.display = 'none';
    tablaLlegadas.innerHTML = render(llegadas, 'llegadas');
};
tabSalidas.onclick = () => {
    tabSalidas.classList.add('active');
    tabLlegadas.classList.remove('active');
    tablaSalidas.style.display = '';
    tablaLlegadas.style.display = 'none';
    tablaSalidas.innerHTML = render(salidas, 'salidas');
};

async function cargarLlegadas() {
    const xml = await (await fetch('recuperacion.xml')).text();
    const doc = new DOMParser().parseFromString(xml, "application/xml");
    llegadas = Array.from(doc.getElementsByTagName('aerolinea')).map(n => {
        let x = n;
        return {
            aerolinea: x.textContent,
            logo: x.nextElementSibling?.textContent || '',
            codigo: x.nextElementSibling?.nextElementSibling?.textContent || '',
            hora: x.nextElementSibling?.nextElementSibling?.nextElementSibling?.textContent || '',
            origen_destino: x.nextElementSibling?.nextElementSibling?.nextElementSibling?.nextElementSibling?.textContent || '',
            estado: x.nextElementSibling?.nextElementSibling?.nextElementSibling?.nextElementSibling?.nextElementSibling?.textContent || '',
            terminal: x.nextElementSibling?.nextElementSibling?.nextElementSibling?.nextElementSibling?.nextElementSibling?.nextElementSibling?.textContent || ''
        };
    });
}

async function cargarSalidas() {
    const json = await (await fetch('recuperacion.json')).json();
    salidas = json.map(item => {
        const i = item.vuelo.informacion[0];
        return {
            aerolinea: item.vuelo.aerolinea,
            logo: i.logo,
            codigo: i.codigo,
            hora: i.llegada,
            origen_destino: i.origen,
            estado: i.estado,
            terminal: i.terminal
        };
    });
}

window.onload = async () => {
    await Promise.all([cargarLlegadas(), cargarSalidas()]);
    tabLlegadas.onclick();
};