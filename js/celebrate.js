//Taken from https://www.kirilv.com/canvas-confetti/#realistic, tysm i will eventually learn how to use this confetti stuff

function fireworks() {
    var duration = 9 * 1000;
    var animationEnd = Date.now() + duration;
    var colors = ["#EF539D", "#BBB0DC", "#F1D2E7", "#DB706C", "#FCF695", "#A6DCDE", "#CEE5D5", "#FFFFFF", "#B7D3E9", "#F1C3AA", "#F3AA51", "#567ACE", "#D9598C"];

    var defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

    function randomInRange(min, max) {
        return Math.random() * (max - min) + min;
    }

    var interval = setInterval(function() {
        var timeLeft = animationEnd - Date.now();

        if (timeLeft <= 0) {
            return clearInterval(interval);
        }

        var particleCount = 50 * (timeLeft / duration);

        // since particles fall down, start a bit higher than random
        confetti(Object.assign({}, defaults, { particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } }));
        confetti(Object.assign({}, defaults, { particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } }));
    }, 250);
}

