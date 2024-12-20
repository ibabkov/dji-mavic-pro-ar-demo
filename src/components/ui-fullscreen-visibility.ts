import * as ecs from '@8thwall/ecs'

import {GlobalEvent} from '../types'

enum LocalState {
  Visible = 'visible',
  Hidden = 'hidden',
}

/**
 * A component that manages visibility of the fullscreen UI.
 */
ecs.registerComponent({
  name: 'UI Fullscreen Visibility',

  schema: {
    visibleOffset: ecs.string,  // The bottom offset of the UI when visible (e.g., in CSS units).
    hiddenOffset: ecs.string,   // The bottom offset of the UI when hidden (e.g., off-screen position).
  },
  schemaDefaults: {
    visibleOffset: '0',
    hiddenOffset: '10000',
  },
  stateMachine: ({world, eid, schemaAttribute}) => {
    const visibleState = ecs.defineState(LocalState.Visible)
    const hiddenState = ecs.defineState(LocalState.Hidden).initial()
    const {visibleOffset, hiddenOffset} = schemaAttribute.get(eid)

    /* -------------------------- Visible State -------------------------- */
    visibleState
      .onEvent(GlobalEvent.HideFullscreenUI, hiddenState, {target: world.events.globalId})
      .onEnter(() => {
        ecs.Ui.cursor(world, eid).marginTop = visibleOffset
      })
      .onExit(() => {
        // This is the most efficient way to manage visibility
        // since we don't have direct access to DOM
        ecs.Ui.cursor(world, eid).marginTop = hiddenOffset
      })

    /* -------------------------- Hidden State -------------------------- */
    hiddenState
      .onEvent(GlobalEvent.ShowFullscreenUI, visibleState, {target: world.events.globalId})
  },
})
