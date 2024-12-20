import * as ecs from '@8thwall/ecs'

import {GlobalEvent} from '../types'

enum LocalState {
  Visible = 'visible',
  Hidden = 'hidden',
}

/**
 * A component that manages visibility of the coaching UI.
 */
ecs.registerComponent({
  name: 'UI Coaching Visibility',
  schema: {
    visibleOffset: ecs.string,   // The bottom offset of the UI when visible (e.g., in CSS units).
    hiddenOffset: ecs.string,    // The bottom offset of the UI when hidden (e.g., off-screen position).
    animationDuration: ecs.i32,  // The duration of the visibility transition animation in milliseconds.
    animationRange: ecs.f32,     // The range of the opacity animation (how much it changes during the transition)
  },
  schemaDefaults: {
    visibleOffset: '0',
    hiddenOffset: '10000',
    animationDuration: 1000,
    animationRange: 0.15,
  },
  stateMachine: ({world, eid, schemaAttribute}) => {
    const visibleState = ecs.defineState(LocalState.Visible)
    const hiddenState = ecs.defineState(LocalState.Hidden).initial()
    const {visibleOffset, hiddenOffset, animationDuration, animationRange} = schemaAttribute.get(eid)
    const initialBackgroundOpacity = ecs.Ui.get(world, eid).backgroundOpacity
    let animationProgress = 0
    let animationDirection = 1

    const getAnimationProgress = () => (world.time.elapsed % animationDuration) / animationDuration

    const updateAnimationDirection = (progress: number) => {
      // Reverse direction if animation wraps around
      if (animationProgress > progress) animationDirection *= -1
    }

    const updateUI = (progress: number) => {
      const adjustedProgress = animationDirection === -1 ? 1 - progress : progress
      ecs.Ui.cursor(world, eid).backgroundOpacity = initialBackgroundOpacity + animationRange * adjustedProgress
    }

    /* -------------------------- Visible State -------------------------- */
    visibleState
      .onEvent(GlobalEvent.HideCoachingUI, hiddenState, {target: world.events.globalId})
      .onEnter(() => {
        ecs.Ui.cursor(world, eid).bottom = visibleOffset
        animationProgress = getAnimationProgress()
      })
      .onExit(() => {
        ecs.Ui.cursor(world, eid).bottom = hiddenOffset
      })
      .onTick(() => {
        const newProgress = getAnimationProgress()

        updateAnimationDirection(newProgress)
        updateUI(newProgress)

        animationProgress = newProgress
      })

    /* -------------------------- Hidden State -------------------------- */
    hiddenState
      .onEvent(GlobalEvent.ShowCoachingUI, visibleState, {target: world.events.globalId})
  },
})
