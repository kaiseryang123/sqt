import Tetris from "../Tetris.js";
import Score from "../Score.js";
import R from "../ramda.js";

const custom_game = Tetris.new_game();
const custom_field_string = `----------
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
----------
----------
----------
TSZZ--OOJJ
TTZL-IOOJJ
OOOO-IOOJJ`;
custom_game.field = custom_field_string.split("\n").map(
    (s) => s.replace(/-/g, " ").split("")
);
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
            game.current_tetromino = Tetris.T_tetromino;

            // I could use hard_drop here, but that would also score.
            // Instead wait for it to drop 22 times.
            R.range(0, 22).forEach(function () {
                game = Tetris.next_turn(game);
            });
            const expected_score = 100 * Score.level(game.score);
            if (game.score.score !== 100) {
                throw new Error(`A single line clear should score ${expected_score}, but scored ${game.score.score}`);
            }
        }
    );
    
     

    it(
        `A double line clear scores 300 × level`, 
        function () {
         let game = Tetris.new_game();
    
         // 将五个O型方块填充到最底部的两行中。
         for (let i = 0; i < 5; i++) {
            game.current_tetromino = Tetris.O_tetromino;
            game.position = [2 * i, Tetris.field_height - 2]; // 设置O型方块的起始位置
    
            // 使用硬下落来模拟方块下落。
            game = Tetris.hard_drop(game);
        }
    
         // 由于我们清除了两行，所以预期得分是300乘以当前等级。
         const expected_score = 300 * Score.level(game.score);
         if (game.score.score !== expected_score) {
            throw new Error(`A double line clear should score ${expected_score}, but scored ${game.score.score}`);
        }
    });       
    

    it(
        `A triple line clear scores 500 × level`,
        function () {
            let game = custom_game;
            
            game.current_tetromino = Tetris.J_tetromino;
            game = Tetris.rotate_ccw(game);


            // I could use hard_drop here, but that would also score.
            // Instead wait for it to drop 22 times.
            R.range(0, 22).forEach(function () {
                game = Tetris.next_turn(game);
            });
            const expected_score = 500 * Score.level(game.score);
            if (game.score.score !== 500) {
                throw new Error(`A single line clear should score ${expected_score}, but scored ${game.score.score}`);
            }
        }
    );
    

    it(
        `A tetris scores 800 × level`,
        function () {
            let game = example_game;
            // Slot a I tetromino into the hole and drop.
            // This can only go one deep.
            game.current_tetromino = Tetris.I_tetromino;
            game = Tetris.rotate_ccw(game);

            // I could use hard_drop here, but that would also score.
            // Instead wait for it to drop 22 times.
            R.range(0, 22).forEach(function () {
                game = Tetris.next_turn(game);
            });
            const expected_score = 800 * Score.level(game.score);
            if (game.score.score !== 800) {
                throw new Error(`A single line clear should score ${expected_score}, but scored ${game.score.score}`);
            }
        }
    );
    

    it(`Back-to-Back Tetris scores`, function () {
        let game = example_game;
    
        // 第一次Tetris
        game.current_tetromino = Tetris.I_tetromino;
        game = Tetris.rotate_ccw(game);
        R.range(0, 22).forEach(function () {
            game = Tetris.next_turn(game);
        });
        const first_tetris_score = 800 * Score.level(game.score);
        if (game.score.score !== first_tetris_score) {
            throw new Error(`First Tetris should score ${first_tetris_score}, but scored ${game.score.score}`);
        }
    
        // 重新加载example_game，但保持分数不变
        let game_after_first_tetris = example_game;
        game_after_first_tetris.score = game.score;
    
        // 第二次Tetris
        game_after_first_tetris.current_tetromino = Tetris.I_tetromino;
        game_after_first_tetris = Tetris.rotate_ccw(game_after_first_tetris);
        R.range(0, 22).forEach(function () {
            game_after_first_tetris = Tetris.next_turn(game_after_first_tetris);
        });
        const second_tetris_score = 1200 * Score.level(game_after_first_tetris.score); // 如果有B2B加成，你可能需要修改这里的得分计算
        const expected_total_score = first_tetris_score + second_tetris_score;
        if (game_after_first_tetris.score.score !== expected_total_score) {
            throw new Error(`Back-to-Back Tetris should score ${expected_total_score}, but scored ${game_after_first_tetris.score.score}`);
        }
    });
    
    

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
            let game = Tetris.new_game();
    
            const initial_score = game.score.score;
            const number_of_cells_descended = 21; // Adjust this based on the test setup.
    
            game.current_tetromino = Tetris.I_tetromino;
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
