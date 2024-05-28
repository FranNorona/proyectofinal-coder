document.addEventListener("DOMContentLoaded", () => {
    const apiUrl = 'https://pokeapi.co/api/v2/pokemon?limit=100'; // Cambia el límite según lo necesites
    const selectElement = document.getElementById("pokemon_select");
    const imgContainer = document.getElementById("imagenes_pokemon");
    const localStorageKey = "pokemonList";

    function fetchPokemonList() {
        return fetch(apiUrl)
            .then(response => {
                if (!response.ok) {
                    throw new Error('El enlace no está bien: ' + response.statusText);
                }
                return response.json();
            })
            .then(data => {
                const pokemonList = data.results.map((pokemon) => {
                    return { name: pokemon.name, url: pokemon.url };
                });
                saveToLocalStorage(localStorageKey, pokemonList);
                return pokemonList;
            })
            .catch(error => {
                console.error("Error al realizar fetch de la lista de Pokémon:", error);
            });
    }

    function saveToLocalStorage(key, data) {
        localStorage.setItem(key, JSON.stringify(data));
    }

    function getFromLocalStorage(key) {
        const data = localStorage.getItem(key);
        return data ? JSON.parse(data) : null;
    }

    function populateSelect(pokemonList) {
        pokemonList.sort((a, b) => a.name.localeCompare(b.name));

        pokemonList.forEach(pokemon => {
            const optionElement = document.createElement("option");
            optionElement.value = pokemon.url; // Usamos la URL para obtener los detalles del Pokémon
            optionElement.textContent = pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1);
            selectElement.appendChild(optionElement);
        });
    }

    function fetchPokemonDetails(pokemonUrl) {
        return fetch(pokemonUrl)
            .then(response => response.json())
            .then(data => data.sprites.front_default)
            .catch(error => {
                console.error("Error al realizar fetch de los detalles del Pokémon:", error);
            });
    }

    function displayPokemonImage(imageUrl) {
        imgContainer.innerHTML = ''; // Limpiar cualquier imagen anterior
        if (imageUrl) {
            const imgElement = document.createElement("img");
            imgElement.src = imageUrl;
            imgElement.alt = "Pokemon Image";
            imgContainer.appendChild(imgElement);
        } else {
            imgContainer.textContent = 'No image available';
        }
    }

    selectElement.addEventListener("change", (event) => {
        const pokemonUrl = event.target.value;
        if (pokemonUrl) {
            fetchPokemonDetails(pokemonUrl).then(imageUrl => {
                if (imageUrl) {
                    displayPokemonImage(imageUrl);
                }
            });
        }
    });

    let pokemonList = getFromLocalStorage(localStorageKey);

    if (pokemonList) {
        // Si hay datos en localStorage, usa esos datos
        populateSelect(pokemonList);
    } else {
        // Si no hay datos, busca la lista de Pokémon y guarda en localStorage
        fetchPokemonList().then(fetchedPokemonList => {
            if (fetchedPokemonList) {
                populateSelect(fetchedPokemonList);
            }
        });
    }
});
