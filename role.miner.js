const resourceUtil = require('utils.resource')
/**
 * 运输者，从地图采集资源并将资源container（存储容器）中
 * @type {{run: roleMiner.run}}
 */
const roleMiner = {
    run: (creep) => {
        if (creep.store.getFreeCapacity(RESOURCE_ENERGY) == 0) { //如果没没有存储满的容器就执行
            let container = resourceUtil.findClosestEmptyContainerOfScreep(creep, STRUCTURE_CONTAINER)
            if (container) {
                if (creep.transfer(container, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(container, { visualizePathStyle: { stroke: '#fff' } })
                }
            }
        } else if (creep.room.find(FIND_DROPPED_RESOURCES, {filter: it => it.pos.isEqualTo(creep.pos)})) { //如果右掉落的资源执行
            let droppedResource =
                //  creep.pos.findClosestByRange([creep.pos])
                //   creep.pos.findInRange(FIND_DROPPED_RESOURCES,0)
                // 寻找所有掉落的资源
                creep.room.find(FIND_DROPPED_RESOURCES, {
                    filter: it => it.pos.isEqualTo(creep.pos)
                    // console.log(it.pos.isEqualTo(creep.pos))
                    // it.pos == creep.pos
                })
            // console.log(">>>", JSON.stringify(droppedResource))
            if (droppedResource.length) {
                console.log(creep.pickup(droppedResource[0]))
                if (creep.pickup(droppedResource) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(droppedResource, { visualizePathStyle: { stroke: '#fff' } })
                }
            }
            let resource = resourceUtil.findClosestResourceOfSpawn()
            if (resource) {
                resourceUtil.harvestEnergyFromResource(creep, resource)
            }
        }else { //无任务的时候执行升级者的工作
            let controller = creep.room.controller
            if (creep.upgradeController(controller) == ERR_NOT_IN_RANGE) {
                creep.moveTo(controller, { visualizePathStyle: { stroke: '#fff' } })
            }
        }
    }
}
module.exports = roleMiner