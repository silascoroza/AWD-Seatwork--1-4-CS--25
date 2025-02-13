class Player {
    constructor(name, score, level) {
        this.name = name;
        this.score = score;
        this.level = level;
    }
}

let players = [];
let filteredPlayers = [];

const playerForm = document.getElementById('playerForm');
const playerName = document.getElementById('playerName');
const playerScore = document.getElementById('playerScore');
const playerLevel = document.getElementById('playerLevel');
const playerTable = document.getElementById('playerTable');
const sortButton = document.getElementById('sortButton');
const sortCriterion = document.getElementById('sortCriterion');
const searchInput = document.getElementById('searchInput');

console.log("JavaScript file loaded!");

document.addEventListener('DOMContentLoaded', function () {
    console.log("DOM fully loaded");
    loadPlayers();
    displayPlayers();
});

function loadPlayers() {
    const storedPlayers = localStorage.getItem('players');
    if (storedPlayers) {
        try {
            players = JSON.parse(storedPlayers).map(p => new Player(p.name, p.score, p.level));
            if (players.length > 10) {
                players = players.slice(-10); 
            }
            filteredPlayers = [...players];
        } catch (error) {
            console.error("Error parsing players from localStorage:", error);
            players = [];
            filteredPlayers = [];
        }
    } else {
        players = [];
        filteredPlayers = [];
    }
}

function savePlayers() {
    localStorage.setItem('players', JSON.stringify(players));
}

function addPlayer(name, score, level) {
    if (players.some(player => player.name.toLowerCase() === name.toLowerCase())) {
        alert("A player with this name already exists.");
        return;
    }

    const newPlayer = new Player(name, score, level);
    players.push(newPlayer);

    if (players.length > 10) {
        players.shift(); 
    }

    filteredPlayers = [...players];

    savePlayers();
    displayPlayers();
}

function displayPlayers() {
    playerTable.innerHTML = ''; 

    if (filteredPlayers.length === 0) {
        playerTable.innerHTML = `<tr><td colspan="3">No players available</td></tr>`;
        return;
    }

    filteredPlayers.forEach(player => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${player.name}</td>
            <td>${player.score}</td>
            <td>${player.level}</td>
        `;
        playerTable.appendChild(row);
    });
}

playerForm.addEventListener('submit', function (event) {
    event.preventDefault();

    setTimeout(() => {
        const name = playerName.value.trim();
        const score = parseInt(playerScore.value, 10);
        const level = parseInt(playerLevel.value, 10);

        if (!/^[a-zA-Z\s]+$/.test(name)) {
            alert("Please enter a valid name (only letters and spaces).");
            return;
        }
        if (isNaN(score) || isNaN(level)) {
            alert("Score and level must be numbers.");
            return;
        }

        addPlayer(name, score, level);

        playerName.value = '';
        playerScore.value = '';
        playerLevel.value = '';
    }, 100);
});

sortButton.addEventListener('click', function () {
    const criterion = sortCriterion.value;

    players.sort((a, b) => {
        if (criterion === 'name') return a.name.localeCompare(b.name);
        if (criterion === 'score') return b.score - a.score;
        if (criterion === 'level') return b.level - a.level;
    });

    filteredPlayers = [...players];
    savePlayers();
    displayPlayers();
});

searchInput.addEventListener('input', function () {
    const searchQuery = searchInput.value.trim().toLowerCase();
    filteredPlayers = players.filter(player => player.name.toLowerCase().includes(searchQuery));
    displayPlayers();
});

document.addEventListener('click', function () {
    if (players.length > 0) {
        loadPlayers();
        displayPlayers();
    }
});

setInterval(() => {
    if (document.contains(playerTable) && playerTable.innerHTML === '') {
        console.log("Restoring table from localStorage...");
        loadPlayers();
        displayPlayers();
    }
}, 500);
