const main = document.querySelector('main');
const dispGrid = document.querySelector('.display-style span:nth-of-type(1)');
const dispList = document.querySelector('.display-style span:nth-of-type(2)');
const searchBar = document.getElementById('searchBar');
const btnSearch = document.getElementById('btnSearch');
const pokemonBox = document.getElementById('pokemonBox');
const imgSelectedPokemon = document.getElementById('imgSelectedPokemon');
const pokemonInfoBox = document.getElementById('pokemonInfoBox');
const infoCard = document.getElementById('infoCard');
const defaultPhrase = document.getElementById('defaultPhrase');
const pokemonInfos = document.getElementById('pokemonInfos');
const selectedPokemonName = document.getElementById('selectedPokemonName');
const selectedPokemonNumer = document.getElementById('selectedPokemonNumer');
const selectedPokemonTypeBox = document.getElementById(
  'selectedPokemonTypeBox'
);
const selectedPokemonDescription = document.getElementById(
  'selectedPokemonDescription'
);
const selectedPokemonHeight = document.getElementById('selectedPokemonHeight');
const selectedPokemonWeight = document.getElementById('selectedPokemonWeight');
const selectedPokemonAbilityBox = document.getElementById(
  'selectedPokemonAbilityBox'
);
const selectedPokemonEvolutionChain = document.getElementById(
  'selectedPokemonEvolutionChain'
);
const selType = document.getElementById('selType');
const selGen = document.getElementById('selGen');
const ckboxLegendary = document.getElementById('ckboxLegendary');
const pokemonModal = document.getElementById('pokemonModal');
const btnModalClose = document.getElementById('btnModalClose');
const infos = document.getElementById('infos');

const pokemonsArr = [];
const pokemonsSpeciesArr = [];
let pokeCount;
let searchedPokemons = [];
let pokemonModalOpened = false;

document.addEventListener('load', init());

document.addEventListener('scroll', () => {
  if (window.scrollY < 900) {
    document.getElementById('goTop').classList.add('d-none');
  }
  if (window.scrollY > 900) {
    document.getElementById('goTop').classList.remove('d-none');
  }
  switch (true) {
    case window.scrollY > main.offsetHeight * 0.95:
      document.getElementById('goDown').classList.add('d-none');
      break;
    case window.scrollY <= main.offsetHeight * 0.95:
      document.getElementById('goDown').classList.remove('d-none');
      break;
  }
});

btnSearch.addEventListener('click', () => {
  searchPokemon(true);
  searchBar.blur();
});

searchBar.addEventListener('keyup', (key) => {
  if (key.code != 'Enter') {
    searchPokemon(false);
  } else {
    searchPokemon(true);
    searchBar.blur();
  }
});

btnModalClose.addEventListener('click', (e) => {
  e.preventDefault();
  pokemonModal.classList.add('d-none');
  pokemonModalOpened = false;
});

document.addEventListener('click', (e) => {
  if (pokemonModalOpened) {
    // console.log(e.target);
    let dismiss = true;
    e.target.classList.forEach((element) => {
      if (element == 'mod') {
        dismiss = false;
      }
    });

    if (dismiss) {
      pokemonModal.classList.add('d-none');
      pokemonModalOpened = false;
    }
  }
});

function init() {
  getAllPokemonCount();
  pokemonBox.innerHTML = '';
  setTimeout(() => {
    document.getElementById('bigCol').classList.remove('hidden');
    document.getElementById('infoCol').classList.remove('hidden');
    document.getElementById('bigLoader').classList.add('d-none');
  }, 9000);
}

async function getAllPokemonCount() {
  try {
    const response = await fetch(
      'https://pokeapi.co/api/v2/pokemon?limit=10000'
    );
    const data = await response.json();
    pokeCount = data.results.length;
    getAllPokemon();
  } catch (error) {
    console.log(error);
  }
}

async function getAllPokemon() {
  for (let i = 0; i < pokeCount; i++) {
    try {
      let index;
      if (i > 1024) {
        index = i + 8976;
      } else {
        index = i + 1;
      }
      const response = await fetch(
        'https://pokeapi.co/api/v2/pokemon/' + index
      );

      const data = await response.json();
      pokemonsArr.push(data);
      getPokemonSpecies(data.species.url);

      showPokemon(data, index);
    } catch (error) {
      console.log(error);
    }
  }
}

