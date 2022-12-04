var roleUpgrader = {

    /** @param {Creep} creep **/
    run: function(creep) {
        console.log(crerp.memory.role+":"+creep.store[RESOURCE_ENERGY]);
	    if(creep.store[RESOURCE_ENERGY] < creep.store.getCapacity()) {
            //采矿
            var sources = creep.room.find(FIND_SOURCES);
            if(creep.harvest(sources[0]) == ERR_NOT_IN_RANGE) {
                creep.moveTo(sources[0]);
            }
        }
        else {
            //送资源给控制器
            if(creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
                creep.moveTo(creep.room.controller);
            }
        }
	}
};

module.exports = roleUpgrader;