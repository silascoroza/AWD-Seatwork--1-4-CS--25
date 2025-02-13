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

document.addEventListener('DOMContentLoaded', function () {
    loadPlayers();
    displayPlayers();
});

function loadPlayers() {
    const storedPlayers = localStorage.getItem('players');
    if (storedPlayers) {
        try {
            players = JSON.parse(storedPlayers);
            filteredPlayers = [...players];
            console.log("Loaded players from localStorage:", players);
        } catch (error) {
            console.error("Error parsing players from localStorage:", error);
            players = [];
            filteredPlayers = [];
        }
    } else {
        console.log("No players found in localStorage.");
    }
}

function savePlayers() {
    localStorage.setItem('players', JSON.stringify(players));
    console.log("Saved players to localStorage:", players);
}

function addPlayer(name, score, level) {
    // Check if a player with the same name already exists
    const existingPlayer = players.find(player => player.name === name);
    if (existingPlayer) {
        alert("A player with this name already exists.");
        return;
    }

    const newPlayer = new Player(name, score, level);
    players.push(newPlayer);
    filteredPlayers.push(newPlayer);
    savePlayers();
    console.log("Added player:", newPlayer);
    sortPlayers();
    displayPlayers();
}

function displayPlayers() {
    console.log("Displaying players:", filteredPlayers);
    playerTable.innerHTML = '';

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

    const name = playerName.value.trim();
    const score = parseInt(playerScore.value, 10);
    const level = parseInt(playerLevel.value, 10);

    console.log(`Form submitted: Name=${name}, Score=${score}, Level=${level}`);

    const nameRegex = /^[a-zA-Z]+$/;
    if (!nameRegex.test(name)) {
        alert("Please enter a valid name (only letters a-z are allowed).");
        return;
    }

    if (isNaN(score)) { // Fixed: Added missing parenthesis
        alert("Please enter a valid score (must be a number).");
        return;
    }

    if (isNaN(level)) {
        alert("Please enter a valid level (must be a number).");
        return;
    }

    if (name && !isNaN(score) && !isNaN(level)) {
        addPlayer(name, score, level);
    } else {
        alert("Please fill in all fields with valid data.");
    }

    playerName.value = '';
    playerScore.value = '';
    playerLevel.value = '';
});

function sortPlayers() {
    filteredPlayers.sort((a, b) => a.name.localeCompare(b.name));
    console.log("Sorted players:", filteredPlayers);
}

sortButton.addEventListener('click', function () {
    const criterion = sortCriterion.value;

    console.log(`Sorting players by: ${criterion}`);

    filteredPlayers.sort((a, b) => {
        if (criterion === 'name') {
            return a.name.localeCompare(b.name);
        } else if (criterion === 'score') {
            return b.score - a.score;
        } else if (criterion === 'level') {
            return b.level - a.level;
        }
    });

    savePlayers();
    displayPlayers();
});

searchInput.addEventListener('input', function () {
    const searchQuery = searchInput.value.trim().toLowerCase();

    filteredPlayers = players.filter(player => player.name.toLowerCase().includes(searchQuery));

    filteredPlayers.sort((a, b) => a.name.localeCompare(b.name));

    displayPlayers();
});
