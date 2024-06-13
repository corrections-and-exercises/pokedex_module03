const container = document.getElementById('container');
const body = document.querySelector('body');

window.addEventListener('load', () => {
    const favorites = getFavoritesFromLocalStorage();
    if (!favorites) {
        showMessage('No favorites!');
        return;
    }
    favorites.forEach((fav) => {
        const pokemon = createPokemonCard(fav);
        container.appendChild(pokemon);
    });
});

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

    const noteList = createElement('ul', ['p2']);
    noteList.dataset.id = data.id;

    const notes = data.notes.map((note) => {
        const notes = createElement('li', ['w-full', 'text-xs', 'p-1'], note);
        return notes;
    });

    const noteBtn = createElement(
        'button',
        ['text-xs', 'text-right'],
        'Add a Note'
    );

    const dialog = createDialog(data);

    noteBtn.addEventListener('click', () => {
        dialog.showModal();
    });

    card.appendChild(noteBtn);
    card.appendChild(image);
    card.appendChild(nameElement);
    card.appendChild(noteList);
    notes.forEach((note) => noteList.appendChild(note));
    card.appendChild(dialog);

    return card;
}

function getFavoritesFromLocalStorage() {
    const data = JSON.parse(localStorage.getItem('favorites'));
    return data;
}

function showMessage(text) {
    const p = document.createElement('p');
    p.textContent = text;
    p.classList.add('bg-yellow-400', 'p-4', 'rounded', 'text-blue-800');
    container.appendChild(p);
}

function addNote(id, text) {
    const data = JSON.parse(localStorage.getItem('favorites'));
    const pokemon = data.find((el) => el.id === id);
    pokemon.notes.push(text);
    localStorage.setItem('favorites', JSON.stringify(data));
}

function createDialog(data) {
    const closeBtn = createElement('button', [], 'x');
    const inputDialog = createElement('dialog', ['p-8']);
    const container = createElement('div', ['flex', 'flex-col', 'gap-4']);
    const input = createElement('input', ['border', 'border-2']);
    const button = createElement('button', [], 'add note');

    button.addEventListener('click', (e) => {
        addNote(data.id, input.value);

        const notes = document.querySelector(`[data-id='${data.id}']`);

        const li = createElement(
            'li',
            ['w-full', 'text-xs', 'p-1'],
            input.value
        );
        input.value = '';
        notes.appendChild(li);
        inputDialog.close();
    });

    container.appendChild(closeBtn);
    container.appendChild(input);
    container.appendChild(button);

    inputDialog.appendChild(container);

    closeBtn.addEventListener('click', () => {
        inputDialog.close();
    });

    return inputDialog;
}

function createElement(type, classes, content) {
    const element = document.createElement(type);
    element.classList.add(...classes);
    element.textContent = content;
    return element;
}