async function getPokemonSpecies(url) {
  try {
    const response = await fetch(url);
    const data = await response.json();
    // getEvolutionChain(data.evolution_chain.url);
    pokemonsSpeciesArr.push(data);
  } catch (error) {
    console.log(error);
  }
}

async function showPokemon(pokemon, i) {
  // console.log(pokemon);
  const index = i - 8976;

  const newCol = document.createElement('div');
  newCol.classList.add('col-6', 'col-lg-4', 'd-flex', 'justify-content-center');

  const newCard = document.createElement('div');
  newCard.classList.add('card', 'position-relative');
  newCard.setAttribute(
    'onclick',
    `showInfoAbout(${pokemon.id}, "${pokemon.species.url}")`
  );

  const newImg = document.createElement('img');
  newImg.classList.add('pokeSprite');
  if (pokemon.sprites.other.home.front_default) {
    newImg.src = pokemon.sprites.other.home.front_default;
  } else if (pokemon.sprites.front_default) {
    newImg.src = pokemon.sprites.front_default;
  } else if (pokemon.sprites.other['official-artwork'].front_default) {
    newImg.src = pokemon.sprites.other['official-artwork'].front_default;
  } else {
    setTimeout(() => {
      pokemonsArr.forEach((poke) => {
        if (pokemonsSpeciesArr[index].varieties[0].pokemon.name == poke.name) {
          newImg.src = poke.sprites.front_default;
        }
      });
    }, 2000);
  }

  newImg.alt = pokemon.name;

  const newBody = document.createElement('div');
  newBody.classList.add('card-body', 'text-center', 'mt-3');

  const newNumber = document.createElement('p');
  newNumber.classList.add('card-text', 'my-1');
  newNumber.innerText = `N° ${pokemon.id}`;

  const newTitle = document.createElement('h5');
  newTitle.classList.add('card-title');
  newTitle.innerText = pokemon.name;

  const newTypeBox = document.createElement('div');
  newTypeBox.classList.add('type');
  for (let i = 0; i < pokemon.types.length; i++) {
    const newType = document.createElement('span');
    newType.innerText = pokemon.types[i].type.name;
    newType.classList.add(
      `type-${pokemon.types[i].type.name}`,
      'd-inline-block',
      'rounded-2',
      'px-2',
      'py-1',
      'm-1'
    );
    newTypeBox.appendChild(newType);
  }

  newCard.appendChild(newImg);
  newBody.appendChild(newNumber);
  newBody.appendChild(newTitle);
  newBody.appendChild(newTypeBox);
  newCard.appendChild(newBody);
  newCol.appendChild(newCard);
  pokemonBox.appendChild(newCol);
}

