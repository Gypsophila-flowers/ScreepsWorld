var resourceUtil = require('utils.resource')

const roleTransfer = {
    run: function (creep) {
        if (creep.memory.transfering && creep.store.getUsedCapacity(RESOURCE_ENERGY) == 0) {
            creep.memory.transfering = false
            creep.say('🛺 harvesting', { visualizePathStyle: { stroke: '#fff' } })
        } else if (!creep.memory.transfering && creep.store.getFreeCapacity(RESOURCE_ENERGY) == 0) {
            creep.memory.transfering = true
            creep.say('transfering', { visualizePathStyle: { stroke: '#fff' } })
        }
        //采集优先级：散落资源>container
        if (!creep.memory.transfering) {
            let container = resourceUtil.findClosestUsedContainerOfSpawn(STRUCTURE_CONTAINER)
            if (container) {
                resourceUtil.withDrawEnergyFromStructure(creep, container)
            } else {
                // resourceUtil.park(creep)
            }
        } else {
            // 运输逻辑：优先storage，没有则停车
            let structureList = creep.room.find(FIND_MY_STRUCTURES, {
                filter: (it) => (it.structureType == STRUCTURE_STORAGE)
                    && it.store.getFreeCapacity(RESOURCE_ENERGY) > 0
            })
            if (structureList.length) {
                let structure = structureList[0]
                let transferCode = creep.transfer(structure, RESOURCE_ENERGY)
                if (transferCode == ERR_NOT_IN_RANGE) {
                    creep.moveTo(structure, { visualizePathStyle: { stroke: '#fff' } })
                }
            } else {
                //无本职工作的时候承担运输者的省份
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
                    //resourceUtil.park(creep)
                }
            }
        }
    }
}

module.exports = roleTransfer