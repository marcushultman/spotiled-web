export const FIXTURE = {
  get: "fixtures",
  parameters: { league: "4", season: "2024", live: "all" },
  errors: [],
  results: 1,
  paging: { current: 1, total: 1 },
  response: [
    {
      fixture: {
        id: 1219959,
        referee: "Michael Oliver, England",
        timezone: "UTC",
        date: "2024-07-05T19:00:00+00:00",
        timestamp: 1720206000,
        periods: { first: 1720206000, second: null },
        venue: { id: 720, name: "Volksparkstadion", city: "Hamburg" },
        status: { long: "First Half", short: "1H", elapsed: 25 },
      },
      league: {
        id: 4,
        name: "Euro Championship",
        country: "World",
        logo: "https://media.api-sports.io/football/leagues/4.png",
        flag: null,
        season: 2024,
        round: "Quarter-finals",
      },
      teams: {
        home: {
          id: 27,
          name: "Portugal",
          logo: "https://media.api-sports.io/football/teams/27.png",
          winner: null,
        },
        away: {
          id: 2,
          name: "France",
          logo: "https://media.api-sports.io/football/teams/2.png",
          winner: null,
        },
      },
      goals: { home: 0, away: 0 },
      score: {
        halftime: { home: 0, away: 0 },
        fulltime: { home: null, away: null },
        extratime: { home: null, away: null },
        penalty: { home: null, away: null },
      },
      events: [],
    },
  ],
};

