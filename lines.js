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

  // Add more openings here as you send them.
];
