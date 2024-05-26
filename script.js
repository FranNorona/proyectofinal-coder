const apiUrl = 'https://pokeapi.co/api/v2/pokemon?limit=100'; // Cambia el límite según lo necesites
const selectElement = document.getElementById("pokemon_select");

function pokemonList()  {
    return fetch(apiUrl)
        .then(response => {
            if(!response.ok) {
                throw new Error('El linkeado no esta bien:' + response.statusText);
            }
            return response.json();
        })
        .then(data => {
            return data.results.map((pokemon, index) => {
                return { id: index + 1, name: pokemon.name};
            });
        })
        .catch(error => {
            console.error("Error al realizar fetch de la lista de Pokémon:", error);
        })
}

function populateSelect(pokemonList)    {

    pokemonList.sort((a, b) => a.name.localeCompare(b.name));

    pokemonList.forEach(pokemon => {
        const optionElement = document.createElement("option");
        optionElement.value = pokemon.name;
        optionElement.textContent = pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1);
        selectElement.appendChild(optionElement);
    })
}

pokemonList().then(pokemonList => {
    if (pokemonList) {
        populateSelect(pokemonList);
    }
});