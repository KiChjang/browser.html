/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */
'use strict';

import {Record, Union, List, Maybe, Any} from 'typed-immutable';

// Model

const Animation = Record({
  acceleration: Number,
  velocity: Number,
  time: Number,
  elapsedTime: Number
});

export const Model = Record({
  y: 0,
  beginShrink: 0,
  endShrink: 0,
  isClosing: false,
  acceleration: 0,
  velocity: 0,
  elapsedTime: 0,
  timeStamp: Maybe(Number)
});

// Action

export const BeginSwipe = Record({
  description: 'Begin swiping a card',
  timeStamp: Number
}, 'Preview.EndSwipe');

export const EndSwipe = Record({
  description: 'End swiping a card',
  timeStamp: Number
}, 'Preview.EndSwipe')

export const ContinueSwipe = Record({
  description: 'Continue swiping card',
  timeStamp: Number,
  event: Any,
  y: Number
}, 'Preview.ContinueSwipe');

export const AnimationFrame = Record({
  description: 'Animating a card',
  timeStamp: Number
})

export const Action = Union(BeginSwipe, EndSwipe, ContinueSwipe, AnimationFrame);

const thresholdY = 90;
const fadeDistance = 240;
const dropDistance = 450;
const releaseDistance = 60;
const maxVelocity = 5;
export const shrinkDuration = 100;

export const exitProximity = y =>
  Math.max(0, Math.min(100, (Math.abs(y) - thresholdY) * 100 / fadeDistance));

const physics = (state, action) => {
  const time = Math.max(0, action.timeStamp - state.timeStamp);
  const elapsedTime = state.elapsedTime + time;
  const maxY = thresholdY + dropDistance;
  return state.timeStamp === null ? state :
    state.isClosing ?
      state.merge({
        elapsedTime,
        beginShrink: state.beginShrink > 0 ? state.beginShrink :
                     state.y === maxY || state.y === -1 * maxY ? action.timeStamp :
                     state.beginShrink,
        endShrink: state.beginShrink <= 0 ? state.endShrink :
                    state.endShrink > 0 ? state.endShrink :
                    action.timeStamp - state.beginShrink  > shrinkDuration ? action.timeStamp :
                   state.endShrink,
        timeStamp: state.endShrink > 0 ? null : action.timeStamp,
        velocity: Math.max(-1 * maxVelocity, Math.min(maxVelocity, elapsedTime * state.acceleration)),
        y: Math.max(-1 * maxY, Math.min(maxY, Math.round(state.y + time * state.velocity))),
      }) :
    action instanceof ContinueSwipe ?
      state.merge({
        elapsedTime,
        // `MozSwipeGesture` does not seem to get dispatched
        // (see https://github.com/mozilla/browser.html/issues/571#issuecomment-133168532).
        // To work around lack of release event we use
        // `thresholdY + releaseDistance` as a threshold point past which
        // release is automated. You can think of it as momentum gained after
        // certain distance traveld that makes card out of user control.
        isClosing: Math.abs(action.y) > thresholdY + releaseDistance,
        timeStamp: state.y > 0 && action.y == 0 ? null : action.timeStamp,
        y: action.y,
        velocity: action.y / elapsedTime,
        acceleration: (action.y / elapsedTime) / elapsedTime
      }) :
    state;
};

const release = (state, action) =>
  state.y > thresholdY ? state.set('isClosing', true) : state;

export const update = (state, action) => {
  return action instanceof BeginSwipe ? Model({timeStamp: action.timeStamp}) :
  action instanceof EndSwipe ? release(state, action) :
  action instanceof ContinueSwipe ? physics(state, action) :
  action instanceof AnimationFrame ? physics(state, action) :
  state;
}
