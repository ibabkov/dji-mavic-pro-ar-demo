import * as ecs from '@8thwall/ecs'

import {GlobalEvent, GlobalState} from './types'

enum LocalEvent {
  ChangeState = 'change-state',
}
enum LocalState {
  WaitBeforeCoaching = 'wait-before-coaching',
  WaitBeforeIdle = 'wait-before-idle',
}

/**
 * The main component.
 * This component manages scene-level states.
 */
ecs.registerComponent({
  name: 'App',
  schema: {
    loadingMinDuration: ecs.i32,  // Minimum duration (in milliseconds) for the loading state.
    coachingMinDuration: ecs.i32,  // Minimum duration (in milliseconds) for the coaching state.
  },
  schemaDefaults: {
    loadingMinDuration: 8000,
    coachingMinDuration: 8000,
  },
  stateMachine: ({world, eid, schemaAttribute}) => {
    const {loadingMinDuration, coachingMinDuration} = schemaAttribute.get(eid)

    /* -------------------------- Idle State -------------------------- */
    /**
     * Idle state where the drone remains inactive.
     * User can travel around the scene
     */
    const idleState = ecs.defineState(GlobalState.Idle)
      .onEnter(() => {
        world.events.dispatch(world.events.globalId, GlobalEvent.HideCoachingUI)
      })
    const waitBeforeIdle = ecs.defineState(LocalState.WaitBeforeIdle)
      .wait(coachingMinDuration, GlobalState.Idle)
      .onEnter(() => {
        world.events.dispatch(world.events.globalId, GlobalEvent.HideFullscreenUI)
        world.events.dispatch(world.events.globalId, GlobalEvent.ShowCoachingUI)
        world.events.dispatch(world.events.globalId, GlobalEvent.Idle)
      })
    const waitBeforeCoaching = ecs.defineState(LocalState.WaitBeforeCoaching)
      .wait(loadingMinDuration, LocalState.WaitBeforeIdle)

    /* -------------------------- Loading State -------------------------- */
    /**
     * Loading state where the application initializes and show the initial 2D UI
     */
    const loadingState = ecs.defineState(GlobalState.Loading).initial()
      .onEvent(LocalEvent.ChangeState, waitBeforeCoaching, {target: eid})
      .listen(world.events.globalId, GlobalEvent.CameraStart, () => {
        world.events.dispatch(eid, LocalEvent.ChangeState)
      })
      .onEnter(() => {
        world.events.dispatch(world.events.globalId, GlobalEvent.ShowFullscreenUI)
      })
  },
})