function showInfoAbout(num, url) {
  //---
  if (window.innerWidth < 1200) {
    useModal(num, url);
  } else {
    let index;
    if (num < 10000) {
      index = num - 1;
    } else {
      index = num - 8976;
    }

    const species = pokemonsSpeciesArr[index];
    // console.log(species);
    getEvolutionChain(species.evolution_chain.url);

    infoCard.style.animation = 'slide 4s linear forwards';

    const pokemon = pokemonsArr[index];
    // console.log(pokemon);

    setTimeout(() => {
      pokemonInfos.scrollTo(0, 0);

      if (pokemon.sprites.other.showdown.front_default) {
        imgSelectedPokemon.src = pokemon.sprites.other.showdown.front_default;
      } else if (pokemon.sprites.other.home.front_default) {
        imgSelectedPokemon.src = pokemon.sprites.other.home.front_default;
      } else if (pokemon.sprites.front_default) {
        imgSelectedPokemon.src = pokemon.sprites.front_default;
      } else if (pokemon.sprites.other['official-artwork'].front_default) {
        imgSelectedPokemon.src =
          pokemon.sprites.other['official-artwork'].front_default;
      } else {
        pokemonsArr.forEach((poke) => {
          if (
            pokemonsSpeciesArr[index].varieties[0].pokemon.name == poke.name
          ) {
            imgSelectedPokemon.src = poke.sprites.front_default;
          }
        });
      }
      imgSelectedPokemon.classList.remove('w-50');
      imgSelectedPokemon.style.height = '100px';

      defaultPhrase.setAttribute('hidden', 'true');
      pokemonInfos.classList.remove('d-none');

      selectedPokemonName.innerText = pokemon.name;
      selectedPokemonNumer.innerText = `N° ${pokemon.id}`;

      selectedPokemonTypeBox.innerHTML = '';
      for (let i = 0; i < pokemon.types.length; i++) {
        const newType = document.createElement('span');
        newType.classList.add(
          `type-${pokemon.types[i].type.name}`,
          'mx-1',
          'py-1',
          'px-2',
          'rounded-3'
        );
        newType.innerText = pokemon.types[i].type.name;

        selectedPokemonTypeBox.appendChild(newType);
      }

      let next = false;
      species.flavor_text_entries.forEach((element) => {
        if (!next) {
          if (element.language.name == 'en') {
            let phrase = element.flavor_text.split('');

            let index = phrase.indexOf('\n');
            while (index > 0) {
              phrase[index] = ' ';
              index = phrase.indexOf('\n');
            }

            index = phrase.indexOf('\f');
            while (index > 0) {
              phrase[index] = ' ';
              index = phrase.indexOf('\f');
            }

            selectedPokemonDescription.innerText = phrase.join('');

            next = true;
          }
        }
      });

      if (species.color.name != 'white') {
        pokemonInfos.style = `--color: ${species.color.name}`;
      } else {
        pokemonInfos.style = `--color: #cecece`;
      }

      selectedPokemonHeight.innerText = `${pokemon.height / 10}m`;
      selectedPokemonWeight.innerText = `${pokemon.weight / 10}kg`;

      selectedPokemonAbilityBox.innerHTML = '';
      for (let i = 0; i < Math.min(pokemon.abilities.length, 2); i++) {
        const newCol = document.createElement('div');
        newCol.classList.add('col-6');

        const newParagraph = document.createElement('p');
        newParagraph.classList.add('text-center', 'ability');
        newParagraph.innerText = pokemon.abilities[i].ability.name;

        newCol.appendChild(newParagraph);
        selectedPokemonAbilityBox.appendChild(newCol);
      }

      let total = 0;
      pokemon.stats.forEach((element) => {
        total += element.base_stat;
        switch (element.stat.name) {
          case 'hp':
            document.getElementById('selectedPokemonHp').innerText =
              element.base_stat;
            break;
          case 'attack':
            document.getElementById('selectedPokemonAttack').innerText =
              element.base_stat;
            break;
          case 'defense':
            document.getElementById('selectedPokemonDefense').innerText =
              element.base_stat;
            break;
          case 'special-attack':
            document.getElementById('selectedPokemonSpecialAttack').innerText =
              element.base_stat;
            break;
          case 'special-defense':
            document.getElementById('selectedPokemonSpecialDefense').innerText =
              element.base_stat;
            break;
          case 'speed':
            document.getElementById('selectedPokemonSpeed').innerText =
              element.base_stat;
            break;
        }
      });
      document.getElementById('selectedPokemonTotalStats').innerText = total;
    }, 1000);

    setTimeout(() => {
      infoCard.style.animation = '';
    }, 4000);
  }

  //---
}

