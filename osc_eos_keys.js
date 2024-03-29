var DEBUG = false;
var wheel = {
  "id": 0,
  "name": "-",
  "value":0,
  "param": "-"
}

function parseWheel(data, id) {
  var label_regExp = /([^)]+)\[/;
  var value_regExp = /\[([^)]+)\]/;
  wheel.id = id;
  wheel.name = label_regExp.exec(data['args'][0]["value"])[1].trim();
  wheel.param = wheel.name.toLowerCase();
  wheel.value = value_regExp.exec(data['args'][0]["value"])[1];
  //assignWheelLabel();
  assignWheelValue();
  assignWheelButtonsValue();
  assignWheelKeyLabel();
}

function assignWheelKeyLabel() {
  receive('/EDIT', 'wheel_key_'+ wheel.id, {
    label: wheel.name,
    address: "/eos/cmd/"+ wheel.param,
    widgets: []
  });
}

function assignWheelLabel() {
  receive('/EDIT', 'wheel_'+ wheel.id+ '_label', {
    value: wheel.name,
    widgets: []
  });
}

function assignWheelValue() {
  receive('/EDIT', 'wheel_'+ wheel.id+ '_value', {
    value: wheel.value,
    widgets: []
  });
}

function assignWheelButtonsValue() {
  receive('/EDIT', 'wheel_'+ wheel.id+ '_button_1', {
    address: "/eos/param/"+ wheel.param+ "/min",
    widgets: []
  });
  receive('/EDIT', 'wheel_'+ wheel.id+ '_button_2', {
    address: "/eos/param/"+ wheel.param+ "/home",
    widgets: []
  });
  receive('/EDIT', 'wheel_'+ wheel.id+ '_button_3', {
    address: "/eos/param/"+ wheel.param+ "/max",
    widgets: []
  });
}

function parseCmdLine(data) {
  var color = "#ffff00";
  switch(data['args'][0]["value"].split(":")[0].trim()) {
    case "BLIND":
      color = "#0092ff";
      break;
    default:
      color = "#ffff00";
  }
  receive('/EDIT', 'command_line_1', {
    colorText: color,
    value: data['args'][0]["value"],
    widgets: []
  });
}

module.exports = {
  oscInFilter: (data)=>{
    if (DEBUG) console.log("in data : "+ JSON.stringify(data, null, 2));
    var {address, args, host, port, clientId} = data;
    if (address == "/eos/out/cmd") {
      parseCmdLine(data);
      //return;
    }
    var items = address.split("/");
    if (items[3]=="active" && items[4]=="wheel") {
      parseWheel(data, items[5]);
      //return;
    }
    return data;
  },
}