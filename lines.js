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
// To add a new opening: copy the block below, give it a name, and list its
// variations. To add a new sideline to an existing opening: add another array
// to its `variations` list.
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

  // Add more openings here as you send them.
];