function useModal(num, url) {
  let index;
  if (num < 10000) {
    index = num - 1;
  } else {
    index = num - 8976;
  }

  const pokemon = pokemonsArr[index];

  document.querySelector('#pokemonInfoModal .modal-title span').innerText =
    pokemon.name;
  infos.classList.add('d-none');
  pokemonModal.classList.remove('d-none');
  document
    .querySelector('#pokemonInfoModal .myModalBody .spinner-border')
    .classList.remove('d-none');

  setTimeout(() => {
    pokemonModalOpened = true;
  }, 200);

  infos.innerHTML = '';

  const species = pokemonsSpeciesArr[index];

  const newImg = document.createElement('img');

  if (pokemon.sprites.other.showdown.front_default) {
    newImg.src = pokemon.sprites.other.showdown.front_default;
  } else if (pokemon.sprites.other.home.front_default) {
    newImg.src = pokemon.sprites.other.home.front_default;
  } else if (pokemon.sprites.front_default) {
    newImg.src = pokemon.sprites.front_default;
  } else if (pokemon.sprites.other['official-artwork'].front_default) {
    newImg.src = pokemon.sprites.other['official-artwork'].front_default;
  } else {
    pokemonsArr.forEach((poke) => {
      if (pokemonsSpeciesArr[index].varieties[0].pokemon.name == poke.name) {
        newImg.src = poke.sprites.front_default;
      }
    });
  }
  newImg.classList.add('mod');
  newImg.style.height = '80px';

  const newPokemonName = document.createElement('h3');
  newPokemonName.classList.add('mod', 'pokemonName', 'fw-bold', 'mt-3');
  newPokemonName.innerText = pokemon.name;

  const newPokedexNumber = document.createElement('p');
  newPokedexNumber.classList.add('mod', 'text-muted', 'my-1');
  newPokedexNumber.innerText = `N° ${pokemon.id}`;

  const newTypeBox = document.createElement('div');
  newTypeBox.classList.add('mod');

  for (let i = 0; i < pokemon.types.length; i++) {
    const newType = document.createElement('span');
    newType.classList.add(
      'mod',
      'type',
      `type-${pokemon.types[i].type.name}`,
      'm-1',
      'py-1',
      'px-2',
      'rounded-3',
      'd-inline-block'
    );
    newType.innerText = pokemon.types[i].type.name;

    newTypeBox.appendChild(newType);
  }

  const newDescriptionTitle = document.createElement('h5');
  newDescriptionTitle.classList.add('mod', 'h6', 'fw-semibold', 'mt-2');
  newDescriptionTitle.innerText = 'Description';

  const newDescription = document.createElement('p');
  newDescription.classList.add('mod', 'pokeDescriptionModal', 'text-muted');

  let next = false;
  species.flavor_text_entries.forEach((element) => {
    if (!next) {
      if (element.language.name == 'en') {
        let phrase = element.flavor_text.split('');

        let ind = phrase.indexOf('\n');
        while (ind > 0) {
          phrase[ind] = ' ';
          ind = phrase.indexOf('\n');
        }

        ind = phrase.indexOf('\f');
        while (ind > 0) {
          phrase[ind] = ' ';
          ind = phrase.indexOf('\f');
        }

        newDescription.innerText = phrase.join('');

        next = true;
      }
    }
  });

  if (species.color.name != 'white') {
    infos.style = `--color: ${species.color.name}`;
  } else {
    infos.style = `--color: #cecece`;
  }

  const newPhysicBox = document.createElement('div');
  newPhysicBox.classList.add('mod', 'row', 'w-100');

  const newHeightCol = document.createElement('div');
  newHeightCol.classList.add('mod', 'col-6');
  const newHeightTitle = document.createElement('p');
  newHeightTitle.classList.add('mod', 'text-center', 'fw-semibold', 'mb-2');
  newHeightTitle.innerText = 'Height';

  const newHeightValue = document.createElement('p');
  newHeightValue.classList.add('mod', 'text-center', 'physical');
  newHeightValue.innerText = `${pokemon.height / 10}m`;

  newHeightCol.appendChild(newHeightTitle);
  newHeightCol.appendChild(newHeightValue);
  newPhysicBox.appendChild(newHeightCol);

  const newWeightCol = document.createElement('div');
  newWeightCol.classList.add('mod', 'col-6');
  const newWeightTitle = document.createElement('p');
  newWeightTitle.classList.add('mod', 'text-center', 'fw-semibold', 'mb-2');
  newWeightTitle.innerText = 'Weight';

  const newWeightValue = document.createElement('p');
  newWeightValue.classList.add('mod', 'text-center', 'physical');
  newWeightValue.innerText = `${pokemon.weight / 10}kg`;

  newWeightCol.appendChild(newWeightTitle);
  newWeightCol.appendChild(newWeightValue);
  newPhysicBox.appendChild(newWeightCol);

  const newAbilityTitle = document.createElement('h5');
  newAbilityTitle.classList.add('mod', 'h6', 'fw-semibold', 'mt-2');
  newAbilityTitle.innerText = 'Abilities';

  const newAbilityBox = document.createElement('div');
  newAbilityBox.classList.add('mod', 'row', 'w-100');

  for (let i = 0; i < Math.min(pokemon.abilities.length, 2); i++) {
    const newCol = document.createElement('div');
    newCol.classList.add('mod', 'col-6');

    const newParagraph = document.createElement('p');
    newParagraph.classList.add('mod', 'text-center', 'ability');
    newParagraph.innerText = pokemon.abilities[i].ability.name;

    newCol.appendChild(newParagraph);
    newAbilityBox.appendChild(newCol);
  }

  const newStatsBox = document.createElement('div');
  newStatsBox.classList.add('mod', 'stats', 'w-100');

  const newStatsTitle = document.createElement('h5');
  newStatsTitle.classList.add('mod', 'text-center');
  newStatsTitle.innerText = 'Stats';
  newStatsBox.appendChild(newStatsTitle);

  const newStatsValuesBox = document.createElement('div');
  newStatsValuesBox.classList.add(
    'mod',
    'statsValues',
    'd-flex',
    'justify-content-around',
    'w-100'
  );

  const statsName = ['HP', 'ATK', 'DEF', 'SpA', 'SpD', 'SPD'];
  const statsClass = [
    'hp',
    'attack',
    'defense',
    'specialAttack',
    'specialDefense',
    'speed',
  ];

  let total = 0;
  for (let j = 0; j < pokemon.stats.length; j++) {
    total += pokemon.stats[j].base_stat;

    const newStatDiv = document.createElement('div');
    newStatDiv.classList.add('mod', 'text-center', 'rounded-5', 'statValue');

    const newSpanValueTitle = document.createElement('span');
    newSpanValueTitle.classList.add(
      'mod',
      'd-block',
      'circularBorder',
      `${statsClass[j]}`,
      'd-flex',
      'justify-content-center',
      'align-items-center'
    );
    newSpanValueTitle.innerText = statsName[j];

    const newSpanValue = document.createElement('span');
    newSpanValue.classList.add('mod', 'd-block', 'circularBorder');
    newSpanValue.innerText = pokemon.stats[j].base_stat;
    newSpanValue.style.fontSize = '0.8em';

    newStatDiv.appendChild(newSpanValueTitle);
    newStatDiv.appendChild(newSpanValue);
    newStatsValuesBox.appendChild(newStatDiv);
  }

  const newStatDiv = document.createElement('div');
  newStatDiv.classList.add(
    'mod',
    'text-center',
    'rounded-5',
    'statValue',
    'statTotal'
  );

  const newSpanTotalTitle = document.createElement('span');
  newSpanTotalTitle.classList.add(
    'mod',
    'd-block',
    'circularBorder',
    'total',
    'd-flex',
    'justify-content-center',
    'align-items-center'
  );
  newSpanTotalTitle.innerText = 'TOT';

  const newSpanTotal = document.createElement('span');
  newSpanTotal.classList.add('mod', 'd-block', 'circularBorder');
  newSpanTotal.innerText = total;
  newSpanTotal.style.fontSize = '0.9em';

  newStatDiv.appendChild(newSpanTotalTitle);
  newStatDiv.appendChild(newSpanTotal);
  newStatsValuesBox.appendChild(newStatDiv);

  const newEvolutionDiv = document.createElement('div');
  newEvolutionDiv.classList.add('mod', 'w-100', 'mt-3');

  const newEvolutionTitle = document.createElement('h5');
  newEvolutionTitle.classList.add(
    'mod',
    'text-center',
    'h6',
    'fw-semibold',
    'mt-2'
  );
  newEvolutionTitle.innerText = 'Evolution Chain';
  newEvolutionDiv.appendChild(newEvolutionTitle);

  const newEvolutionChainDiv = document.createElement('div');
  newEvolutionChainDiv.classList.add(
    'mod',
    'd-flex',
    'justify-content-around',
    'align-items-center',
    'w-100'
  );
  newEvolutionChainDiv.id = 'modalEvolutionChainDiv';

  getEvolutionChain(species.evolution_chain.url, 'modal');

  infos.appendChild(newImg);
  infos.appendChild(newPokemonName);
  infos.appendChild(newPokedexNumber);
  infos.appendChild(newTypeBox);
  infos.appendChild(newDescriptionTitle);
  infos.appendChild(newDescription);
  infos.appendChild(newPhysicBox);
  infos.appendChild(newAbilityTitle);
  infos.appendChild(newAbilityBox);
  infos.appendChild(newStatsValuesBox);
  newEvolutionDiv.appendChild(newEvolutionChainDiv);
  infos.appendChild(newEvolutionDiv);

  setTimeout(() => {
    document
      .querySelector('#pokemonInfoModal .myModalBody .spinner-border')
      .classList.add('d-none');
    infos.classList.remove('d-none');
    infos.scrollTo(0, 0);
  }, 3000);
}

