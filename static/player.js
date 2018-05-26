var socket = null;
var gauge = null;

function makeGauge() {
    var opts = {
      angle: 0.02, // The span of the gauge arc
      lineWidth: 0.36, // The line thickness
      radiusScale: 1, // Relative radius
      pointer: {
        length: 0.6, // // Relative to gauge radius
        strokeWidth: 0.06, // The thickness
        color: '#000000' // Fill color
      },
      limitMax: false,     // If false, max value increases automatically if value > maxValue
      limitMin: false,     // If true, the min value of the gauge will be fixed
      colorStart: '#6F6EA0',   // Colors
      colorStop: '#C0C0DB',    // just experiment with them
      strokeColor: '#EEEEEE',  // to see which ones work best for you
      generateGradient: true,
      highDpiSupport: true,     // High resolution support
      percentColors: [[0.0, "#a9d70b" ], [0.50, "#f9c802"], [1.0, "#ff0000"]],
    staticLabels: {
    font: "10px sans-serif",  // Specifies font
    labels: [0, 20, 40, 60, 80, 100],  // Print labels at these values
    color: "#000000",  // Optional: Label text color
    fractionDigits: 0  // Optional: Numerical precision. 0=round off.
    },
    staticZones: [
       {strokeStyle: "#F03E3E", min: 0, max: 20}, // Red from 100 to 130
       {strokeStyle: "#F03E3E", min: 20, max: 40}, // Yellow
       {strokeStyle: "#FFDD00", min: 40, max: 60}, // Green
       {strokeStyle: "#FFDD00", min: 60, max: 80}, // Yellow
       {strokeStyle: "#30B32D", min: 80, max: 100}  // Red
    ],
    };
    var target = document.getElementById('begLvlCanv'); // your canvas element
    gauge = new Gauge(target).setOptions(opts); // create sexy gauge!
    gauge.maxValue = 100; // set max gauge value
    gauge.setMinValue(0);  // Prefer setter over gauge.minValue = 0
    gauge.animationSpeed = 69; // set animation speed (32 is default value)
    gauge.set(0); // set actual value
}


socket = io.connect(location.href);
socket.on('start', function(data) {
    $("#main-game").show();
    $("#instructions").hide();
    startGame();
});
socket.on('restart', function(data) {
    location.reload();
});

socket.on('stop', function(data) {
    alert("Game stopped!");
});

function startGame() {
    makeGauge();
}

socket.on("push", function (data) {
    $("#gamePercent").html(data.progress);
    $("#gameProgress").css("width", data.progress + "%");
    
    $("#health-level-num").html(data.vitals.health);
    $("#health-level").css("width", data.vitals.health + "%");
    
    $("#thirst-level-num").html(data.vitals.thirst);
    $("#thirst-level").css("width", data.vitals.thirst + "%");
    
    $("#hunger-level-num").html(data.vitals.hunger);
    $("#hunger-level").css("width", data.vitals.hunger + "%");
    
    $("#warmth-level-num").html(data.vitals.warmth);
    $("#warm-level").css("width", data.vitals.warmth + "%");
    
    $("#day").html(data.glance.day);
    $("#day-left").html(data.glance.timeLeft);
    $("#money").html(data.glance.money);
    $("#beg-level").html(data.glance.begLvl);
    gauge.set(data.glance.begLvl);
    $("#weather").html(data.forcast.sunny ? "Sunny" : "Rainy");
    if (data.forcast.sunny) {
        $("#weather-img").attr("src", "/static/sunny.png");
    } else {
        $("#weather-img").attr("src", "/static/rainy.png");
    }
    
    var inv = data.inventory.split("\n");
    var lis = "";
    for (var i = 0; i < inv.length; i++) {
        if (inv[i] == "") {
            continue;
        }
        lis += "<li>" + inv[i] + "</li>";
    }
    $("#inventory-list").html(lis);
    
});