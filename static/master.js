var gameState = {
    progress: 0,
    glance: {
        day: 1,
        timeLeft: 20,
        money: 5,
        begLvl: 0
    },
    vitals: {
        health: 100,
        thirst: 100,
        hunger: 100,
        warmth: 100
    },
    forcast: {
        sunny: true,
        hasBlanket: false
    },
    inventory: ""
};

var timer = null;
var socket = null;

window.onload = function () {
    $("#start").click(startGame);
    $("#stop").click(stopGame);
    $("#reset").click(restartGame);
    
    $("#btn-day").click(function () {
        var value = $("#input-day").val();
        value = parseInt(value);
        gameState.glance.day = value;
        gameState.progress = gameState.glance.day * 20 + (20 - gameState.glance.timeLeft);
    });
    $("#btn-money").click(function () {
        var value = $("#input-money").val();
        value = parseInt(value);
        gameState.glance.money = value;
    });
    $("#btn-begLvl").click(function () {
        var value = $("#input-begLvl").val();
        value = parseInt(value);
        gameState.glance.begLvl = value;
    });
    $("#btn-health").click(function () {
        var value = $("#input-health").val();
        value = parseInt(value);
        gameState.vitals.health = value;
    });
    $("#btn-thirst").click(function () {
        var value = $("#input-thirst").val();
        value = parseInt(value);
        gameState.vitals.thirst = value;
    });
    $("#btn-hunger").click(function () {
        var value = $("#input-hunger").val();
        value = parseInt(value);
        gameState.vitals.hunger = value;
    });
    $("#btn-warmth").click(function () {
        var value = $("#input-warmth").val();
        value = parseInt(value);
        gameState.vitals.warmth = value;
    });
    $("#btn-blanket").click(function () {
        var value = $("#input-blanket").val();
        if (value == "yes" || value == "Yes" || value == "YES") {
            gameState.forcast.hasBlanket = true;
        } else {
            gameState.forcast.hasBlanket = false;
        }
    });
    $("#inventory-btn").click(function () {
        var value = $("#inventory").val();
        gameState.inventory = value;
    });
    
    socket = io.connect(location.href);
}

function startGame() {
    timer = setInterval(tickGame, 1000);
    disable("start", true);
    disable("stop", false);
    socket.emit('start');
    socket.emit('push', gameState);
}

function stopGame() {
    clearInterval(timer);
    timer = null;
    disable("stop", true);
    disable("start", false);
    socket.emit('stop');
}

function restartGame() {
    stopGame();
    socket.emit("restart");
    location.reload();
}

function disable(id, disabled){
    $("#"+id).prop("disabled",disabled);
}

function tickGame() {
    gameState.glance.timeLeft--;
    if (gameState.glance.timeLeft < 0) {
        gameState.glance.day++;
        gameState.glance.timeLeft = 20;
        if (getRandomIntInclusive(0, 2) == 0) {
            gameState.forcast.sunny = false;
        } else {
            gameState.forcast.sunny = true;
        }
    }
    gameState.progress++;
    
    fillSpans();
    gameState.vitals.warmth += calcWarmthChange();
    gameState.vitals.thirst += calcThirstLevel();
    gameState.vitals.hunger += calcHungerChange();
    gameState.vitals.health += calcHealthLevel();
    
    if (gameState.vitals.warmth > 100) {
        gameState.vitals.warmth = 100;
    } else if (gameState.vitals.warmth < 0) {
        gameState.vitals.warmth = 0;
    }
    
    if (gameState.vitals.thirst > 100) {
        gameState.vitals.thirst = 100;
    } else if (gameState.vitals.thirst < 0) {
        gameState.vitals.thirst = 0;
    }
    
    if (gameState.vitals.hunger > 100) {
        gameState.vitals.hunger = 100;
    } else if (gameState.vitals.hunger < 0) {
        gameState.vitals.hunger = 0;
    }
    
    if (gameState.vitals.health > 100) {
        gameState.vitals.health = 100;
    } else if (gameState.vitals.health < 0) {
        gameState.vitals.health = 0;
    }
    socket.emit('push', gameState);
    
    if (gameState.progress >= 100 || gameState.vitals.health == 0) {
        stopGame();
    }
}

function fillSpans() {
    $("#day").html(gameState.glance.day);
    $("#timeLeft").html(gameState.glance.timeLeft);
    $("#money").html(gameState.glance.money);
    $("#begLvl").html(gameState.glance.begLvl);
    $("#health").html(gameState.vitals.health);
    $("#thirst").html(gameState.vitals.thirst);
    $("#hunger").html(gameState.vitals.hunger);
    $("#warmth").html(gameState.vitals.warmth);
    $("#weather").html(gameState.forcast.sunny ? "Sunny" : "Rainy");
    $("#weather").html(gameState.forcast.sunny ? "Sunny" : "Rainy");
    $("#blanket").html(gameState.forcast.hasBlanket ? "Yes" : "No");
    $("#disabled-inventory").val(gameState.inventory);
}

function getRandomIntInclusive(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min; //The maximum is inclusive and the minimum is inclusive 
}

function calcWarmthChange() {
    var change = 0;
    if (gameState.forcast.sunny) {
        change = getRandomIntInclusive(4, 6);
    } else if (!gameState.forcast.hasBlanket) {
        change = getRandomIntInclusive(-4, -2);
    } else {
        change = -1;
    }
    return change;
}

function calcHungerChange() {
    return getRandomIntInclusive(-2, 0);
}

function calcThirstLevel() {
    var change = getRandomIntInclusive(-3, -1);
    if (!gameState.forcast.sunny) {
        change = getRandomIntInclusive(-2, 2);
    }
    return change;
}

function calcHealthLevel() {
    var change = 0;
    if (gameState.vitals.warmth <= 0) {
        change += getRandomIntInclusive(-3, -1);
    }
    if (gameState.vitals.thirst <= 0) {
        change += getRandomIntInclusive(-5, -3);
    }
    if (gameState.vitals.hunger <= 0) {
        change += getRandomIntInclusive(-4, -2);
    }
    return change;
}