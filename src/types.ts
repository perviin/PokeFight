export interface Pokemon {
  id: number;
  name: string;
  frenchName: string;
  level: number;
  sprites: {
    front_default: string;
    back_default: string;
  };
  stats: {
    base_stat: number;
    stat: {
      name: string;
    };
  }[];
  types: {
    type: {
      name: string;
    };
  }[];
  moves: PokemonMove[];
  selectedMoves: Move[];
}

export interface PokemonMove {
  move: {
    name: string;
    url: string;
  };
  version_group_details: {
    level_learned_at: number;
    move_learn_method: {
      name: string;
    };
  }[];
}

export interface Move {
  name: string;
  frenchName: string;
  power: number;
  accuracy: number;
  type: string;
  levelLearned: number;
}

export interface GameState {
  screen: 'title' | 'selection' | 'battle' | 'stats';
  selectedPokemon: [Pokemon | null, Pokemon | null];
  battleHistory: BattleRecord[];
  currentPokemonIndex: number;
}

export interface BattleRecord {
  winner: string;
  loser: string;
  date: string;
}

export interface TypeEffectiveness {
  [key: string]: {
    [key: string]: number;
  };
}

export const TYPE_EFFECTIVENESS: TypeEffectiveness = {
  normal: {
    rock: 0.5,
    ghost: 0,
    steel: 0.5
  },
  fire: {
    fire: 0.5,
    water: 0.5,
    grass: 2,
    ice: 2,
    bug: 2,
    rock: 0.5,
    dragon: 0.5,
    steel: 2
  },
  water: {
    fire: 2,
    water: 0.5,
    grass: 0.5,
    ground: 2,
    rock: 2,
    dragon: 0.5
  },
  electric: {
    water: 2,
    electric: 0.5,
    grass: 0.5,
    ground: 0,
    flying: 2,
    dragon: 0.5
  },
  grass: {
    fire: 0.5,
    water: 2,
    grass: 0.5,
    poison: 0.5,
    ground: 2,
    flying: 0.5,
    bug: 0.5,
    rock: 2,
    dragon: 0.5,
    steel: 0.5
  },
  ice: {
    fire: 0.5,
    water: 0.5,
    grass: 2,
    ice: 0.5,
    ground: 2,
    flying: 2,
    dragon: 2,
    steel: 0.5
  },
  fighting: {
    normal: 2,
    ice: 2,
    poison: 0.5,
    flying: 0.5,
    psychic: 0.5,
    bug: 0.5,
    rock: 2,
    ghost: 0,
    dark: 2,
    steel: 2,
    fairy: 0.5
  },
  poison: {
    grass: 2,
    poison: 0.5,
    ground: 0.5,
    rock: 0.5,
    ghost: 0.5,
    steel: 0,
    fairy: 2
  },
  ground: {
    fire: 2,
    electric: 2,
    grass: 0.5,
    poison: 2,
    flying: 0,
    bug: 0.5,
    rock: 2,
    steel: 2
  },
  flying: {
    electric: 0.5,
    grass: 2,
    fighting: 2,
    bug: 2,
    rock: 0.5,
    steel: 0.5
  },
  psychic: {
    fighting: 2,
    poison: 2,
    psychic: 0.5,
    dark: 0,
    steel: 0.5
  },
  bug: {
    fire: 0.5,
    grass: 2,
    fighting: 0.5,
    poison: 0.5,
    flying: 0.5,
    psychic: 2,
    ghost: 0.5,
    dark: 2,
    steel: 0.5,
    fairy: 0.5
  },
  rock: {
    fire: 2,
    ice: 2,
    fighting: 0.5,
    ground: 0.5,
    flying: 2,
    bug: 2,
    steel: 0.5
  },
  ghost: {
    normal: 0,
    psychic: 2,
    ghost: 2,
    dark: 0.5
  },
  dragon: {
    dragon: 2,
    steel: 0.5,
    fairy: 0
  },
  dark: {
    fighting: 0.5,
    psychic: 2,
    ghost: 2,
    dark: 0.5,
    fairy: 0.5
  },
  steel: {
    fire: 0.5,
    water: 0.5,
    electric: 0.5,
    ice: 2,
    rock: 2,
    steel: 0.5,
    fairy: 2
  },
  fairy: {
    fire: 0.5,
    fighting: 2,
    poison: 0.5,
    dragon: 2,
    dark: 2,
    steel: 0.5
  }
};