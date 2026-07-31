// =============================================================================
// OPENING REPERTOIRE
// =============================================================================
// You play WHITE by default; the bot plays BLACK and follows these lines.
// Wherever the side to move has more than one option in the tree, the bot picks
// one at RANDOM and you must find the correct reply. Any move off the
// repertoire shows "Failure, try again." Reaching the end of a line shows
// "Line complete."
//
// Two ways to define an opening:
//   1. `variations`: a list of full SAN move sequences.
//   2. `pgn`: a PGN string with nested ( ) variations (e.g. a Lichess study
//      export). The app expands the whole variation tree and validates every
//      move against chess.js. Best for complex openings.
//
// SIDE: by default you play White (you move first). For a Black repertoire
// (e.g. QGA, a defense to 1.d4), add `side: "black"` — the app flips the board
// to Black's view and the bot makes White's moves. The PGN still starts from
// move 1 with White's move either way.
//
// All openings below are exported from the Lichess study "Dominik - Openings"
// (https://lichess.org/study/J4couDp8).
// =============================================================================

const OPENINGS = [
  // ===========================  WHITE  =======================================
  {
    name: "Caro-Kann: Exchange Variation",
    pgn: `[ChapterURL "https://lichess.org/study/J4couDp8/jLgQflP9"]

1. e4 c6 2. d4 d5 3. exd5 { Exchange Variation } 3... cxd5 4. Bd3 Nc6 5. c3 Nf6 6. h3 e6 { [%csl Rc8] } (6... e5 7. dxe5 Nxe5 8. Nf3 Nxd3+ 9. Qxd3 Be7 10. O-O O-O 11. Be3 $14 { [%csl Rd5][%cal Bb1d2,Ba1d1,Bf1e1] }) (6... g6 { [%cal Gf8g7] } 7. Nf3 Bg7 8. O-O O-O 9. Re1 Bf5 10. Bf1 (10. Bf4 Rc8 11. Bf1 $14 { [%csl Gb1][%cal Gb1d2] }) 10... Rc8 11. Bf4 $14 { [%cal Gb1d2] } 11... Qb6 12. Qb3 Qxb3 13. axb3 Bxb1 14. Rexb1 a6 15. b4 Rfd8 16. b5 axb5 17. Bxb5 Ne4) 7. Nf3 Be7 8. O-O O-O 9. Re1 b6 10. Bf4 Bb7 11. Nbd2 $14 { [%csl Ge5][%cal Gd1e2,Gf3e5] } *`,
  },

  {
    name: "Four Knights Game: Scotch Variation",
    pgn: `[ChapterURL "https://lichess.org/study/J4couDp8/ct23Y89q"]

1. e4 e5 2. Nf3 Nc6 3. Nc3 Nf6 (3... Bc5? 4. Nxe5! Nxe5 (4... Bxf2+ 5. Kxf2 Nxe5 6. d4 { [%csl Gd4,Ge4] } 6... Qf6+ (6... Ng6 7. Be2 d6 8. Rf1 N8e7 9. Kg1 O-O 10. Be3 $16 { [%csl Ge4,Gd4][%cal Gf1f8] }) 7. Kg1 Ng4 8. Qd2! d6 9. h3 N4h6 10. g4 { [%cal Gg4g5] } 10... Qd8 11. g5 $18 { [%cal Gg5h6] }) 5. d4 Bd6 (5... Bxd4 6. Qxd4 d6 7. Bf4 $16 { [%csl Ge1][%cal Ge1c1] }) 6. dxe5 Bxe5 7. Bd3 d6 8. O-O Nf6 (8... Bxc3? 9. bxc3 Ne7 10. f4 O-O 11. f5 { [%cal Gf5f6] } 11... f6 12. Qh5 $16 { [%cal Gf2f3,Gf1f3,Gf3h3] }) 9. Ne2 $16 { [%csl Gf4,Ge4][%cal Gf2f4] }) 4. d4 exd4 (4... Bb4 5. Nxe5 Nxe5? (5... Nxe4 6. Qg4 Nxc3 7. Qxg7 { [%csl Rh8,Rf7] } 7... Rf8 8. a3 Ba5 9. Nxc6 dxc6 10. Qe5+ { [%csl Ge5][%cal Ge5e8,Ge5a5] } 10... Qe7 11. Qxe7+ Kxe7 12. Bd2 $16) 6. dxe5 Nxe4 7. Qg4 { [%csl Gg4,Gg7][%cal Gg4b4,Gg4g7] } 7... Nxc3 8. Qxb4 Nd5 9. Qg4 O-O 10. Bh6 $18) 5. Nxd4 Bb4 (5... Nxd4? 6. Qxd4 d6 (6... Be7? 7. e5 Ng8 (7... Nh5 8. g4 $18) 8. Bf4 $18 { [%csl Ge1][%cal Ge1c1,Gf1c4] }) 7. Bf4 { [%csl Ge1][%cal Ge1c1] } 7... Be7 (7... c5? 8. Qd2 $18 { [%csl Rd6][%cal Ge1c1] }) 8. O-O-O O-O 9. f3 $40 { [%cal Gg2g4,Gh2h4] }) (5... d6? 6. Bf4 Be7 7. Qd2 O-O 8. O-O-O $16 { [%cal Bf2f3,Bg2g4,Bh2h4,Bc1b1] }) (5... Bc5 6. Be3 Bb6 (6... O-O?? 7. Nxc6 $18 { [%cal Ge3c5] }) (6... Nxd4 7. Bxd4 Bxd4 8. Qxd4 $16 { [%csl Ge1][%cal Ge1c1,Gh2h3,Gg2g4,Gf2f4] }) (6... d6? 7. Nxc6 bxc6 8. Bxc5 dxc5 9. Qxd8+ Kxd8 10. O-O-O+ $18 { [%csl Rc5,Rc6,Rc7] }) 7. Qd2 { [%csl Ge1,Gc1][%cal Ge1c1] } 7... O-O (7... Nxd4? 8. Bxd4 Bxd4 9. Qxd4 $16 { [%csl Gc1][%cal Ge1c1,Gh2h3,Gf2f4,Gg2g4] }) (7... Ng4 8. Nf5! Nxe3 9. Nxe3 { [%cal Gc3d5,Ge3f5] } 9... O-O 10. O-O-O d6 11. Kb1 Re8 12. f4 $16 { [%cal Gf1d3,Gg2g4] }) 8. O-O-O Re8 9. f3 $14 { [%cal Gg2g4] }) 6. Nxc6 bxc6 (6... dxc6? 7. Qxd8+ Kxd8 8. Bd2 $16 { [%cal Gf2f3,Ge1c1] } (8. Bg5)) 7. Bd3 { [%csl Ge1][%cal Ge1g1] } 7... d5 8. exd5 cxd5 9. O-O O-O 10. Bg5 c6 11. Qf3 Be7 (11... Bg4?? 12. Bxf6 Bxf3 13. Bxd8 Rfxd8 14. gxf3 $18) 12. h3 { [%csl Gd1,Ge1][%cal Ga1d1,Gf1e1] } 12... Be6 (12... Re8 13. Rfe1 Rb8 { [%csl Gb2][%cal Gb8b2] } 14. b3 Be6 15. Ne2 $14 { [%csl Ge2][%cal Ge2d4,Ge2f4] }) 13. Ne2 $14 { [%csl Ge2][%cal Ge2d4,Ge2f4] } 13... h6 *`,
  },

  {
    name: "Philidor Defense: Exchange Variation",
    pgn: `[ChapterURL "https://lichess.org/study/J4couDp8/T9m07TiA"]

1. e4 e5 (1... d6 2. d4 Nf6 3. Nc3 e5 4. Nf3 Nbd7 5. h3! { It transposes }) 2. Nf3 d6 3. d4 exd4 (3... Nd7 4. Nc3 Ngf6 5. h3! { [%cal Gg2g4] } 5... Be7 (5... h5? { [%csl Rg5] } 6. Bc4 { [%csl Rf7][%cal Bf3g5] } 6... Be7 7. Ng5 O-O 8. O-O c6 9. a4 Qc7 10. Be3 $16 { [%csl Ga2][%cal Gc4a2] }) (5... c6 6. a4 Be7 7. g4 O-O 8. g5 Ne8 (8... Nh5 9. Be3 Re8 10. h4 Bf8 11. Be2 $14 { [%cal Gd1d2] }) 9. h4 { [%cal Gc1e3] }) 6. g4 h6 (6... h5? 7. g5 Nh7 8. h4 Nhf8 9. Be3 Ng6 10. Qd2 { [%csl Ge1][%cal Ge1c1] }) 7. Be3 c6 { [%cal Bb7b5] } 8. a4 O-O 9. Qd2 exd4 (9... Qc7? 10. g5 hxg5 11. Nxg5 b6 12. Rg1 Bb7 13. O-O-O a6 { [%cal Gb6b5] } 14. dxe5 (14. f4! $18 { [%csl Gg7][%cal Gd2g2,Gg2g7] }) 14... dxe5 15. Bc4 b5 16. Ne6 fxe6 17. Bxe6+ Rf7 18. Bh6 Bf8 19. Qg5 $18) 10. Bxd4 Ne5 (10... Qc7 11. g5 hxg5 12. Nxg5 $16 { [%csl Ge1][%cal Ge1c1,Gh1g1] }) 11. Be2 Be6 12. g5! Nxf3+ 13. Bxf3 hxg5 14. O-O-O b5 15. Qxg5 $16 { [%csl Rg7][%cal Gh1g1,Gd1g1] }) (3... Nf6 4. Nc3 Nbd7 5. h3 { It transposes }) 4. Qxd4! { [%cal Gb1c3,Gc1f4,Ge1c1] } 4... Nc6 (4... Nf6 5. Nc3 Be7 6. Bf4 O-O 7. O-O-O Nc6 8. Qd2 a6 9. h3 b5 { [%csl Ge4][%cal Gb5b4,Gf6e4] } 10. Bd3 Be6 (10... b4? 11. Nd5 $16) 11. Kb1 b4 12. Nd5 $16) 5. Bb5 Bd7 6. Bxc6 Bxc6 (6... bxc6?! 7. Nc3 Nf6 8. Bf4 Be7 9. O-O-O O-O 10. Rhe1 Rb8 11. e5 $16) 7. Nc3 Nf6 8. Bf4 Be7 9. O-O-O O-O 10. Rhe1 Re8 11. Qd3! { [%cal Gf3d4] } 11... a6 12. Nd4 Bd7 13. h3 $14 { [%cal Gg2g4,Gc1b1] } *`,
  },

  {
    name: "Owen Defense",
    pgn: `[ChapterURL "https://lichess.org/study/J4couDp8/zql1k2s4"]

1. e4 b6 2. d4 Bb7 3. Nc3 e6 4. Bd3 Bb4 (4... Nf6 5. Nge2 $14 { [%csl Ge1][%cal Ge1g1,Gc1g5] }) 5. Ne2 Nf6 6. O-O $16 *`,
  },

  {
    name: "Scandinavian Defense",
    pgn: `[ChapterURL "https://lichess.org/study/J4couDp8/lLyFyegx"]

1. e4 d5 2. exd5 Qxd5 (2... Nf6 { [%csl Gf6][%cal Gf6d5] } 3. d4 Nxd5 (3... Qxd5 4. Nc3 Qa5 5. Nf3 { It transposes into the main line }) 4. c4 Nb6 5. Nf3 g6 6. h3 Bg7 7. Nc3 O-O 8. Be2 $16 { [%csl Gd4,Gc4][%cal Gc1e3,Ge1g1] }) 3. Nc3 Qa5 (3... Qd8 4. d4 Nf6 5. Nf3 c6 6. Bc4 Bf5 7. Ne5 e6 8. g4 Bg6 9. h4 $16) (3... Qe5+ 4. Be2! $16 { [%cal Gg1f3,Gd2d4,Ge1g1] }) 4. d4 Nf6 5. Nf3 c6 6. Bc4 Bf5 (6... Bg4 7. h3 Bxf3 (7... Bh5 8. g4 Bg6 9. Ne5 e6 10. h4 Nbd7 11. Nxd7 { It transposes into the 6...Bf5 Line }) 8. Qxf3 e6 9. Bd2 Qc7 10. O-O-O Nbd7 { [%csl Ge8][%cal Ge8c8] } 11. g4! h6 (11... b5? 12. Nxb5 $16) (11... Nb6 12. Bb3 O-O-O 13. g5 Nfd5 14. Ne4! $16 { [%csl Rd5][%cal Gc2c4] }) 12. h4 $16 { [%cal Gg4g5] }) 7. Ne5 { [%csl Gf7][%cal Gc4f7,Ge5f7] } 7... e6 8. g4 Bg6 9. h4 Nbd7 $7 (9... Ne4? { [%csl Rc3][%cal Re4c3,Ra5c3] } 10. Qf3 Nxc3 11. bxc3 { [%csl Bf7][%cal Bh4h5,Bf3f7] } 11... h5 (11... h6? 12. h5 $18) 12. Nxg6 fxg6 13. Bxe6 $18 Qc7 14. O-O Bd6 15. Bg5) (9... h5? 10. Nxg6 fxg6 11. Bxe6 $18 { [%csl Gg6][%cal Gd1d3,Gd3g6] }) 10. Nxd7 Nxd7 11. h5 Be4 12. O-O Bd5 13. Nxd5 cxd5 14. Bd3 Bd6 15. Bd2 Qb6 16. c3 $14 *`,
  },

  {
    name: "Sicilian Defense: Delayed Alapin / Rossolimo",
    pgn: `[ChapterURL "https://lichess.org/study/J4couDp8/KFRRcCYy"]

1. e4 c5 2. Nf3 d6 (2... Nc6 3. Bb5 g6 (3... d6 4. O-O Bd7 (4... a6 5. Bxc6+ bxc6 6. c3 Nf6 7. Re1 g6 8. h3 Bg7 9. d4 $14) 5. Re1 a6 6. Bf1 Nf6 7. h3 g6 8. c3 Bg7 9. d4 $14) (3... e6 4. O-O Nge7 5. Re1 a6 6. Bf1 $14 { [%cal Gc2c3,Gd2d4] }) 4. O-O Bg7 5. Re1 Nf6 6. c3 O-O (6... a6 7. Bf1 O-O 8. d4 $14) 7. d4 a6 8. Bd3 $14) (2... e6 3. c3 d5 4. exd5 Qxd5 (4... exd5 5. d4 Nc6 (5... c4?! 6. b3! cxb3 (6... b5? 7. a4 $16 { [%cal Ra4b5,Rb3c4] }) 7. axb3 Nf6 8. Bd3 $14 { [%csl Ge1,Gd4,Gc3,Gb3][%cal Ge1g1] }) 6. Bb5 { [%csl Ge1][%cal Ge1g1] } 6... Nf6 7. O-O Be7 8. dxc5 Bxc5 9. Bg5 Be7 10. Nbd2 O-O 11. Re1 $14 { [%csl Gd4,Rd5][%cal Gd2b3,Gb3d4] }) 5. d4! Nf6 6. Be2 Nc6 7. O-O Be7 8. Be3 { [%cal Gd4c5] } 8... cxd4 9. cxd4 $14 { [%cal Gb1c3] }) (2... g6) 3. c3 Nf6 $7 (3... Nc6? 4. d4 Nf6 5. Bd3 { [%csl Ge4,Gd4][%cal Ge1g1] } 5... cxd4 6. cxd4 $14 { [%cal Gb1c3,Ge1g1] }) (3... e6? 4. d4 $14 { [%cal Gf1d3,Ge1g1] }) (3... g6 4. d4) (3... Bg4 4. d4 Nc6 5. d5! Ne5 6. Nxe5! Bxd1 7. Bb5+ Qd7 8. Bxd7+ Kd8 9. Nxf7+ Kxd7 10. Kxd1 $18 { [%csl Gf7][%cal Gf7h8] }) 4. Be2 Nc6 (4... Nxe4?? 5. Qa4+ $18 { [%csl Ga4][%cal Ga4e8,Ga4e4] }) (4... e6 { [%cal Gf8e7,Ge8g8] } 5. O-O Be7 6. Re1 O-O 7. Bf1 $14 { [%cal Gd2d4] }) (4... Nbd7 5. d3 g6 6. O-O Bg7 7. Re1 O-O 8. Bf1 $14 { [%cal Gd3d4] }) (4... g6 5. O-O Bg7 6. Re1 O-O 7. Bf1 Nc6 8. h3 $13 { [%cal Gd2d4] }) 5. d4! Nxe4 (5... cxd4 6. cxd4 Nxe4 7. d5 Qa5+ $7 8. Nc3 Nxc3 9. bxc3 Nb8 (9... Qxc3+ 10. Bd2 $18 { [%cal Gd2c3,Gd5c6] }) (9... Ne5 10. Nxe5 Qxc3+ 11. Bd2 Qxe5 12. O-O Qxd5 13. Rc1 Qxa2 14. Bc4 Qa3 15. Qh5 { [%csl Rf7] } 15... e6 16. Bb5+ Bd7 17. Bxd7+ Kxd7 18. Qb5+ Ke7 19. Rc7+ Kf6 20. Qg5#) 10. O-O g6 (10... e6 11. dxe6 fxe6 12. Bf4 { [%csl Gf4][%cal Gf4d6] } 12... e5 13. Be3 Be7 14. Qb3 $16 { [%cal Gb3g8] }) 11. Qd4 f6 12. h4 { [%cal Gh4h5] } 12... Bg7 13. h5 $16) 6. d5 $18 { [%cal Gd1a4] } *`,
  },

  {
    name: "French Defense: Advance, Milner-Barry Gambit",
    pgn: `[ChapterURL "https://lichess.org/study/J4couDp8/46yL5KJu"]

1. e4 e6 2. d4 d5 3. e5 c5 4. c3 Nc6 (4... Qb6 5. Nf3 Bd7 { [%cal Gd7b5] } 6. Bd3 Bb5 (6... cxd4 7. Nxd4! Nc6 (7... Bc5 8. Qg4 { [%cal Gg4d4,Gg4g7] } 8... g6 9. O-O $16) 8. Nxc6 bxc6 (8... Bxc6 9. Qe2! a6 10. a4 $14 { [%csl Ge1,Gd4][%cal Ge1g1,Gb1d2,Gd2f3,Gf3d4] }) 9. O-O Ne7 10. Nd2 Ng6 11. Nf3 c5 12. h4! $16 { [%cal Bh4h5] }) 7. dxc5 Bxc5 (7... Qxc5?? 8. Be3 Qc6 9. Nd4 $18) 8. b4! Bxd3 (8... Bxf2+?? 9. Ke2 Bxd3+ 10. Qxd3 $18 { [%csl Rf2][%cal Gh1f1] }) 9. Qxd3 Bf8 10. O-O Ne7 11. Be3 Qc7 12. Na3 { [%csl Ga3][%cal Ga3b5] } 12... a6 13. c4 $14) (4... Bd7 5. Nf3 a6?! { [%cal Gd7b5] } 6. Bd3 Bb5 7. Bxb5+ axb5 8. dxc5 Bxc5 9. b4 Bb6 10. Na3 { [%cal Ra3b5] } 10... Qd7 11. Qe2 $16 { [%cal Ga3b5,Ge2b5] }) (4... cxd4 5. cxd4) 5. Nf3 Qb6 (5... Bd7 6. Bd3 cxd4 7. O-O dxc3 8. Nxc3 Nge7 9. Bg5!! a6 (9... h6?? 10. Nb5 $18) 10. h4! h6 11. Bd2 $14 { [%cal Bf1e1] } 11... Nc8 12. Re1 Be7 13. h5 O-O 14. Bb1! $14 { [%cal Bd1c2] }) (5... cxd4 6. cxd4 Nge7 { [%cal Ge7f5] } 7. Na3! Nf5 8. Nc2 Qb6 9. Bd3 Bd7 10. O-O a5 (10... Nfxd4?? 11. Nfxd4 Nxd4 12. Be3 Bc5 13. b4 Nxc2 14. Bxc5 $18 { [%cal Gd1c2] }) 11. Kh1! Rc8 (11... Nfxd4 12. Be3 Bc5 13. Ncxd4 Nxd4 14. Rc1! $18 { [%csl Bc5][%cal Bc1c5] }) 12. Rb1 h6 (12... Nfxd4?? 13. Be3 Bc5 14. Nfxd4 Nxd4 15. b4 axb4 16. Bxd4 Bxd4 17. Rxb4 $18 { [%csl Gb4][%cal Gb4b6,Gb4d4] }) 13. g4 Nfe7 14. Kg2 $14 { [%cal Bc1e3] }) 6. Bd3! cxd4 (6... c4? 7. Bc2 $16 { [%csl Gg1][%cal Ge1g1,Gb2b3] }) 7. O-O Bd7 (7... dxc3?! 8. Nxc3 Nge7 9. Re1 Bd7 (9... a6 10. Be3 Qc7 (10... Qxb2? 11. Na4 Qa3 12. Bc5 Nb4 13. Re3 $18 { [%csl Ra3][%cal Gd3f1] }) 11. Rc1 Ng6 12. Na4! $16 { [%csl Rb6] } (12. h4! $16)) 10. h4! Nb4 (10... Ng6? 11. h5 $16 Nge7 12. Be3) (10... Nf5? 11. Bxf5 exf5 12. Nxd5 $16) 11. Be3 Qd8 12. Bb1 $14 { [%cal Ga2a3,Gh4h5] }) 8. Re1 Nge7 (8... Nh6 9. h3! Be7 (9... Nf5 10. Bxf5 exf5 11. cxd4 $14 { [%csl Gc3][%cal Gb1c3] }) 10. a3 $14) 9. h4 h6 10. h5 Rc8 11. a3! a6 (11... a5 12. Bc2! { [%cal Bc3d4] } 12... dxc3 13. Nxc3 $16 { [%cal Gc1e3] }) 12. b4 { [%csl Gd4][%cal Gc1b2,Gc3d4] } 12... dxc3 13. Nxc3 Nxb4 14. Na4 Bxa4 15. Qxa4+ Nbc6 16. Bd2 Qc7 17. Rab1 Qd7 18. Qf4 Rc7 19. Nh2 $14 *`,
  },

  {
    name: "Pirc & Modern Defense (Austrian Attack)",
    pgn: `[ChapterURL "https://lichess.org/study/J4couDp8/Ff7rrC32"]

1. e4 d6 (1... g6 2. d4 Bg7 3. Nc3 d6 (3... c6 4. f4 { [%csl Gf3,Gc3][%cal Gg1f3] } 4... d5 5. e5 h5 (5... Nh6 6. Nf3 Bg4 7. Be3 Nf5 8. Bf2 h5 9. h3 Bxf3 10. Qxf3 h4 (10... e6? 11. g4 $16) 11. Bd3 e6 12. O-O Nd7 13. Ne2 Bf8 { [%cal Gf8e7] } 14. b3 Be7 15. c4 Kf8 { [%csl Gg7][%cal Gf8g7] } 16. Kh2 Kg7 17. Ng1 Rc8 18. Qe2 $16 { [%csl Gf3][%cal Gg1f3] }) 6. Nf3 Nh6 7. Be3 Bg4 8. h3 Nf5 9. Bf2 Bxf3 10. Qxf3 { [%csl Ge1][%cal Gg2g4,Ge1c1] } 10... h4 (10... e6? 11. g4 $16 hxg4 12. hxg4 Rxh1 13. Qxh1 Ne7 14. Qh7 Kf8 15. Bh4 $18 { [%csl Ge1][%cal Ge1c1,Gh4f6] }) 11. Bd3 e6 12. O-O Bf8 { [%cal Gf8e7] } 13. Ne2 (13. Kh2 Be7 14. Ne2 Nd7 15. Ng1 Kf8 16. Qe2 Kg7 17. Nf3 $14 { [%csl Rh4][%cal Bb2b3,Bc2c4,Ga1c1] }) 13... Nd7 14. b3 Be7 15. c4 Kf8 { [%cal Gf8g7] } 16. Kh2 Kg7 17. Ng1 Rc8 (17... a5 18. Qe2 $16 { [%csl Gf3][%cal Gg1f3] }) 18. Qe2 $16 { [%cal Bg1f3] }) (3... c5 4. d5 { Benoni } 4... d6 (4... Bxc3+? 5. bxc3 d6 6. c4 $16 { [%cal Bc1b2,Bb2h8] }) 5. Nf3 Nf6 6. Be2 O-O 7. O-O a6 8. a4 Nbd7 9. Nd2 { [%cal Bd2c4] } 9... Re8 10. Nc4 Nb6 11. Ne3 $14 { [%cal Ba4a5,Be3c4] } 11... e6 12. a5 Nbd7 13. Nc4 $16 { [%csl Rd6] }) 4. f4 { [%cal Bg1f3] } 4... a6 { [%cal Gb7b5] } (4... Nf6 { Prelazi u Pirca }) 5. Nf3 b5 6. Bd3 { [%csl Ge1][%cal Ge1g1] } 6... Bb7 (6... Nd7 7. e5! c5 8. Be4 Rb8 9. O-O cxd4 10. Nxd4 $16 { [%csl Gc6][%cal Gd4c6] }) (6... b4 7. Ne2 Bb7 8. O-O $16) 7. O-O Nd7 8. e5! e6 { [%cal Gg8e7] } (8... dxe5? 9. fxe5 $16) 9. Ne4 $16 { [%csl Gb2,Gc3,Gd4,Ge5,Gf4][%cal Bc2c3] } 9... Bxe4 (9... d5 10. Nf2 { [%cal Bc2c3] } 10... c5 11. c3 $16) 10. Bxe4 d5 11. Bd3 c5 12. c3 Ne7 13. Be3 c4 (13... Nf5 14. Bf2 cxd4 15. cxd4 { [%cal Gg2g4] } 15... h5 16. Rc1 O-O 17. h3 { [%cal Bg2g4] } 17... h4? 18. Bxf5 $18) 14. Bc2 Nf5 15. Bf2 { [%cal Gg2g4] } 15... h5 16. g3 $16 { [%cal Bg1g2,Bh2h3,Bg3g4] }) 2. d4 Nf6 (2... e5 3. Nf3 exd4 4. Qxd4 { Prelazi u Filidora }) 3. Nc3 g6 (3... c6 4. f4 Qa5 5. Bd3 e5 6. Nf3 Bg4 7. Be3 Nbd7 8. O-O Be7 9. h3 Bxf3 10. Qxf3 O-O 11. Ne2 $16 { [%cal Bc2c3] }) (3... e5 4. Nf3 exd4 5. Qxd4 Nc6 6. Bb5 Bd7 7. Bxc6 Bxc6 8. Bf4 { [%csl Ge1,Gc1][%cal Ge1c1] }) 4. f4 { [%csl Gd4,Ge4,Gf4][%cal Gg1f3] } 4... Bg7 5. Nf3 O-O (5... c5 6. dxc5 Qa5 { [%csl Re4][%cal Rf6e4] } 7. Bd3 Qxc5 8. Qe2 O-O 9. Be3 Qa5 10. O-O $14 Ng4 11. Bd2 Qb6+ 12. Kh1 Qxb2 13. Nd5 { [%csl Ge7,Gc7][%cal Gd5e7,Gd5c7] } 13... Nc6 14. Rab1 Qa3 15. Bb5 { [%cal Gb5c6,Gd5e7] }) 6. Bd3 { [%cal Ge1g1] } 6... Nc6 (6... Na6 7. O-O c5 8. d5 Rb8 (8... Bg4 9. Kh1! Nc7 10. Qe1! (10. a4 Rb8 11. Qe1 a6 12. a5 b5 13. axb6 Rxb6 14. Nd2! $16 { [%csl Gc4][%cal Gd2c4] }) 10... Bxf3 (10... Rb8 11. a4 a6 12. f5! b5 13. Qh4 b4 14. Ne2 { [%csl Gh6][%cal Ge2g3,Gc1h6] }) (10... b5 11. Nxb5) 11. Rxf3 $16) 9. Kh1! Nc7 { [%cal Gb7b5] } (9... Nb4 10. Be2 $16 { [%cal Ga2a3] }) 10. a4 a6 11. a5 b5 12. axb6 Rxb6 13. Qe1 Nb5 14. Bd2 $16 { [%csl Gc3][%cal Gb5c3,Gd2c3,Ge1h4] }) (6... Nbd7?! 7. e5! dxe5 8. dxe5 Ne8 9. Be3 Nb6 10. Qe2 $16 $40 { [%csl Ge1][%cal Ge1c1,Rh2h4,Rh4h5] }) (6... c5?! 7. dxc5 dxc5 8. e5 Nd5 9. Nxd5 Qxd5 10. Qe2 $14 { [%csl Ge4][%cal Gd3e4] }) (6... a6?! 7. O-O b5? 8. e5! dxe5 9. dxe5 Nd5 (9... Nfd7 10. Be4 $16) 10. Be4 Nxc3 11. Qxd8 Rxd8 12. Bxa8 $18) 7. e5! dxe5 8. dxe5 Nd5 9. Nxd5 Qxd5 10. Qe2 { [%csl Ge4][%cal Gd3e4] } 10... Bg4 (10... Nb4? 11. Be4 $16) 11. Be4 Qa5+ 12. Bd2 Qb6 13. O-O-O Nd4 14. Qc4 Rfd8 15. Be3 $14 *`,
  },

  {
    name: "Alekhine Defense: Exchange Variation",
    pgn: `[ChapterURL "https://lichess.org/study/J4couDp8/7u86x0of"]

1. e4 Nf6 2. e5 Nd5 3. d4 d6 4. c4 Nb6 5. exd6 cxd6 (5... exd6 6. Nc3 Be7 7. h3 O-O 8. Nf3 Bf5 9. Be2 Bf6 10. O-O Nc6 11. Be3 Re8 12. Rc1 $14 { [%cal Gb2b3,Gf1e1] } 12... h6 13. b3 a6 14. Re1 Bg6 15. Bf1 Qd7 16. d5 Ne7 17. Bd4) 6. Nc3 g6 7. h3 Bg7 8. Nf3 O-O 9. Be2 Nc6 10. O-O Bf5 (10... e5?! 11. Bg5! f6 (11... Qc7 12. d5! Ne7 13. c5!! $18) 12. Be3 f5 13. dxe5 dxe5 14. Qb3 $16 { [%cal Ga1d1] }) 11. Be3 d5 (11... e5 12. d5 Ne7 13. a4 $16) 12. b3! dxc4 13. bxc4 Qd7 14. Rc1 Rfd8 15. d5 $16 *`,
  },

  // ===========================  BLACK (QGA)  =================================
  {
    name: "QGA: Old Variation (3.e3)",
    side: "black",
    pgn: `[ChapterURL "https://lichess.org/study/J4couDp8/14vJBTD6"]

1. d4 d5 2. c4 dxc4 3. e3 e5 4. Bxc4 (4. dxe5? Qxd1+ 5. Kxd1 Nc6 6. Bxc4 Nxe5 7. Be2 Bf5 $17 { [%csl Ge8][%cal Ge8c8] }) 4... exd4 5. exd4 (5. Nf3 Bb4+ 6. Bd2 (6. Kf1 Nc6! 7. a3 Bd6 $15 { [%cal Gg8f6,Ge8g8] }) 6... Bxd2+ 7. Qxd2 Nf6 8. O-O O-O 9. exd4 Nc6 $10) 5... Bd6 6. Nf3 Nf6 7. O-O O-O 8. Nc3 Nc6 9. h3 (9. Bg5 h6 10. Bh4 Bg4 11. h3 (11. Ne4?! Be7 12. Nxf6+ Bxf6 13. Bxf6 Qxf6 $17 { [%csl Rd4][%cal Ba8d8] }) 11... Bxf3 12. Qxf3 Nxd4 13. Qxb7 Nf5 14. Bxf6 Qxf6 $10) 9... h6 10. Re1 (10. Qc2 Ne7! 11. Ne5 c6 12. Rd1 Nfd5 $10 { [%csl Gf5,Ge6][%cal Gc8f5] }) 10... Bf5 $10 { or } { [%cal Ga7a6] } *`,
  },

  {
    name: "QGA: Classical Variation (3.Nf3 a6)",
    side: "black",
    pgn: `[ChapterURL "https://lichess.org/study/J4couDp8/LLc4rh5j"]

1. d4 d5 2. c4 dxc4 3. Nf3 a6 4. e3 { [%cal Gf1c4] } (4. a4?! Nc6! 5. e3 { [%csl Gf1][%cal Gf1c4] } (5. d5? Na5 $17) (5. e4 Bg4! 6. Be3 Bxf3! 7. gxf3 e6 8. Bxc4 Bb4+ 9. Nc3 Qf6 $17 { [%csl Gc8,Rd4][%cal Ge8c8,Gd8d4,Gf6d4,Gc6d4] }) 5... e5! 6. Bxc4 (6. d5? Na5 7. Nxe5 Nb3 8. Ra2 Nxc1 9. Qxc1 Qxd5 10. Nxc4 Bb4+ 11. Nbd2 Be6 $19 { [%cal Gg8f6,Gf6e4,Ga8d8,Gb7b5] }) (6. Nxe5 Nxe5 7. dxe5 Qxd1+ 8. Kxd1 Be6 $15 { [%csl Ge8][%cal Ge8c8] }) 6... e4 7. Nfd2 Qg5 { [%csl Gg2][%cal Gg5g2] } 8. g3 Nf6 9. Nc3 { [%csl Ge4] } 9... Bb4 10. O-O Qg6 $15 { [%csl Ge8][%cal Ge8g8] }) (4. e4 b5! { [%csl Re4][%cal Bc8b7,Bb7e4] } 5. a4 Bb7 6. axb5 axb5 7. Rxa8 Bxa8 { [%csl Ga8,Ge4][%cal Ga8e4] } 8. Nc3 e6 9. Nxb5 Bxe4 10. Bxc4 Bb4+ 11. Nc3 Ne7 12. O-O Bxf3 13. Qxf3 O-O $10) 4... Bg4 5. Bxc4 e6 6. h3 Bh5 7. Nc3 (7. Qb3 { [%cal Gb3b7] } 7... Bxf3 8. gxf3 b5 9. Be2 Nd7 { [%cal Gc7c5,Gg8f6] } 10. a4 b4 11. O-O c5 $14 { [%cal Gg8f6] }) 7... Nc6 8. O-O Nf6 9. Be2 Bd6 10. b3 (10. e4? Bxf3 11. Bxf3 Nxd4 $17) 10... O-O 11. Bb2 Nd5! 12. Rc1 (12. Ne4 f5 13. Nxd6 cxd6 14. Rc1 Qd7 $10) 12... f5 13. a3 Qf6 14. b4 Qh6 $10 *`,
  },

  {
    name: "QGA: 3.Nc3",
    side: "black",
    pgn: `[ChapterURL "https://lichess.org/study/J4couDp8/tGg7c5ti"]

1. d4 d5 2. c4 dxc4 3. Nc3?! e5 4. d5 (4. e3 exd4 5. exd4 Bd6 6. Bxc4 Nf6 7. Nf3 O-O 8. O-O Nc6 $10 { It transposes into Old Variation }) (4. dxe5 Qxd1+ $15 { [%cal Gb8c6,Gc8e6,Ge8c8] }) 4... Nf6 5. e4 b5! 6. Bg5 (6. Nxb5? Nxe4 7. Bxc4 Bb4+ 8. Kf1 O-O 9. Nf3 c6! $17) 6... a6 7. Nf3 Nbd7 8. Be2 Bd6 $17 { [%csl Gg8][%cal Ge8g8,Gc8b7] } *`,
  },

  {
    name: "QGA: Central Variation (3.e4)",
    side: "black",
    pgn: `[ChapterURL "https://lichess.org/study/J4couDp8/pL4G8TlD"]

1. d4 d5 2. c4 dxc4 3. e4 { [%cal Gf1c4] } 3... Nc6 { [%csl Rd4] } 4. d5 (4. Nf3 Bg4 5. d5 (5. Be3 { [%csl Gf1,Gc4][%cal Gf1c4] } 5... e6! 6. Bxc4 Bxf3 7. gxf3 Qf6 { [%csl Ge8][%cal Ge8c8,Gd8d4,Gf6d4,Gc6d4] } 8. Nc3 (8. e5 Qh4 $15 { [%csl Gh4,Gc6][%cal Gh4d4,Gc6d4,Ge8c8,Gd8d4] }) 8... O-O-O 9. d5 Bb4 $15 { [%csl Gd5][%cal Gg8e7,Ge6d5,Ge7d5,Gd8d5] }) 5... Ne5 6. Bf4 Ng6 7. Be3 Nf6 8. Nc3 e5! 9. Bxc4 Nh4! 10. O-O (10. Bb5+ Nd7) 10... Nxf3+ 11. gxf3 Bh3 12. Re1 Bd6 $15 { [%csl Ge8][%cal Ge8g8,Gf7f5,Gf6h5] }) (4. Be3 Nf6 { [%csl Gf6][%cal Gf6e4] } 5. Nc3 e5! 6. d5 Ne7 { [%cal Ge7g6] } (6... Na5! 7. Nf3 (7. Qa4+ c6 8. dxc6 Nxc6 9. Bxc4 Bb4 $10 { [%csl Ge8][%cal Ge8g8] }) 7... Bd6 8. Qa4+ Bd7!! 9. Qxa5 a6 10. Na4 Qe7 { [%csl Gb4][%cal Gd6b4] } 11. a3 Nxe4 12. Bxc4 O-O 13. O-O b5 $15) 7. Bxc4 Ng6 8. Nf3 a6 9. O-O Bd6 $14 { [%csl Ge8][%cal Ge8g8,Gc8d7] }) 4... Ne5 5. f4?! (5. Bf4 Ng6 6. Be3 Nf6 { [%cal Gf6e4] } 7. Nc3 e6! 8. Bxc4 exd5 9. exd5 (9. Nxd5 Nxe4 $17 { [%cal Gc7c6] }) 9... Bd6 $15 { [%csl Ge8,Gg8][%cal Ge8g8] }) 5... Nd3+! 6. Bxd3 cxd3 7. Qxd3 e6 8. Nc3 exd5 9. exd5 Bd6 10. Nf3 Ne7 $15 { [%csl Ge8,Gg8,Gf5][%cal Ge8g8,Gc8f5] } *`,
  },
];
