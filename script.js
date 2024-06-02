Swal.fire({
    title: "Bienvenido",
    text: "Este es mi proyecto final de coderhouse, espero que te guste.",
    imageUrl: "./multimedia/alertimg.png",
    imageWidth: 350,
    imageHeight: 200,
    imageAlt: "Alert Image"
});

document.addEventListener("DOMContentLoaded", () => {
    const apiUrl = 'https://pokeapi.co/api/v2/pokemon?limit=100';
    const selectElement = document.getElementById("pokemon_select");
    const imgContainer = document.getElementById("imagenes_pokemon");
    const statsContainer = document.getElementById("estadisticas_pokemon");
    const textsContainer = document.getElementById("title_container");
    const localStorageKey = "pokemonList";

    let pokemonArray = [];

    function fetchPokemonList() {
        return fetch(apiUrl)
            .then(response => {
                if (!response.ok) {
                    throw new Error('El enlace no está bien: ' + response.statusText);
                }
                return response.json();
            })
            .then(data => {
                pokemonArray = data.results.map(pokemon => ({
                    name: pokemon.name,
                    url: pokemon.url
                }));
                saveToLocalStorage(localStorageKey, pokemonArray);
                return pokemonArray;
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
            optionElement.value = pokemon.url;
            optionElement.textContent = pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1);
            selectElement.appendChild(optionElement);
        });
    }

    function fetchPokemonDetails(pokemonUrl) {
        return fetch(pokemonUrl)
            .then(response => response.json())
            .then(data => ({
                imageUrl: data.sprites.front_default,
                weight: data.weight / 10,
                height: data.height / 10
            }))
            .catch(error => {
                console.error("Error al realizar fetch de los detalles del Pokémon:", error);
            });
    }

    function displayPokemonImage(imageUrl) {
        imgContainer.innerHTML = '';
        if (imageUrl) {
            const imgElement = document.createElement("img");
            imgElement.src = imageUrl;
            imgElement.alt = "Pokemon Image";
            imgContainer.appendChild(imgElement);
        } else {
            imgContainer.textContent = 'No hay imagen disponible';
        }
    }

    function displayPokemonStats(weight, height) {
        statsContainer.innerHTML = '';
        const weightElement = document.createElement("p");
        weightElement.classList.add("text_superior");
        weightElement.textContent = `${weight.toFixed(1)} kg`;
        const heightElement = document.createElement("p");
        heightElement.classList.add("text_inferior");
        heightElement.textContent = `${height.toFixed(1)} m`;
        statsContainer.appendChild(weightElement);
        statsContainer.appendChild(heightElement);
    }

    function updateVisibility()    {
        textsContainer.innerHTML = '';
        const h2Element = document.createElement("h2");
        h2Element.textContent = "Peso:";
        const h3Element = document.createElement("h3");
        h3Element.textContent = "Altura:";
        textsContainer.appendChild(h2Element);
        textsContainer.appendChild(h3Element);
    }

    function resetPokemonInfo() {
        statsContainer.innerHTML = '';
        textsContainer.innerHTML = '';

        imgContainer.innerHTML = '';
        const imgElement = document.createElement("img");
        imgElement.src = "./multimedia/pikachu.png";
        imgElement.alt = "Pokemon Image";
        imgContainer.appendChild(imgElement);
    }

    selectElement.addEventListener("change", (event) => {
        const pokemonUrl = event.target.value;
        if (pokemonUrl) {
            fetchPokemonDetails(pokemonUrl).then(details => {
                if (details) {
                    displayPokemonImage(details.imageUrl);
                    displayPokemonStats(details.weight, details.height);
                    updateVisibility();
                }
            });
        } else {
            resetPokemonInfo();
        }
    });

    let pokemonList = getFromLocalStorage(localStorageKey);

    if (pokemonList) {
        
        populateSelect(pokemonList);
    } else {
        
        fetchPokemonList().then(fetchedPokemonList => {
            if (fetchedPokemonList) {
                populateSelect(fetchedPokemonList);
            }
        });
    }
});