export const FIXTURES = {
  get: "fixtures",
  parameters: { league: "4", season: "2024", from: "2024-07-02", to: "2024-07-16" },
  errors: [],
  results: 8,
  paging: { current: 1, total: 1 },
  response: [
    {
      fixture: {
        id: 1215077,
        referee: "F. Zwayer",
        timezone: "UTC",
        date: "2024-07-02T16:00:00+00:00",
        timestamp: 1719936000,
        periods: { first: 1719936000, second: 1719939600 },
        venue: { id: 20732, name: "Fußball Arena München", city: "München" },
        status: { long: "Match Finished", short: "FT", elapsed: 90 },
      },
      league: {
        id: 4,
        name: "Euro Championship",
        country: "World",
        logo: "https://media.api-sports.io/football/leagues/4.png",
        flag: null,
        season: 2024,
        round: "Round of 16",
      },
      teams: {
        home: {
          id: 774,
          name: "Romania",
          logo: "https://media.api-sports.io/football/teams/774.png",
          winner: false,
        },
        away: {
          id: 1118,
          name: "Netherlands",
          logo: "https://media.api-sports.io/football/teams/1118.png",
          winner: true,
        },
      },
      goals: { home: 0, away: 3 },
      score: {
        halftime: { home: 0, away: 1 },
        fulltime: { home: 0, away: 3 },
        extratime: { home: null, away: null },
        penalty: { home: null, away: null },
      },
    },
    {
      fixture: {
        id: 1215078,
        referee: "Artur Soares Dias",
        timezone: "UTC",
        date: "2024-07-02T19:00:00+00:00",
        timestamp: 1719946800,
        periods: { first: 1719946800, second: 1719950400 },
        venue: { id: 20737, name: "Leipzig Stadium", city: "Leipzig" },
        status: { long: "Match Finished", short: "FT", elapsed: 90 },
      },
      league: {
        id: 4,
        name: "Euro Championship",
        country: "World",
        logo: "https://media.api-sports.io/football/leagues/4.png",
        flag: null,
        season: 2024,
        round: "Round of 16",
      },
      teams: {
        home: {
          id: 775,
          name: "Austria",
          logo: "https://media.api-sports.io/football/teams/775.png",
          winner: false,
        },
        away: {
          id: 777,
          name: "Türkiye",
          logo: "https://media.api-sports.io/football/teams/777.png",
          winner: true,
        },
      },
      goals: { home: 1, away: 2 },
      score: {
        halftime: { home: 0, away: 1 },
        fulltime: { home: 1, away: 2 },
        extratime: { home: null, away: null },
        penalty: { home: null, away: null },
      },
    },
    {
      fixture: {
        id: 1219688,
        referee: "A. Taylor",
        timezone: "UTC",
        date: "2024-07-05T16:00:00+00:00",
        timestamp: 1720195200,
        periods: { first: 1720195200, second: 1720198800 },
        venue: { id: 20739, name: "Stuttgart Arena", city: "Stuttgart" },
        status: { long: "Match Finished", short: "AET", elapsed: 120 },
      },
      league: {
        id: 4,
        name: "Euro Championship",
        country: "World",
        logo: "https://media.api-sports.io/football/leagues/4.png",
        flag: null,
        season: 2024,
        round: "Quarter-finals",
      },
      teams: {
        home: {
          id: 9,
          name: "Spain",
          logo: "https://media.api-sports.io/football/teams/9.png",
          winner: true,
        },
        away: {
          id: 25,
          name: "Germany",
          logo: "https://media.api-sports.io/football/teams/25.png",
          winner: false,
        },
      },
      goals: { home: 2, away: 1 },
      score: {
        halftime: { home: 0, away: 0 },
        fulltime: { home: 1, away: 1 },
        extratime: { home: 1, away: 0 },
        penalty: { home: null, away: null },
      },
    },
    {
      fixture: {
        id: 1219689,
        referee: "D. Orsato",
        timezone: "UTC",
        date: "2024-07-06T16:00:00+00:00",
        timestamp: 1720281600,
        periods: { first: 1720281600, second: 1720285200 },
        venue: { id: 20735, name: "Düsseldorf Arena", city: "Düsseldorf" },
        status: { long: "Match Finished", short: "PEN", elapsed: 120 },
      },
      league: {
        id: 4,
        name: "Euro Championship",
        country: "World",
        logo: "https://media.api-sports.io/football/leagues/4.png",
        flag: null,
        season: 2024,
        round: "Quarter-finals",
      },
      teams: {
        home: {
          id: 10,
          name: "England",
          logo: "https://media.api-sports.io/football/teams/10.png",
          winner: true,
        },
        away: {
          id: 15,
          name: "Switzerland",
          logo: "https://media.api-sports.io/football/teams/15.png",
          winner: false,
        },
      },
      goals: { home: 1, away: 1 },
      score: {
        halftime: { home: 0, away: 0 },
        fulltime: { home: 1, away: 1 },
        extratime: { home: 0, away: 0 },
        penalty: { home: 5, away: 3 },
      },
    },
    {
      fixture: {
        id: 1219959,
        referee: "M. Oliver",
        timezone: "UTC",
        date: "2024-07-05T19:00:00+00:00",
        timestamp: 1720206000,
        periods: { first: 1720206000, second: 1720209600 },
        venue: { id: 720, name: "Volksparkstadion", city: "Hamburg" },
        status: { long: "Match Finished", short: "PEN", elapsed: 120 },
      },
      league: {
        id: 4,
        name: "Euro Championship",
        country: "World",
        logo: "https://media.api-sports.io/football/leagues/4.png",
        flag: null,
        season: 2024,
        round: "Quarter-finals",
      },
      teams: {
        home: {
          id: 27,
          name: "Portugal",
          logo: "https://media.api-sports.io/football/teams/27.png",
          winner: false,
        },
        away: {
          id: 2,
          name: "France",
          logo: "https://media.api-sports.io/football/teams/2.png",
          winner: true,
        },
      },
      goals: { home: 0, away: 0 },
      score: {
        halftime: { home: 0, away: 0 },
        fulltime: { home: 0, away: 0 },
        extratime: { home: 0, away: 0 },
        penalty: { home: 3, away: 5 },
      },
    },
    {
      fixture: {
        id: 1220308,
        referee: "C. Turpin",
        timezone: "UTC",
        date: "2024-07-06T19:00:00+00:00",
        timestamp: 1720292400,
        periods: { first: 1720292400, second: 1720296000 },
        venue: { id: 694, name: "Olympiastadion Berlin", city: "Berlin" },
        status: { long: "Match Finished", short: "FT", elapsed: 90 },
      },
      league: {
        id: 4,
        name: "Euro Championship",
        country: "World",
        logo: "https://media.api-sports.io/football/leagues/4.png",
        flag: null,
        season: 2024,
        round: "Quarter-finals",
      },
      teams: {
        home: {
          id: 1118,
          name: "Netherlands",
          logo: "https://media.api-sports.io/football/teams/1118.png",
          winner: true,
        },
        away: {
          id: 777,
          name: "Türkiye",
          logo: "https://media.api-sports.io/football/teams/777.png",
          winner: false,
        },
      },
      goals: { home: 2, away: 1 },
      score: {
        halftime: { home: 0, away: 1 },
        fulltime: { home: 2, away: 1 },
        extratime: { home: null, away: null },
        penalty: { home: null, away: null },
      },
    },
    {
      fixture: {
        id: 1225853,
        referee: null,
        timezone: "UTC",
        date: "2024-07-09T19:00:00+00:00",
        timestamp: 1720551600,
        periods: { first: null, second: null },
        venue: { id: 20732, name: "Fußball Arena München", city: "München" },
        status: { long: "Not Started", short: "NS", elapsed: null },
      },
      league: {
        id: 4,
        name: "Euro Championship",
        country: "World",
        logo: "https://media.api-sports.io/football/leagues/4.png",
        flag: null,
        season: 2024,
        round: "Semi-finals",
      },
      teams: {
        home: {
          id: 9,
          name: "Spain",
          logo: "https://media.api-sports.io/football/teams/9.png",
          winner: null,
        },
        away: {
          id: 2,
          name: "France",
          logo: "https://media.api-sports.io/football/teams/2.png",
          winner: null,
        },
      },
      goals: { home: null, away: null },
      score: {
        halftime: { home: null, away: null },
        fulltime: { home: null, away: null },
        extratime: { home: null, away: null },
        penalty: { home: null, away: null },
      },
    },
    {
      fixture: {
        id: 1227539,
        referee: null,
        timezone: "UTC",
        date: "2024-07-10T19:00:00+00:00",
        timestamp: 1720638000,
        periods: { first: null, second: null },
        venue: { id: 20733, name: "BVB Stadion Dortmund", city: "Dortmund" },
        status: { long: "Not Started", short: "NS", elapsed: null },
      },
      league: {
        id: 4,
        name: "Euro Championship",
        country: "World",
        logo: "https://media.api-sports.io/football/leagues/4.png",
        flag: null,
        season: 2024,
        round: "Semi-finals",
      },
      teams: {
        home: {
          id: 1118,
          name: "Netherlands",
          logo: "https://media.api-sports.io/football/teams/1118.png",
          winner: null,
        },
        away: {
          id: 10,
          name: "England",
          logo: "https://media.api-sports.io/football/teams/10.png",
          winner: null,
        },
      },
      goals: { home: null, away: null },
      score: {
        halftime: { home: null, away: null },
        fulltime: { home: null, away: null },
        extratime: { home: null, away: null },
        penalty: { home: null, away: null },
      },
    },
  ],
};

