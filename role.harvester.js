var resourceUtil = require('utils.resource')

const roleHarvester = {
    run: function (creep) {
        if (creep.memory.transfering && creep.store.getUsedCapacity(RESOURCE_ENERGY) == 0) {
            creep.memory.transfering = false
            creep.say('🛺 harvesting', { visualizePathStyle: { stroke: '#fff' } })
        } else if (!creep.memory.transfering && creep.store.getFreeCapacity(RESOURCE_ENERGY) == 0) {
            creep.memory.transfering = true
            creep.say('🚌 transfering', { visualizePathStyle: { stroke: '#fbe16b' } })
        }
        // 采集逻辑：有不空的container找container，否则找resource
        if (!creep.memory.transfering) {
            let container = resourceUtil.findClosestUsedContainerOfSpawn(
                STRUCTURE_CONTAINER, STRUCTURE_STORAGE)
            if (container) {
                resourceUtil.withDrawEnergyFromStructure(creep, container)
            } else {
                // resourceUtil.park(creep)
                resourceUtil.harvestEnergyFromResource(creep,
                    resourceUtil.findClosestResourceOfSpawn())
            }
        } else {
            // 运输逻辑：优先store不满的我方建筑，没有则停车
            // FIND_MY_STRUCTURES不能找到container
            let structureList = creep.room.find(FIND_MY_STRUCTURES, {
                filter: (it) => (it.structureType == STRUCTURE_EXTENSION)
                    && it.store.getFreeCapacity(RESOURCE_ENERGY) > 0
            })
            if (!structureList.length) {
                structureList = creep.room.find(FIND_MY_STRUCTURES, {
                    filter: (it) =>
                        it.structureType == STRUCTURE_SPAWN
                        && 
                        it.store && it.store.getFreeCapacity(RESOURCE_ENERGY) > 0
                })
            }
            if (structureList.length) {
                let structure = structureList[0]
                let transferCode = creep.transfer(structure, RESOURCE_ENERGY)
                if (transferCode == ERR_NOT_IN_RANGE) {
                    creep.moveTo(structure, { visualizePathStyle: { stroke: '#fff' } })
                }
            } else {
                resourceUtil.park(creep)
            }
        }
    }
}

module.exports = roleHarvester