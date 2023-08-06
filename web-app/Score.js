/**
 * @namespace Score
 * @author Kaitai Yang
 * @version 2022.23
 * This module provides the scoring system for a Tetris Game.
 */

/**
 * The score object contains information about the score of the game.
 * @typedef {Object} Score
 * @property {number} score The current score.
 * @property {number} lines_cleared The number of lines cleared.
 * @property {boolean} last_was_tetris Indicates if the last line cleared was a tetris.
 * @memberof Score
 */
const Score = {};

/**
 * Adds the given number of points to the given score.
 * @function
 * @memberof Score
 * @param {Score.Score} score The current score.
 * @param {number} points The number of points to add.
 * @returns {Score.Score} The updated score.
 */
Score.add_points = function (score, points) {
    return {
        ...score,
        score: score.score + points,
    };
};

/**
 * Returns a game state for a new Tetris Game.
 * @function
 * @memberof Score
 * @returns {Score.Score} The new game.
 */
Score.new_score = function () {
    return {
        "score": 0,
        "lines_cleared": 0,
        "last_was_tetris": false
    };
};

/**
 * Returns the current level based on the given Score object.
 * Starts at level 1 and advances a level every 10 lines cleared.
 * @function
 * @memberof Score
 * @param {Score.Score} score The current score object.
 * @returns {number} The current level.
 */
Score.level = function (score) {
    return Math.floor(score.lines_cleared / 10) + 1;
};

/**
 * Returns a new Score object with additional lines cleared and the score updated.
 * @function
 * @memberof Score
 * @param {number} lines The number of lines cleared.
 * @param {Score.Score} score The current score object.
 * @returns {Score.Score} The updated score object.
 */
Score.cleared_lines = function (lines, score) {
    let pointsPerLevel = 0;
    const level = Score.level(score);
    switch (lines) {
        case 1: pointsPerLevel = 100; break;
        case 2: pointsPerLevel = 300; break;
        case 3: pointsPerLevel = 500; break;
        case 4: pointsPerLevel = score.last_was_tetris ? 1200 : 800; break;
        default: break;
    }
    return {
        "score": score.score + pointsPerLevel * level,
        "lines_cleared": score.lines_cleared + lines,
        "last_was_tetris": lines === 4
    };
};

export default Object.freeze(Score);