export const LINEUP = {
  "get": "fixtures/lineups",
  "parameters": {
    "fixture": "1219959",
  },
  "errors": [],
  "results": 2,
  "paging": {
    "current": 1,
    "total": 1,
  },
  "response": [
    {
      "team": {
        "id": 27,
        "name": "Portugal",
        "logo": "https://media.api-sports.io/football/teams/27.png",
        "colors": {
          "player": {
            "primary": "a81d30",
            "number": "e2bf22",
            "border": "a81d30",
          },
          "goalkeeper": {
            "primary": "e9dd0e",
            "number": "140f0f",
            "border": "e9dd0e",
          },
        },
      },
      "formation": "4-2-3-1",
      "startXI": [
        {
          "player": {
            "id": 369,
            "name": "Diogo Costa",
            "number": 22,
            "pos": "G",
            "grid": "1:1",
          },
        },
        {
          "player": {
            "id": 855,
            "name": "João Cancelo",
            "number": 20,
            "pos": "D",
            "grid": "2:4",
          },
        },
        {
          "player": {
            "id": 567,
            "name": "Rúben Dias",
            "number": 4,
            "pos": "D",
            "grid": "2:3",
          },
        },
        {
          "player": {
            "id": 373,
            "name": "Pepe",
            "number": 3,
            "pos": "D",
            "grid": "2:2",
          },
        },
        {
          "player": {
            "id": 263482,
            "name": "Nuno Mendes",
            "number": 19,
            "pos": "D",
            "grid": "2:1",
          },
        },
        {
          "player": {
            "id": 128384,
            "name": "Vitinha",
            "number": 23,
            "pos": "M",
            "grid": "3:2",
          },
        },
        {
          "player": {
            "id": 41104,
            "name": "João Palhinha",
            "number": 6,
            "pos": "M",
            "grid": "3:1",
          },
        },
        {
          "player": {
            "id": 636,
            "name": "Bernardo Silva",
            "number": 10,
            "pos": "M",
            "grid": "4:3",
          },
        },
        {
          "player": {
            "id": 1485,
            "name": "Bruno Fernandes",
            "number": 8,
            "pos": "M",
            "grid": "4:2",
          },
        },
        {
          "player": {
            "id": 22236,
            "name": "Rafael Leão",
            "number": 17,
            "pos": "M",
            "grid": "4:1",
          },
        },
        {
          "player": {
            "id": 874,
            "name": "Cristiano Ronaldo",
            "number": 7,
            "pos": "F",
            "grid": "5:1",
          },
        },
      ],
      "substitutes": [
        {
          "player": {
            "id": 130,
            "name": "Nélson Semedo",
            "number": 2,
            "pos": "D",
            "grid": null,
          },
        },
        {
          "player": {
            "id": 161585,
            "name": "Francisco Conceição",
            "number": 26,
            "pos": "F",
            "grid": null,
          },
        },
        {
          "player": {
            "id": 2676,
            "name": "Rúben Neves",
            "number": 18,
            "pos": "M",
            "grid": null,
          },
        },
        {
          "player": {
            "id": 2674,
            "name": "Rui Patrício",
            "number": 1,
            "pos": "G",
            "grid": null,
          },
        },
        {
          "player": {
            "id": 1590,
            "name": "José Sá",
            "number": 12,
            "pos": "G",
            "grid": null,
          },
        },
        {
          "player": {
            "id": 886,
            "name": "Diogo Dalot",
            "number": 5,
            "pos": "D",
            "grid": null,
          },
        },
        {
          "player": {
            "id": 265595,
            "name": "Gonçalo Inácio",
            "number": 14,
            "pos": "D",
            "grid": null,
          },
        },
        {
          "player": {
            "id": 331832,
            "name": "António Silva",
            "number": 24,
            "pos": "D",
            "grid": null,
          },
        },
        {
          "player": {
            "id": 381,
            "name": "Danilo Pereira",
            "number": 13,
            "pos": "D",
            "grid": null,
          },
        },
        {
          "player": {
            "id": 41621,
            "name": "Matheus Nunes",
            "number": 16,
            "pos": "M",
            "grid": null,
          },
        },
        {
          "player": {
            "id": 335051,
            "name": "João Neves",
            "number": 15,
            "pos": "M",
            "grid": null,
          },
        },
        {
          "player": {
            "id": 2678,
            "name": "Diogo Jota",
            "number": 21,
            "pos": "F",
            "grid": null,
          },
        },
        {
          "player": {
            "id": 1864,
            "name": "Pedro Neto",
            "number": 25,
            "pos": "F",
            "grid": null,
          },
        },
        {
          "player": {
            "id": 41585,
            "name": "Gonçalo Ramos",
            "number": 9,
            "pos": "F",
            "grid": null,
          },
        },
        {
          "player": {
            "id": 583,
            "name": "João Félix",
            "number": 11,
            "pos": "F",
            "grid": null,
          },
        },
      ],
      "coach": {
        "id": 48,
        "name": "Roberto Martínez",
        "photo": "https://media.api-sports.io/football/coachs/48.png",
      },
    },
    {
      "team": {
        "id": 2,
        "name": "France",
        "logo": "https://media.api-sports.io/football/teams/2.png",
        "colors": {
          "player": {
            "primary": "e3eff2",
            "number": "0535f7",
            "border": "e3eff2",
          },
          "goalkeeper": {
            "primary": "000000",
            "number": "fcfcfc",
            "border": "000000",
          },
        },
      },
      "formation": "4-3-1-2",
      "startXI": [
        {
          "player": {
            "id": 22221,
            "name": "Mike Maignan",
            "number": 16,
            "pos": "G",
            "grid": "1:1",
          },
        },
        {
          "player": {
            "id": 1257,
            "name": "Jules Koundé",
            "number": 5,
            "pos": "D",
            "grid": "2:4",
          },
        },
        {
          "player": {
            "id": 1149,
            "name": "Dayot Upamecano",
            "number": 4,
            "pos": "D",
            "grid": "2:3",
          },
        },
        {
          "player": {
            "id": 22090,
            "name": "William Saliba",
            "number": 17,
            "pos": "D",
            "grid": "2:2",
          },
        },
        {
          "player": {
            "id": 47300,
            "name": "Theo Hernández",
            "number": 22,
            "pos": "D",
            "grid": "2:1",
          },
        },
        {
          "player": {
            "id": 2290,
            "name": "N'Golo Kanté",
            "number": 13,
            "pos": "M",
            "grid": "3:3",
          },
        },
        {
          "player": {
            "id": 1271,
            "name": "Aurélien Tchouaméni",
            "number": 8,
            "pos": "M",
            "grid": "3:2",
          },
        },
        {
          "player": {
            "id": 2207,
            "name": "Eduardo Camavinga",
            "number": 6,
            "pos": "M",
            "grid": "3:1",
          },
        },
        {
          "player": {
            "id": 56,
            "name": "Antoine Griezmann",
            "number": 7,
            "pos": "M",
            "grid": "4:1",
          },
        },
        {
          "player": {
            "id": 21104,
            "name": "Randal Kolo Muani",
            "number": 12,
            "pos": "F",
            "grid": "5:2",
          },
        },
        {
          "player": {
            "id": 278,
            "name": "Kylian Mbappé",
            "number": 10,
            "pos": "F",
            "grid": "5:1",
          },
        },
      ],
      "substitutes": [
        {
          "player": {
            "id": 153,
            "name": "Ousmane Dembélé",
            "number": 11,
            "pos": "F",
            "grid": null,
          },
        },
        {
          "player": {
            "id": 21509,
            "name": "Marcus Thuram",
            "number": 15,
            "pos": "F",
            "grid": null,
          },
        },
        {
          "player": {
            "id": 22254,
            "name": "Youssouf Fofana",
            "number": 19,
            "pos": "M",
            "grid": null,
          },
        },
        {
          "player": {
            "id": 21628,
            "name": "Brice Samba",
            "number": 1,
            "pos": "G",
            "grid": null,
          },
        },
        {
          "player": {
            "id": 253,
            "name": "Alphonse Aréola",
            "number": 23,
            "pos": "G",
            "grid": null,
          },
        },
        {
          "player": {
            "id": 2725,
            "name": "Benjamin Pavard",
            "number": 2,
            "pos": "D",
            "grid": null,
          },
        },
        {
          "player": {
            "id": 653,
            "name": "Ferland Mendy",
            "number": 3,
            "pos": "D",
            "grid": null,
          },
        },
        {
          "player": {
            "id": 25008,
            "name": "Jonathan Clauss",
            "number": 21,
            "pos": "D",
            "grid": null,
          },
        },
        {
          "player": {
            "id": 1145,
            "name": "Ibrahima Konaté",
            "number": 24,
            "pos": "D",
            "grid": null,
          },
        },
        {
          "player": {
            "id": 336657,
            "name": "Warren Zaïre-Emery",
            "number": 18,
            "pos": "M",
            "grid": null,
          },
        },
        {
          "player": {
            "id": 508,
            "name": "Kingsley Coman",
            "number": 20,
            "pos": "F",
            "grid": null,
          },
        },
        {
          "player": {
            "id": 2295,
            "name": "Olivier Giroud",
            "number": 9,
            "pos": "F",
            "grid": null,
          },
        },
        {
          "player": {
            "id": 161904,
            "name": "Bradley Barcola",
            "number": 25,
            "pos": "F",
            "grid": null,
          },
        },
      ],
      "coach": {
        "id": 180,
        "name": "D. Deschamps",
        "photo": "https://media.api-sports.io/football/coachs/180.png",
      },
    },
  ],
};
