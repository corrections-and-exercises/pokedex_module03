const pokeUrl = 'https://pokeapi.co/api/v2/pokemon';

const container = document.getElementById('container');
const form = document.querySelector('form');
const banner = document.querySelector('#banner');

const fetchAllBtn = document.querySelector('#all');

const localCache = {};
const mapIdToName = {};

displayFirstGeneration();

form.addEventListener('submit', async (event) => {
    event.preventDefault();
    const searchName = event.target.elements.search.value.toLowerCase();
    const pokemon = await fetchPokemon(searchName);
    const pokemonCard = createPokemonCard(pokemon);
    container.innerHTML = '';
    container.appendChild(pokemonCard);
    form.reset();
});

fetchAllBtn.addEventListener('click', () => {
    displayFirstGeneration();
});

async function displayFirstGeneration() {
    container.innerHTML = '';
    for (let i = 1; i <= 151; i++) {
        const pokemon = await fetchPokemon(i);
        const pokemonCard = createPokemonCard(pokemon);
        container.appendChild(pokemonCard);
    }
}

function createPokemonCard(data) {
    const card = createElement('div', [
        'border',
        'rounded',
        'bg-slate-100',
        'w-1/4',
    ]);

    const title = data.name[0].toUpperCase() + data.name.slice(1);
    const nameElement = createElement('p', ['text-center'], title);

    const image = document.createElement('img');
    image.src = data.sprites.other['official-artwork']['front_default'];
    image.alt = data.name;

    const button = createElement(
        'button',
        [
            'hover:before:content-["💛"]',
            'hover:before:absolute',
            'active:before:content-["🧡"]',
            'active:before:absolute',
        ],
        '❤️'
    );

    button.addEventListener('click', () => {
        addFavoritesToLocalStorage(data);
        banner.classList.remove('hidden');

        setTimeout(() => {
            banner.classList.add('hidden');
        }, 750);
    });

    card.appendChild(button);
    card.appendChild(image);
    card.appendChild(nameElement);

    return card;
}

async function fetchPokemon(id) {
    try {
        if (localCache[id] || localCache[mapIdToName[id]]) {
            return localCache[id] || localCache[mapIdToName[id]];
        }

        const res = await fetch(`${pokeUrl}/${id}`);
        if (!res.ok) throw new Error('Request failed');
        const data = await res.json();

        //TODO: Research alternatives for caching
        //enables cache for id and name search
        localCache[id] = data;
        mapIdToName[data.name] = id;

        return data;
    } catch (error) {
        console.error(error);
    }
}

function addFavoritesToLocalStorage(item) {
    const data = JSON.parse(localStorage.getItem('favorites')) || [];
    const alreayInList = data.find((el) => el.name === item.name);
    if (alreayInList) return;
    data.push({ ...item, notes: [] });
    localStorage.setItem('favorites', JSON.stringify(data));
}

function createElement(type, classes, content) {
    const element = document.createElement(type);
    element.classList.add(...classes);
    element.textContent = content;
    return element;
}