async function getEvolutionChain(url, target) {
  try {
    const response = await fetch(url);
    const data = await response.json();
    // console.log(data);
    if (target == 'modal') {
      showModalEvolutionChain(data);
    } else {
      showEvolutionChain(data);
    }
  } catch (error) {
    console.log(error);
  }
}

async function showEvolutionChain(evolutions) {
  let chain = 1;
  let evolution1 = await getMyPokemon(evolutions.chain.species.url);
  let evolution2;
  let evolution3;
  const evolution1Img = document.createElement('img');
  const evolution2Img = document.createElement('img');
  const evolution3Img = document.createElement('img');
  const evolutionImgs = [evolution1Img, evolution2Img, evolution3Img];
  const lbl1 = document.createElement('span');
  let lbl2 = document.createElement('span');
  const labels = [lbl1, lbl2];

  evolutionImgs.forEach((img) => {
    img.classList.add('d-inline-block', 'evolutionImg');
  });

  labels.forEach((label) => {
    label.classList.add('d-inline-block', 'level');
  });

  evolution1Img.src = evolution1.sprites.front_default;
  evolution1Img.setAttribute(
    'onclick',
    `showInfoAbout(${evolution1.id}, "${evolution1.species.url}")`
  );

  if (evolutions.chain.evolves_to.length > 0) {
    chain++;
    evolution2 = await getMyPokemon(evolutions.chain.evolves_to[0].species.url);
    evolution2Img.src = evolution2.sprites.front_default;
    evolution2Img.setAttribute(
      'onclick',
      `showInfoAbout(${evolution2.id}, "${evolution2.species.url}")`
    );
    if (evolutions.chain.evolves_to[0].evolution_details[0].min_level) {
      lbl1.innerText = `Lv. ${evolutions.chain.evolves_to[0].evolution_details[0].min_level}`;
    } else if (
      evolutions.chain.evolves_to[0].evolution_details[0].trigger.name ==
      'use-item'
    ) {
      lbl1.innerText = `Item`;
      lbl1.setAttribute('data-bs-toggle', 'popover');
      lbl1.setAttribute('data-bs-trigger', 'hover focus');
      lbl1.setAttribute('data-bs-placement', 'bottom');
      lbl1.setAttribute(
        'data-bs-content',
        `${evolutions.chain.evolves_to[0].evolution_details[0].item.name}`
      );
      lbl1.style.cursor = 'pointer';
    } else {
      lbl1.innerText = 'Lv. ???';
    }

    if (evolutions.chain.evolves_to[0].evolves_to.length > 0) {
      chain++;
      evolution3 = await getMyPokemon(
        evolutions.chain.evolves_to[0].evolves_to[0].species.url
      );
      evolution3Img.src = evolution3.sprites.front_default;
      evolution3Img.setAttribute(
        'onclick',
        `showInfoAbout(${evolution3.id}, "${evolution3.species.url}")`
      );
      if (
        evolutions.chain.evolves_to[0].evolves_to[0].evolution_details[0]
          .min_level
      ) {
        lbl2.innerText = `Lv. ${evolutions.chain.evolves_to[0].evolves_to[0].evolution_details[0].min_level}`;
      } else if (
        evolutions.chain.evolves_to[0].evolves_to[0].evolution_details[0]
          .trigger.name == 'use-item'
      ) {
        lbl2.innerText = 'Item';
        lbl2.setAttribute('data-bs-toggle', 'popover');
        lbl2.setAttribute('data-bs-trigger', 'hover');
        lbl2.setAttribute('data-bs-placement', 'bottom');
        lbl2.setAttribute(
          'data-bs-content',
          `${evolutions.chain.evolves_to[0].evolves_to[0].evolution_details[0].item.name}`
        );
        lbl2.style.cursor = 'pointer';
      } else {
        lbl2.innerText = 'Lv. ???';
      }
    }
  }

  selectedPokemonEvolutionChain.innerHTML = '';

  switch (chain) {
    case 1:
      selectedPokemonEvolutionChain.appendChild(evolution1Img);
      break;
    case 2:
      selectedPokemonEvolutionChain.appendChild(evolution1Img);
      selectedPokemonEvolutionChain.appendChild(lbl1);
      selectedPokemonEvolutionChain.appendChild(evolution2Img);
      break;
    case 3:
      selectedPokemonEvolutionChain.appendChild(evolution1Img);
      selectedPokemonEvolutionChain.appendChild(lbl1);
      selectedPokemonEvolutionChain.appendChild(evolution2Img);
      selectedPokemonEvolutionChain.appendChild(lbl2);
      selectedPokemonEvolutionChain.appendChild(evolution3Img);
      break;
  }

  const popoverTriggerList = document.querySelectorAll(
    '[data-bs-toggle="popover"]'
  );
  const popoverList = [...popoverTriggerList].map(
    (popoverTriggerEl) => new bootstrap.Popover(popoverTriggerEl)
  );
}

