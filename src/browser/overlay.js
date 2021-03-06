/* @flow */

/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import {Effects, html, forward} from "reflex";
import {merge, always} from "../common/prelude";
import {cursor} from "../common/cursor";
import {Style, StyleSheet} from "../common/style";
import * as Easing from "eased";
import * as Stopwatch from "../common/stopwatch";
import * as Unknown from "../common/unknown";

/*:: import * as type from "../../type/browser/overlay" */

const visible/*:type.Visible*/ = 0.1;
const invisible/*:type.Invisible*/ = 0;
const duration = 300;

export const Model/*:type.Overlay*/ =
  ({isCapturing, isVisible}) =>
  ({isCapturing
  , isVisible
  , animation: null
  , display
      : isVisible
      ? {opacity: visible}
      : {opacity: invisible}
  });

export const Click = always({type: "Click"});
export const Show = {type: "Show"};
export const Hide = {type: "Hide"};
export const Fade = {type: "Fade"};

const AnimationAction = action => ({type: "Animation", action});
const Shown = always({type: "Shown"});
const Hidden = always({type: "Hidden"});
const Faded = always({type: "Faded"});


export const init/*:type.init*/ = (isVisible, isCapturing) =>
  [ Model({isVisible, isCapturing})
  , Effects.none
  ];


const updateStopwatch = cursor({
  tag: AnimationAction,
  get: model => model.animation,
  set: (model, animation) => merge(model, {animation}),
  update: Stopwatch.update
});


const animationUpdate = (model, action) => {
  const [{animation}, fx] = updateStopwatch(model, action.action);

  // @TODO: We should not be guessing what is the starnig point
  // that makes no sense & is likely to be incorrect at a times.
  // To fix it we need to ditch this easing library in favor of
  // something that will give us more like spring physics.
  const [begin, end]
    = model.isVisible
    ? [invisible, visible]
    : [visible, invisible];

  return duration > animation.elapsed
    ? [ merge(model, {
          animation,
          display: {
            opacity:
              Easing.ease
              ( Easing.easeOutQuad
              , Easing.float
              , begin
              , end
              , duration
              , animation.elapsed
              )
          }
        })
      , fx
      ]
    : [ merge(model, {animation, display: {opacity: end}})
      , fx.map
          ( model.isVisible
          ? Shown
          : model.isCapturing
          ? Faded
          : Hidden
          )
      ]
}


export const update/*:type.update*/ = (model, action) =>
    action.type === "Animation"
  ? animationUpdate(model, action)
  : action.type === "Shown"
  ? updateStopwatch(model, Stopwatch.End)
  : action.type === "Hidden"
  ? updateStopwatch(model, Stopwatch.End)
  : action.type === "Faded"
  ? updateStopwatch(model, Stopwatch.End)
  : action.type === "Show"
  ? ( model.isVisible
    ? [merge(model, {isCapturing: true}), Effects.none]
    : updateStopwatch(merge(model, {isVisible: true, isCapturing: true}),
                Stopwatch.Start)
    )
  : action.type === "Hide"
  ? ( model.isVisible
    ? updateStopwatch(merge(model, {isVisible: false, isCapturing: false}),
                Stopwatch.Start)
    : [merge(model, {isCapturing: false}), Effects.none]
    )
  : action.type === "Fade"
  ? ( model.isVisible
    ? updateStopwatch(merge(model, {isVisible: false, isCapturing: true}),
                Stopwatch.Start)
    : [merge(model, {isCapturing: true}), Effects.none]
    )
  : action.type === "Click"
  ? [model, Effects.none]
  : Unknown.update(model, action);

const style = StyleSheet.create({
  overlay: {
    background: 'rgb(0, 0, 0)',
    position: 'absolute',
    // @WORKAROUND use percent instead of vw/vh to work around
    // https://github.com/servo/servo/issues/8754
    width: '100%',
    height: '100%'
  }
});

export const view/*:type.view*/ = (model, address) =>
  html.div({
    className: 'overlay',
    style: Style
      ( style.overlay
      , { opacity: model.display.opacity
        , pointerEvents: model.isCapturing ? 'all' : 'none'
        }
      ),
    onClick: forward(address, Click)
  });
