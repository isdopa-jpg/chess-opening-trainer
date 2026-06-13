// =============================================================================
// OPENING REPERTOIRE
// =============================================================================
// You play WHITE. The bot plays BLACK and follows these lines.
// Each opening is a list of "variations". A variation is the full sequence of
// moves (in SAN / algebraic notation) from move 1, alternating White, Black,
// White, Black, ...
//
// Variations that share the same starting moves are automatically merged into
// one tree, so you only need to type each line out in full. Wherever Black has
// more than one option, the bot picks one at RANDOM and you must find the
// correct White reply. Any White move not in the tree => "Failure, try again."
//
// Two ways to define an opening:
//   1. `variations`: a list of full SAN move sequences (good for simple lines
//      typed in by hand).
//   2. `pgn`: a PGN string with nested ( ) variations, e.g. exported from a
//      Lichess study/analysis. The app expands the whole variation tree and
//      validates every move. Best for complex openings — no transcription risk.
//
// To add a new opening: copy a block below, give it a name, and provide either
// `variations` or `pgn`.
// =============================================================================

const OPENINGS = [
  {
    name: "Caro-Kann: Exchange Variation",
    variations: [
      // --- Main line: 6...e6 ---
      ["e4","c6","d4","d5","exd5","cxd5","Bd3","Nc6","c3","Nf6","h3","e6",
       "Nf3","Be7","O-O","O-O","Re1","b6","Bf4","Bb7","Nbd2"],

      // --- Sideline: 6...e5 ---
      ["e4","c6","d4","d5","exd5","cxd5","Bd3","Nc6","c3","Nf6","h3","e5",
       "dxe5","Nxe5","Nf3","Nxd3+","Qxd3","Be7","O-O","O-O","Be3"],

      // --- Sideline: 6...g6  (continuation past 9...Bf5 to be confirmed) ---
      ["e4","c6","d4","d5","exd5","cxd5","Bd3","Nc6","c3","Nf6","h3","g6",
       "Nf3","Bg7","O-O","O-O","Re1","Bf5"],
    ],
  },

  {
    name: "Owen Defense",
    variations: [
      // --- Main line: 4...Bb4 ---
      // After 4...Bb4 the bishop pins Nc3, so 5.Ne2 needs no file disambiguation.
      ["e4","b6","d4","Bb7","Nc3","e6","Bd3","Bb4","Ne2","Nf6","O-O"],

      // --- Sideline: 4...Nf6 (no pin yet, so it's 5.Nge2) ---
      ["e4","b6","d4","Bb7","Nc3","e6","Bd3","Nf6","Nge2"],
    ],
  },

  {
    name: "Scandinavian Defense",
    // Full Lichess study chapter, all variations included. The PGN reader in
    // app.js expands the nested ( ) variations into the tree and validates
    // every move against chess.js.
    pgn: `[Event "Dominik - Openings: Scandinavian Defense"]
[Result "*"]
[ECO "B01"]
[Opening "Scandinavian Defense: Main Line, Mieses Variation"]
[ChapterURL "https://lichess.org/study/J4couDp8/lLyFyegx"]

1. e4 d5 2. exd5 Qxd5 (2... Nf6 { [%csl Gf6][%cal Gf6d5] } 3. d4 Nxd5 (3... Qxd5 4. Nc3 Qa5 5. Nf3 { It transposes into the main line }) 4. c4 Nb6 5. Nf3 g6 6. h3 Bg7 7. Nc3 O-O 8. Be2 $16 { [%csl Gd4,Gc4][%cal Gc1e3,Ge1g1] }) 3. Nc3 Qa5 (3... Qd8 4. d4 Nf6 5. Nf3 c6 6. Bc4 Bf5 7. Ne5 e6 8. g4 Bg6 9. h4 $16) (3... Qe5+ 4. Be2! $16 { [%cal Gg1f3,Gd2d4,Ge1g1] }) 4. d4 Nf6 5. Nf3 c6 6. Bc4 Bf5 (6... Bg4 7. h3 Bxf3 (7... Bh5 8. g4 Bg6 9. Ne5 e6 10. h4 Nbd7 11. Nxd7 { It transposes into the 6...Bf5 Line }) 8. Qxf3 e6 9. Bd2 Qc7 10. O-O-O Nbd7 { [%csl Ge8][%cal Ge8c8] } 11. g4! h6 (11... b5? 12. Nxb5 $16) (11... Nb6 12. Bb3 O-O-O 13. g5 Nfd5 14. Ne4! $16 { [%csl Rd5][%cal Gc2c4] }) 12. h4 $16 { [%cal Gg4g5] }) 7. Ne5 { [%csl Gf7][%cal Gc4f7,Ge5f7] } 7... e6 8. g4 Bg6 9. h4 Nbd7 $7 (9... Ne4? { [%csl Rc3][%cal Re4c3,Ra5c3] } 10. Qf3 Nxc3 11. bxc3 { [%csl Bf7][%cal Bh4h5,Bf3f7] } 11... h5 (11... h6? 12. h5 $18) 12. Nxg6 fxg6 13. Bxe6 $18 Qc7 14. O-O Bd6 15. Bg5) (9... h5? 10. Nxg6 fxg6 11. Bxe6 $18 { [%csl Gg6][%cal Gd1d3,Gd3g6] }) 10. Nxd7 Nxd7 11. h5 Be4 12. O-O Bd5 13. Nxd5 cxd5 14. Bd3 Bd6 15. Bd2 Qb6 16. c3 $14 *`,
  },

  {
    name: "Sicilian Defense: Delayed Alapin",
    pgn: `[Event "Dominik - Openings: Sicilian Defense- Delayed Alapin"]
[Result "*"]
[ECO "B50"]
[Opening "Sicilian Defense: Delayed Alapin Variation, with d6"]
[ChapterURL "https://lichess.org/study/J4couDp8/KFRRcCYy"]

1. e4 c5 2. Nf3 d6 (2... Nc6 3. Bb5 g6 (3... d6 4. O-O Bd7 (4... a6 5. Bxc6+ bxc6 6. c3 Nf6 7. Re1 g6 8. h3 Bg7 9. d4 $14) 5. Re1 a6 6. Bf1 Nf6 7. h3 g6 8. c3 Bg7 9. d4 $14) (3... e6 4. O-O Nge7 5. Re1 a6 6. Bf1 $14 { [%cal Gc2c3,Gd2d4] }) 4. O-O Bg7 5. Re1 Nf6 6. c3 O-O 7. d4 a6 8. Bd3 $14) (2... e6 3. c3 { [%cal Gd2d4] } 3... d5 4. exd5 Qxd5 (4... exd5 5. d4 Nc6 (5... c4?! 6. b3! cxb3 (6... b5? 7. a4 $16 { [%cal Ra4b5,Rb3c4] }) 7. axb3 Nf6 8. Bd3 $14 { [%csl Ge1,Gd4,Gc3,Gb3][%cal Ge1g1] }) 6. Bb5 { [%csl Ge1][%cal Ge1g1] } 6... Nf6 7. O-O Be7 8. dxc5 Bxc5 9. Bg5 Be7 10. Nbd2 O-O 11. Re1 $14 { [%csl Gd4,Rd5][%cal Gd2b3,Gb3d4] }) 5. d4! Nf6 6. Be2 Nc6 7. O-O Be7 8. Be3 { [%cal Gd4c5] } 8... cxd4 9. cxd4 $14 { [%cal Gb1c3] }) (2... g6) 3. c3 Nf6 $7 (3... Nc6? 4. d4 Nf6 5. Bd3 { [%csl Ge4,Gd4][%cal Ge1g1] } 5... cxd4 6. cxd4 $14 { [%cal Gb1c3,Ge1g1] }) (3... e6? 4. d4 $14 { [%cal Gf1d3,Ge1g1] }) (3... g6 4. d4) (3... Bg4 4. d4 Nc6 5. d5! Ne5 6. Nxe5! Bxd1 7. Bb5+ Qd7 8. Bxd7+ Kd8 9. Nxf7+ Kxd7 10. Kxd1 $18 { [%csl Gf7][%cal Gf7h8] }) 4. Be2 Nc6 (4... Nxe4?? 5. Qa4+ $18 { [%csl Ga4][%cal Ga4e8,Ga4e4] }) (4... e6 { [%cal Gf8e7,Ge8g8] } 5. O-O Be7 6. Re1 O-O 7. Bf1 $14 { [%cal Gd2d4] }) (4... Nbd7 5. d3 g6 6. O-O Bg7 7. Re1 O-O 8. Bf1 $14 { [%cal Gd3d4] }) (4... g6 5. O-O Bg7 6. Re1 O-O 7. Bf1 Nc6 8. h3 $13 { [%cal Gd2d4] }) 5. d4! Nxe4 (5... cxd4 6. cxd4 Nxe4 7. d5 Qa5+ $7 8. Nc3 Nxc3 9. bxc3 Nb8 (9... Qxc3+ 10. Bd2 $18 { [%cal Gd2c3,Gd5c6] }) (9... Ne5 10. Nxe5 Qxc3+ 11. Bd2 Qxe5 12. O-O Qxd5 13. Rc1 Qxa2 14. Bc4 Qa3 15. Qh5 { [%csl Rf7] } 15... e6 16. Bb5+ Bd7 17. Bxd7+ Kxd7 18. Qb5+ Ke7 19. Rc7+ Kf6 20. Qg5#) 10. O-O g6 (10... e6 11. dxe6 fxe6 12. Bf4 { [%csl Gf4][%cal Gf4d6] } 12... e5 13. Be3 Be7 14. Qb3 $16 { [%cal Gb3g8] }) 11. Qd4 f6 12. h4 { [%cal Gh4h5] } 12... Bg7 13. h5 $16) 6. d5 $18 { [%cal Gd1a4] } *`,
  },

  // Add more openings here as you send them.
];
