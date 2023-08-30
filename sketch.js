// MQTT client details:
let broker = {
    hostname: 'public.cloud.shiftr.io',
    port: 443
};

// MQTT client:
let client;

let creds = {
    clientID: 'p5Client',
    userName: 'public',
    password: 'public'
}



//----
let personalID;
let linkList = [];
let bgcList = ['orangered', 'chartreuse', 'gold'];
let bgc = 230;


//----
let input1, input2, input3;
let button1, button2;
let greeting;


//----
let changeBgc_gotMsg = false;
let changeCountDown = 0;



//--------------------------------------------------------
function setup() {

    createCanvas(windowWidth, 300);
    background(0);

    // Create an MQTT client:
    client = new Paho.MQTT.Client(broker.hostname, broker.port, creds.clientID);
    client.onConnectionLost = onConnectionLost;
    client.onMessageArrived = onMessageArrived;

    // connect to the MQTT broker:
    client.connect({
        onSuccess: onConnect, // callback function for when you connect
        userName: creds.userName, // username
        password: creds.password, // password
        //useSSL: true // use SSL
        useSSL: true
    });

    input1 = createInput();
    input1.position(20, 65);
    button1 = createButton('subscribe');
    button1.position(input1.x + input1.width, 65);
    button1.mousePressed(MQTT_subscribe);

    input2 = createInput();
    input2.position(20, 130);
    input3 = createInput();
    input3.addClass("textBox");
    input3.position(20, 160);
    input3.size(500);

    button2 = createButton('publish');
    button2.position(input2.x + input2.width, 130);
    button2.mousePressed(sendMqttMessage);

    greeting = createElement('h2', 'MQTT_Kit');
    greeting.position(20, 5);

    textAlign(CENTER);
    textSize(50);



}

function draw() {

    background(bgc);

    if (changeBgc_gotMsg) {
        background(200);
        changeCountDown++;
        if (changeCountDown > 60) changeBgc_gotMsg = false;
    }
}

function MQTT_subscribe() {
    let target_Topic = input1.value();
    client.subscribe(target_Topic)
    console.log("Topic subscribed: " + target_Topic)
    createP("Topic subscribed: " + target_Topic);
}


// called when the client connects
function onConnect() {
    console.log('client is connected');
}


// called when the client loses its connection
function onConnectionLost(response) {
    if (response.errorCode !== 0) console.log('onConnectionLost:' + response.errorMessage);
}

// called when a message arrives
function onMessageArrived(message) {
    console.log('I got a message:' + message.payloadString);
    createP('got msg: <span style="background-color: #FFFF00">' + message.payloadString + "</span>, at " + hour() + ":" + minute() + ":" + second());
    // p.style("color:red;");

    changeBgc_gotMsg = true;
    changeCountDown = 0;
}

// called when you want to send a message:
function sendMqttMessage() {
    // if the client is connected to the MQTT broker:
    if (client.isConnected()) {
        // start an MQTT message:
        message = new Paho.MQTT.Message(input3.value());
        // choose the destination topic:
        message.destinationName = input2.value();
        // send it:
        client.send(message);
        // print what you sent:
        console.log('I sent: ' + message.payloadString);
        createP('I sent: ' + message.payloadString);
    }
}