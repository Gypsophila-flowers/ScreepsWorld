var roleHarvester = require('role.harvester');
var roleUpgrader = require('role.upgrader');
var roleBuild = require('role.build');

module.exports.loop = function () {
    
    for(var name in Memory.creeps) {
        //判断在内存中能不能获取到这个creep，不能则删除这个内存
        if(!Game.creeps[name]) {
            delete Memory.creeps[name];
            console.log('Clearing non-existing creep memory:', name);
        }
    }
    
    var harvesters = _.filter(Game.creeps, (creep) => creep.memory.role == 'harvester');
    // console.log('Harvesters（采集者）: ' + harvesters.length);
    //判断存在的creep数量，少于2则创建
    if(harvesters.length < 2) {
        var newName = 'Harvester' + Game.time;
        console.log('Spawning new harvester: ' + newName);
        Game.spawns['Spawn1'].spawnCreep([WORK,WORK,CARRY,CARRY,MOVE,MOVE], newName, 
            {memory: {role: 'harvester'}});        
    }
    
    var upgraders = _.filter(Game.creeps, (creep) => creep.memory.role == 'upgrader');
    // console.log('Upgraders（占领者）: ' + harvesters.length);
    //判断存在的creep数量，少于2则创建
    if(upgraders.length < 2) {
        var newName = 'Upgraders' + Game.time;
        console.log('Spawning new upgrader: ' + newName);
        Game.spawns['Spawn1'].spawnCreep([WORK,WORK,CARRY,CARRY,MOVE,MOVE], newName, 
            {memory: {role: 'upgrader'}});        
    }
    
    var builds = _.filter(Game.creeps, (creep) => creep.memory.role == 'build');
    // console.log('Builds（建造者）: ' + harvesters.length);
    //判断存在的creep数量，少于2则创建
    if(builds.length < 1) {
        var newName = 'Builds' + Game.time;
        console.log('Spawning new build: ' + newName);
        Game.spawns['Spawn1'].spawnCreep([WORK,WORK,CARRY,CARRY,MOVE,MOVE], newName, 
            {memory: {role: 'build'}});        
    }
    
    //判断是不是在创建中，是的话显示出来
    if(Game.spawns['Spawn1'].spawning) { 
        var spawningCreep = Game.creeps[Game.spawns['Spawn1'].spawning.name];
        Game.spawns['Spawn1'].room.visual.text(
            '🛠️' + spawningCreep.memory.role,
            Game.spawns['Spawn1'].pos.x + 1, 
            Game.spawns['Spawn1'].pos.y, 
            {align: 'left', opacity: 0.8});
    }
    
    for(var name in Game.creeps) {
        var creep = Game.creeps[name];
        if(creep.memory.role == 'harvester') {
            roleHarvester.run(creep);
        }
        if(creep.memory.role == 'upgrader') {
            roleUpgrader.run(creep);
        }
        if(creep.memory.role == 'build') {
            roleBuild.run(creep);
        }
    }
}