async function showModalEvolutionChain(evolutions) {
  let chain = 1;
  let evolution1 = await getMyPokemon(evolutions.chain.species.url);
  let evolution2;
  let evolution3;
  const evolution1Img = document.createElement('img');
  const evolution2Img = document.createElement('img');
  const evolution3Img = document.createElement('img');
  const evolutionImgs = [evolution1Img, evolution2Img, evolution3Img];
  const lbl1 = document.createElement('span');
  let lbl2 = document.createElement('span');
  const labels = [lbl1, lbl2];

  evolutionImgs.forEach((img) => {
    img.classList.add('mod', 'd-inline-block', 'evolutionImg');
  });

  labels.forEach((label) => {
    label.classList.add('mod', 'd-inline-block', 'level');
  });

  evolution1Img.src = evolution1.sprites.front_default;
  evolution1Img.setAttribute(
    'onclick',
    `showInfoAbout(${evolution1.id}, "${evolution1.species.url}")`
  );

  if (evolutions.chain.evolves_to.length > 0) {
    chain++;
    evolution2 = await getMyPokemon(evolutions.chain.evolves_to[0].species.url);
    evolution2Img.src = evolution2.sprites.front_default;
    evolution2Img.setAttribute(
      'onclick',
      `showInfoAbout(${evolution2.id}, "${evolution2.species.url}")`
    );
    if (evolutions.chain.evolves_to[0].evolution_details[0].min_level) {
      lbl1.innerText = `Lv. ${evolutions.chain.evolves_to[0].evolution_details[0].min_level}`;
    } else if (
      evolutions.chain.evolves_to[0].evolution_details[0].trigger.name ==
      'use-item'
    ) {
      lbl1.innerText = `Item`;
      lbl1.setAttribute('data-bs-toggle', 'popover');
      lbl1.setAttribute('data-bs-trigger', 'hover focus');
      lbl1.setAttribute('data-bs-placement', 'bottom');
      lbl1.setAttribute(
        'data-bs-content',
        `${evolutions.chain.evolves_to[0].evolution_details[0].item.name}`
      );
      lbl1.style.cursor = 'pointer';
    } else {
      lbl1.innerText = 'Lv. ???';
    }

    if (evolutions.chain.evolves_to[0].evolves_to.length > 0) {
      chain++;
      evolution3 = await getMyPokemon(
        evolutions.chain.evolves_to[0].evolves_to[0].species.url
      );
      evolution3Img.src = evolution3.sprites.front_default;
      evolution3Img.setAttribute(
        'onclick',
        `showInfoAbout(${evolution3.id}, "${evolution3.species.url}")`
      );
      if (
        evolutions.chain.evolves_to[0].evolves_to[0].evolution_details[0]
          .min_level
      ) {
        lbl2.innerText = `Lv. ${evolutions.chain.evolves_to[0].evolves_to[0].evolution_details[0].min_level}`;
      } else if (
        evolutions.chain.evolves_to[0].evolves_to[0].evolution_details[0]
          .trigger.name == 'use-item'
      ) {
        lbl2.innerText = 'Item';
        lbl2.setAttribute('data-bs-toggle', 'popover');
        lbl2.setAttribute('data-bs-trigger', 'hover');
        lbl2.setAttribute('data-bs-placement', 'bottom');
        lbl2.setAttribute(
          'data-bs-content',
          `${evolutions.chain.evolves_to[0].evolves_to[0].evolution_details[0].item.name}`
        );
        lbl2.style.cursor = 'pointer';
      } else {
        lbl2.innerText = 'Lv. ???';
      }
    }
  }

  const modalEvolutionChainDiv = document.getElementById(
    'modalEvolutionChainDiv'
  );
  switch (chain) {
    case 1:
      modalEvolutionChainDiv.appendChild(evolution1Img);
      break;
    case 2:
      modalEvolutionChainDiv.appendChild(evolution1Img);
      modalEvolutionChainDiv.appendChild(lbl1);
      modalEvolutionChainDiv.appendChild(evolution2Img);
      break;
    case 3:
      modalEvolutionChainDiv.appendChild(evolution1Img);
      modalEvolutionChainDiv.appendChild(lbl1);
      modalEvolutionChainDiv.appendChild(evolution2Img);
      modalEvolutionChainDiv.appendChild(lbl2);
      modalEvolutionChainDiv.appendChild(evolution3Img);
      break;
  }

  const popoverTriggerList = document.querySelectorAll(
    '[data-bs-toggle="popover"]'
  );
  const popoverList = [...popoverTriggerList].map(
    (popoverTriggerEl) => new bootstrap.Popover(popoverTriggerEl)
  );
}

