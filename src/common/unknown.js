/* @flow */

/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */


/*:: import * as type from "../../type/common/unknown" */

import {Effects, Task} from "reflex";

export const warn/*:type.warn*/ = (...params) => Task.io(respond => {
  console.warn(...params);
});

export const log/*:type.log*/ = (...params) => Task.io(respond => {
  console.log(...params);
});

export const error/*:type.error*/ = (...params) => Task.io(respond => {
  console.error(...params);
});


export const update/*:type.update*/ = (model, action) => {
  console.warn('Unknown action was passed & ignored: ', action, Error().stack);
  return [model, Effects.none];
};
