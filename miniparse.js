/*
 Placeholder available

 Title: #{title}
 Name: #{name}
 job: #{Job}
 Duration: #{duration}
 DPS: #{ENCDPS}
 Crt %: #{crithit%}
*/

"use strict";
const encounterDefinition = '#{title} / Time: #{duration} / DPS: #{ENCDPS}';

const headerDefinition =
    [
        { text: 'Name', width: '25%', align: 'left' },
        { text: 'Job', width: '8%', align: 'center' },
        { text: 'DPS', width: '18%', align: 'center' },
        { text: 'Crt.(%)', width: '14%', align: 'right' },
    ];

const bodyDefinition =
    [
        { text: '#{name}', width: '25%' },
        { html: '<img src="./img/class/#{Job}.png" height="22px" />', width: '8%', align: 'center' },
        { text: '#{encdps}', width: '16%', align: 'right' },
        { text: '#{crithit%}', width: '14%', align: 'right' },
    ];

const pet_mapping = {
    'Emerald Carbuncle': 'acn-pet',
    'Topaz Carbuncle': 'acn-pet',
    'Ruby Carbuncle': 'acn-pet',
    'Garuda-Egi': 'garuda',
    'Titan-Egi': 'titan',
    'Ifrit-Egi': 'ifrit',
    'Eos': 'eos',
    'Selene': 'selene',
    'Rook Autoturret': 'rook',
    'Bishop Autoturret': 'bishop',
};

function resizeHandler(e) {
    if (!e.detail.isLocked) {
        document.documentElement.classList.add('resizeHandle');
    } else {
        document.documentElement.classList.remove('resizeHandle');
    }
}

function updateDataHandler(e) {
    updateEncounter(e.detail.Encounter);
    if (!document.getElementById("combatantsTable").tHead) {
        createPayersListHeader();
    }
    updatePlayersList(e.detail.Combatant);
}

function updateEncounter(data) {
    document.getElementById("encounter").innerText = fillTemplate(encounterDefinition, data);
}

function createPayersListHeader() {
    const fillHeader = (row) => (elem) => {
        let cell = row.insertCell(-1);
        if ('text' in elem) {
            cell.innerText = elem.text;
        }
        if ('html' in elem) {
            cell.innerHTML = elem.html;
        }
        if ('width' in elem) {
            cell.style.width = elem.width;
            cell.style.maxWidth = elem.width;
        }
        if ('span' in elem) {
            cell.colSpan = elem.span;
        }
        if ('align' in elem) {
            cell.style.textAlign = elem.align;
        }
    };
    let header = document.createElement("tHead");
    let row = header.insertRow();
    headerDefinition.forEach(fillHeader(row));
    document.getElementById("combatantsTable").tHead = header;
}

function updatePlayersList(data) {
    const resolveClass = (player) => {
        if (player.Job !== '') {
            player.Job = player.Job.toLowerCase();
        } else if (player.name === 'Limit Break'){
            player.Job = 'limit-break';
        } else if (player.name in pet_mapping) {
            player.Job = pet_mapping[player.name]
        }
        return player;
    };
    const shouldDisplay = (player) => player.Job !== '';
    const updatePlayerRow = (row, player) => (elem) => {
        let cell = row.insertCell(-1);
        if ('text' in elem) {
            cell.innerText = fillTemplate(elem.text, player);
        }
        if ('html' in elem) {
            cell.innerHTML = fillTemplate(elem.html, player);
        }
        if ('width' in elem) {
            cell.style.width = elem.width;
            cell.style.maxWidth = elem.width;
        }
        if ('align' in elem) {
            cell.style.textAlign = elem.align;
        }
    };

    let body = document.createElement("tbody");
    for(let combatantName in data) {
        let combatant = resolveClass(data[combatantName]);
        if (shouldDisplay(combatant)) {
            let row = body.insertRow(-1);
            bodyDefinition.forEach(updatePlayerRow(row, combatant));
        }
    }
    let oldBody = document.getElementById("combatantsTable").tBodies[0];
        if(!oldBody){
        document.getElementById("combatantsTable").appendChild(body);
    } else {
        document.getElementById("combatantsTable").replaceChild(body, oldBody);
    }
}

function fillTemplate(str, dict) {
    const getValue = (match, key) => key in dict ? dict[key] : 'N/A';
    return str.replace(/#{([^}]+)}/g, getValue);
}

document.addEventListener('onOverlayStateUpdate', resizeHandler);
document.addEventListener('onOverlayDataUpdate', updateDataHandler);