async function getMyPokemon(url) {
  try {
    const response = await fetch(url);
    const data = await response.json();
    let myPokemon = await getSinglePokemon(data.varieties[0].pokemon.url);

    return myPokemon;
  } catch (error) {
    console.log(error);
  }
}

async function getSinglePokemon(url) {
  try {
    const response = await fetch(url);
    const data = await response.json();

    return data;
  } catch (error) {
    console.log(error);
  }
}

function searchPokemon(clean) {
  searchedPokemons = [];
  for (let i = 0; i < pokemonsArr.length; i++) {
    if (
      pokemonsArr[i].name.indexOf(searchBar.value.trim().toLowerCase()) >= 0
    ) {
      switch (true) {
        case selType.value != '' && selGen.value != '':
          pokemonsArr[i].types.forEach((type) => {
            if (
              type.type.name == selType.value &&
              pokemonsSpeciesArr[i].generation.name == selGen.value
            ) {
              if (ckboxLegendary.checked) {
                if (pokemonsSpeciesArr[i].is_legendary) {
                  searchedPokemons.push(pokemonsArr[i]);
                }
              } else {
                searchedPokemons.push(pokemonsArr[i]);
              }
            }
          });
          break;
        case selType.value != '':
          pokemonsArr[i].types.forEach((type) => {
            if (type.type.name == selType.value) {
              if (ckboxLegendary.checked) {
                if (pokemonsSpeciesArr[i].is_legendary) {
                  searchedPokemons.push(pokemonsArr[i]);
                }
              } else {
                searchedPokemons.push(pokemonsArr[i]);
              }
            }
          });
          break;
        case selGen.value != '':
          if (pokemonsSpeciesArr[i].generation.name == selGen.value) {
            if (ckboxLegendary.checked) {
              if (pokemonsSpeciesArr[i].is_legendary) {
                searchedPokemons.push(pokemonsArr[i]);
              }
            } else {
              searchedPokemons.push(pokemonsArr[i]);
            }
          }
          break;
        default:
          if (ckboxLegendary.checked) {
            if (pokemonsSpeciesArr[i].is_legendary) {
              searchedPokemons.push(pokemonsArr[i]);
            }
          } else {
            searchedPokemons.push(pokemonsArr[i]);
          }
          break;
      }
    }
  }
  showSearchedPokemon(searchedPokemons);
  if (clean) {
    searchBar.value = '';
    selType.value = '';
    selGen.value = '';
    ckboxLegendary.checked = false;
  }
}

function showSearchedPokemon(pokemons) {
  if (pokemons.length > 0) {
    pokemonBox.innerHTML = '';
    pokemons.forEach((pokemon) => {
      showPokemon(pokemon, pokemon.id);
    });
  }
}
