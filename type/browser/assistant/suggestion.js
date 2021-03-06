/* @flow */

/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import type {VirtualTree, Address} from "reflex/type"
import type {Effects} from "reflex/type/effects"
import type {Style} from "../../common/style";

export type Model <model> =
  { id: string
  , isSelected: boolean
  , content: model
  }

export type InnerView <model, action> =
  (model:model, address:Address<action>) =>
  Array<VirtualTree>

export type View <model, action> =
  (model:model, address:Address<action>, innerView:InnerView<model, action>) =>
  VirtualTree

export type view = <model:Model, action>
  (model:model, address:Address<action>, innerView:InnerView<model, action>) =>
  VirtualTree

export type {Address, VirtualTree}
