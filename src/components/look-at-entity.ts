import * as ecs from '@8thwall/ecs'

import {UP} from '../constants'
import {GlobalEvent} from '../types'

enum LocalState {
  Idle = 'idle',
  Tracking = 'tracking',
}

/**
 * This component makes an entity rotate around Y axis to face a target entity.
 */
ecs.registerComponent({
  name: 'Look At Entity',
  schema: {
    entity: ecs.eid,  // The target entity ID that this component will look at.
  },
  stateMachine: ({world, eid, schemaAttribute}) => {
    const {entity} = schemaAttribute.get(eid)
    const origin = ecs.math.vec3.from(ecs.Position.get(world, eid))

    // Initialize reusable math objects
    const q = ecs.math.quat.zero()
    const v = ecs.math.vec3.zero()

    /* -------------------------- Tracking State -------------------------- */
    /**
     * State where the entity continuously rotates to face the target.
     */
    const trackingState = ecs.defineState(LocalState.Tracking)
      .onTick(() => {
        const quaternion = q.setFrom(ecs.Quaternion.get(world, eid))
        const cameraPosition = ecs.Position.get(world, entity)
        const target = v.setXyz(cameraPosition.x, origin.y, cameraPosition.z)

        quaternion.makeLookAt(origin, target, UP)
        ecs.Quaternion.set(world, eid, quaternion)
      })

    /* -------------------------- Idle State -------------------------- */
    const idleState = ecs.defineState(LocalState.Idle).initial()
      .onEvent(GlobalEvent.Idle, trackingState, {target: world.events.globalId})
  },
})
