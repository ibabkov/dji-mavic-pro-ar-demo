import * as ecs from '@8thwall/ecs'

import {GlobalEvent} from '../types'

enum LocalState {
  Idle = 'idle',
  Loading = 'loading',
}

/**
 * This component manages camera states such as idle and loading.
 */
ecs.registerComponent({
  name: 'Camera Controls',
  stateMachine: ({world}) => {
    /* -------------------------- Idle State -------------------------- */
    const idleState = ecs.defineState(LocalState.Idle)

    /* -------------------------- Loading State -------------------------- */
    const loadingState = ecs.defineState(LocalState.Loading).initial()
      .onEvent(GlobalEvent.CameraStart, idleState, {target: world.events.globalId})
      .onEnter(() => {
        world.events.dispatch(world.events.globalId, GlobalEvent.CameraStart)
      })
  },
})
