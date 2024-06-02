//Generamos la alerta de bienvenida con SweetAlert al cargar la pagina.
Swal.fire({
    title: "Bienvenido",
    text: "Este es mi proyecto final de coderhouse, espero que te guste.",
    imageUrl: "./multimedia/alertimg.png",
    imageWidth: 350,
    imageHeight: 200,
    imageAlt: "Alert Image"
});

document.addEventListener("DOMContentLoaded", () => {
    const apiUrl = 'https://pokeapi.co/api/v2/pokemon?limit=100'; // Obtenemos la api mediando un URL y la asignamos a una variable.
    const selectElement = document.getElementById("pokemon_select"); // Creamos una variable select donde vamos a insertar datos de la API.
    const imgContainer = document.getElementById("imagenes_pokemon"); // Creamos una variable para contener las imagenes.
    const statsContainer = document.getElementById("estadisticas_pokemon"); // Creamos una variable para contener las estadisticas.
    const textsContainer = document.getElementById("title_container"); // Creamos un contenedor para los titulos h2 y h3.
    const localStorageKey = "pokemonList";

    let pokemonArray = [];

    // Generamos una funcion que se va a encargar de obtener la lista de Pokemones desde la API mediante un FETCH.
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

    // Guardamos los datos en localStorage.
    function saveToLocalStorage(key, data) {
        localStorage.setItem(key, JSON.stringify(data));
    }

    // Obtenemos los datos desde el localStorage.
    function getFromLocalStorage(key) {
        const data = localStorage.getItem(key);
        return data ? JSON.parse(data) : null;
    }

    // Creamos los elementos select correspondientes y los ordenamos de forma alfabetica desde A a Z.
    function populateSelect(pokemonList) {
        pokemonList.sort((a, b) => a.name.localeCompare(b.name));

        pokemonList.forEach(pokemon => {
            const optionElement = document.createElement("option");
            optionElement.value = pokemon.url;
            optionElement.textContent = pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1);
            selectElement.appendChild(optionElement);
        });
    }

    // Generamos una funcion para que traiga los datos del Pokemon seleccionado.
    function fetchPokemonDetails(pokemonUrl) {
        return fetch(pokemonUrl)
            .then(response => response.json())
            .then(data => ({
                imageUrl: data.sprites.front_default,
                weight: data.weight / 10, // Convertimos las medidas de peso del pokemon.
                height: data.height / 10 // Convertimos las medidas de altura del pokemon.
            }))
            .catch(error => {
                console.error("Error al realizar fetch de los detalles del Pokémon:", error);
            });
    }

    // Mediante la funcion traemos la imagen del Pokemon seleccionado.
    function displayPokemonImage(imageUrl) {
        imgContainer.innerHTML = ''; // Limpiamos cualquier imagen anterior.
        if (imageUrl) {
            const imgElement = document.createElement("img");
            imgElement.src = imageUrl;
            imgElement.alt = "Pokemon Image";
            imgContainer.appendChild(imgElement);
        } else {
            imgContainer.textContent = 'No hay imagen disponible';
        }
    }

    // Mostramos los detalles del Pokemon.
    function displayPokemonStats(weight, height) {
        statsContainer.innerHTML = ''; // Limpiamos cualquier estadistica anterior.
        const weightElement = document.createElement("p");
        weightElement.classList.add("text_superior");
        weightElement.textContent = `${weight.toFixed(1)} kg`; // Formateamos el peso a un decimal.
        const heightElement = document.createElement("p");
        heightElement.classList.add("text_inferior");
        heightElement.textContent = `${height.toFixed(1)} m`; // Formateamos la altura a un decimal.
        statsContainer.appendChild(weightElement);
        statsContainer.appendChild(heightElement);
    }

    // Actualizamos la visibilidad de los titulos.
    function updateVisibility()    {
        textsContainer.innerHTML = '';
        const h2Element = document.createElement("h2");
        h2Element.textContent = "Peso:";
        const h3Element = document.createElement("h3");
        h3Element.textContent = "Altura:";
        textsContainer.appendChild(h2Element);
        textsContainer.appendChild(h3Element);
    }

    // Reseteamos la informacion del Pokemon en caso de volver a seleccionar "selecione un pokemon".
    function resetPokemonInfo() {
        statsContainer.innerHTML = '';
        textsContainer.innerHTML = '';

        imgContainer.innerHTML = '';
        const imgElement = document.createElement("img");
        imgElement.src = "./multimedia/pikachu.png";
        imgElement.alt = "Pokemon Image";
        imgContainer.appendChild(imgElement);
    }

    // Generamos evento correspondiente para aplicar en cada caso del "Select".
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

    // Obtenemos la lista de Pokemon desde el localStorage si es que existe, de lo contrario, lo obtenemos desde la API.
    let pokemonList = getFromLocalStorage(localStorageKey);

    if (pokemonList) {
        // Si tenemos datos en localStorage, usamos dichos datos.
        populateSelect(pokemonList);
    } else {
        // Si no hay datos, se accede a la API y los almacena.
        fetchPokemonList().then(fetchedPokemonList => {
            if (fetchedPokemonList) {
                populateSelect(fetchedPokemonList);
            }
        });
    }
});