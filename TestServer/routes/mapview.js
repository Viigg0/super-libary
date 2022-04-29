var express = require('express');
var router = express.Router();
var Players = require('../model/playerDB.js');
var GameMap = require('./../model/mapDB');

let players = Players.players;
let gameMap = GameMap.gameMap;


/* GET home page. */
router.get('/', function(req, res, next) {
    if (req.session.loggedIn){
        res.render('mapview', {username: req.session.name});
    } else {
        res.redirect('/');
    }
});

router.get('/playerdata', function (req,res){
    // Should send an object with visible values
    res.send(getPlayer(req, res));
});

router.get('/start', function (req,res){
    // Should send an object with visible values
    res.send(getStartValues());
});

router.get('/update', function (req,res){
    // Should send an object with visible values
    res.send(getUpdateValues());
});


// Test route in prep for send troops
router.get('/sendId', function (req,res){
    // Should send an object with visible values
    res.send(showId(req,res));
});

function showId(req,res){
    console.log("x="+req.query.x);
    console.log("y="+req.query.y);
    console.log("troopsSend="+req.query.troopsSend);
}

// Test route in prep for send troops
router.get('/sendTroopsToLocation', function (req,res){
    // Should send an object with visible values
    showId(req, res);
    let text = sendTroopsToLocation(req,res);
    console.log(text);
    res.send(text);
});

function sendTroopsToLocation(req,res){
    let cell = gameMap.cellArray[req.query.x][req.query.y];
    let attackingTroops = Number(req.query.troopsSend);
    players.get(req.session.name).town.troopsInside -= attackingTroops;
    if (cell.owner==req.session.name){
        cell.type.troopsInside += attackingTroops;
        return {
            message: "You own this tile already, moving troops!",
            victory: false
        };
    } else if (cell.type.type == "town"){
        if (players.get(cell.type.owner).gold>attackingTroops){
            players.get(cell.type.owner).gold -= attackingTroops;
            players.get(req.session.name).gold += attackingTroops;
            return {
                message: "You stole "+ attackingTroops + " gold from " + cell.type.owner,
                victory: false
            };
        } else {
            let goldText = players.get(cell.type.owner).gold;
            players.get(req.session.name).gold += players.get(cell.type.owner).gold;
            players.get(cell.type.owner).gold = 0;
            return {
                message: "You stole "+ goldText + " gold from " + cell.type.owner,
                victory: false
            };
        }
    }//if uncontrolled
    else if (cell.type.owner==""){
        return takeControlOfCell(cell, attackingTroops, req, res);
    } //if controlled by another player
    else {
        if (attackingTroops>cell.type.troopsInside){
            attackingTroops -= cell.type.troopsInside;
            return takeControlOfCell(cell, attackingTroops, req, res);
        } else {
            cell.type.troopsInside = cell.type.troopsInside - attackingTroops;
            return {
                message: "You lost, " + cell.type.troopsInside + " troop remaining on " + cell.location,
                victory: false
            };
        }

    }
}
//Still needs a function in player calls to handle changes in income
function takeControlOfCell(cell, attackingTroops, req, res){
    console.log("Time to take control");
    if (cell.owner!="") {
        players.get(cell.owner).removeField(cell.type);
    }
    cell.owner = req.session.name;
    players.get(req.session.name).addField(cell.type);
    cell.type.troopsInside = attackingTroops;
    return {
        message: "You now control the " + cell.type.type + " at " + cell.location,
        victory: true
    };
}

// This function should return an object with visible values for start
function getStartValues(){
    //Values: All player town hall level, field ownership, (if map approach, then also:
    // field income value, troops on every plot.)
    let mapObject = [];
    for (let i = 0; i < 9; i++) {
        mapObject.push([]);
    }
    for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++) {
            mapObject[i][j] = {};
            mapObject[i][j].owner = gameMap.cellArray[i][j].owner;
            mapObject[i][j].troopsInside = gameMap.cellArray[i][j].type.troopsInside;
        }
    }
    console.log("Im done! Here's start values ");
    return mapObject;
}

// This function should return an object with visible values for update
function getUpdateValues(){
    //Values: All player town hall level, toops inside, ownership
    let mapObject = [[]];
    for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++) {
            mapObject[i][j].cell = {};
            mapObject[i][j].cell.owner = gameMap.cellArray[i][j].owner;
            mapObject[i][j].cell.troopsInside = gameMap.cellArray[i][j].type.troopsInside;
            if (gameMap.cellArray[i][j].type.type == "town"){
                mapObject[i][j].cell.townHallLVL = gameMap.cellArray[i][j].type.townHall.lvl;
            } else if (gameMap.cellArray[i][j].type.type == "common" || gameMap.cellArray[i][j].type.type == "gold"){
                mapObject[i][j].cell.resourcesPerSec = gameMap.cellArray[i][j].type.resourcesPerSec;
            }

        }
    }

    return mapObject;
}

function troopsInside(x, y){
    return gameMap.cellArray[x][y].type.troopsInside;
}

function getOwnership(x, y){
    return gameMap.cellArray[x][y].type.owner;
}

function getPlayer(req, res){
    console.log(req.session.name + " updated");
    let player = players.get(req.session.name);
    return {
        gold: player.gold,
        common: player.resources,
        troops: player.town.troopsInside,
        playerLocation: player.mapCoordinates[0].toString()+player.mapCoordinates[1].toString()
    }
}

module.exports = router;