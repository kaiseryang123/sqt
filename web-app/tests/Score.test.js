import Tetris from "../Tetris.js";
import Score from "../Score.js";
import R from "../ramda.js";

const example_game = Tetris.new_game();
const field_string = `----------
----------
----------
----------
----------
----------
----------
----------
----------
----------
----------
----------
----------
----------
----------
----------
-S--------
SSS-------
SSSZ-IOOJJ
TSZZ-IOOJJ
TTZL-IOOJJ
TLLL-IOOJJ`;
example_game.field = field_string.split("\n").map(
    (s) => s.replace(/-/g, " ").split("")
);

describe("Score", function () {
    it(
        `A new tetris game
        * Starts on level one
        * With no lines cleared
        * With a score of zero`,
        function () {
            const new_game = Tetris.new_game();
            const score = new_game.score;
            if (Score.level(score) !== 1) {
                throw new Error("New games should start on level one");
            }
            if (score.lines_cleared !== 0) {
                throw new Error("New games should have no lines cleared");
            }
            if (score.score !== 0) {
                throw new Error("New games should have a zero score");
            }
        }
    );

    it(
        `The score tracks the lines that get cleared`,
        function () {
            let game = example_game;
            // Slot an I tetromino into the hole and drop.
            game.current_tetromino = Tetris.I_tetromino;
            game = Tetris.rotate_ccw(game);
            game = Tetris.hard_drop(game);

            if (game.score.lines_cleared !== 4) {
                throw new Error("Expecting 4 lines to clear");
            }
        }
    );

    it(
        `A single line clear scores 100 × level`,
        function () {
            let game = example_game;
            // Slot a T tetromino into the hole and drop.
            // This can only go one deep.
            game.current_tetromino = Tetris.Z_tetromino;

            // I could use hard_drop here, but that would also score.
            // Instead wait for it to drop 22 times.
            R.range(0, 22).forEach(function () {
                game = Tetris.next_turn(game);
            });

            if (game.score.score !== 100) {
                throw new Error("A single row cleared should score 100");
            }
        }
    );

    it(
        `A double line clear scores 300 × level`,
        function () {
            let game = example_game;
            // Insert the necessary tetrominos to clear two lines.

            // Adjust the current tetromino and positions as needed.
            // You can use soft_drop or hard_drop, but make sure to set up the game to clear two lines.

            // Simulate the game by calling Tetris.next_turn or other Tetris functions as needed.
            R.range(0, appropriate_number_of_turns).forEach(function () {
            game = Tetris.next_turn(game);
            });

            const expected_score = 300 * Score.level(game.score);
            if (game.score.score !== expected_score) {
            throw new Error(`A double line clear should score ${expected_score}, but scored ${game.score.score}`);
            }
        }
    );

    it(
        `A triple line clear scores 500 × level`,
        function () {
            let game = example_game;
            
            R.range(0, appropriate_number_of_turns).forEach(function () {
                game = Tetris.next_turn(game);
            });
    
            const expected_score = 500 * Score.level(game.score);
            if (game.score.score !== expected_score) {
                throw new Error(`A triple line clear should score ${expected_score}, but scored ${game.score.score}`);
            }
        }
    );
    

    it(
        `A tetris scores 800 × level`,
        function () {
            let game = example_game;
            R.range(0, appropriate_number_of_turns).forEach(function () {
                game = Tetris.next_turn(game);
            });
    
            const expected_score = 800 * Score.level(game.score);
            if (game.score.score !== expected_score) {
                throw new Error(`A tetris clear should score ${expected_score}, but scored ${game.score.score}`);
            }
        }
    );
    

    it(
        `Back to back tetrises score 1200 × level`,
        function () {
            let game = example_game;
            R.range(0, appropriate_number_of_turns_for_first_tetris).forEach(function () {
                game = Tetris.next_turn(game);
            });
    
            R.range(0, appropriate_number_of_turns_for_second_tetris).forEach(function () {
                game = Tetris.next_turn(game);
            });
    
            const expected_score = 1200 * Score.level(game.score);
            if (game.score.score !== expected_score) {
                throw new Error(`Back to back tetrises should score ${expected_score}, but scored ${game.score.score}`);
            }
        }
    );
    

    it(
        `A soft drop score 1 point per cell descended`,
        function () {
            let game = example_game;
    
            const initial_score = game.score.score;
            const number_of_cells_descended = 5; // Adjust this based on the test setup.
    
            R.range(0, number_of_cells_descended).forEach(function () {
                game = Tetris.soft_drop(game);
            });
    
            const expected_score = initial_score + number_of_cells_descended;
            if (game.score.score !== expected_score) {
                throw new Error(`A soft drop should score 1 point per cell descended. Expected ${expected_score}, but scored ${game.score.score}`);
            }
        }
    );
    

    it(
        `A hard drop score 2 points per cell descended`,
        function () {
            let game = example_game;
    
            const initial_score = game.score.score;
            const number_of_cells_descended = 10; // Adjust this based on the test setup.
    
            // Perform the hard drop.
            game = Tetris.hard_drop(game);
    
            const expected_score = initial_score + number_of_cells_descended * 2;
            if (game.score.score !== expected_score) {
                throw new Error(`A hard drop should score 2 points per cell descended. Expected ${expected_score}, but scored ${game.score.score}`);
            }
        }
    );
    
    it(
        `Advancing the turn without manually dropping scores nothing.`,
        function () {
            let game = example_game;
    
            const initial_score = game.score.score;
    
            // Advance the turn without manually dropping.
            game = Tetris.next_turn(game);
    
            if (game.score.score !== initial_score) {
                throw new Error(`Advancing the turn without manually dropping should not change the score. Expected ${initial_score}, but scored ${game.score.score}`);
            }
        }
    );
    
});
