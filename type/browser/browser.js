/* @flow */

import type {Address, VirtualTree} from "reflex/type"
import type {Effects} from "reflex/type/effects"
import type {Version} from "../common/prelude"
import * as Devtools from "../common/devtools"
import * as Shell from "./shell"
import * as WebView from "./web-view"
import * as Updater from "./updater"
import * as WebViews from "./web-views"
import * as Input from "./input"
import * as Assistant from "./assistant"
import * as Overlay from "./overlay"
import * as Sidebar from "./sidebar"


export type Model =
  { version: Version
  , shell: Shell.Model
  , input: Input.Model
  , suggestions: Assistant.Model
  , webViews: WebViews.Model
  , sidebar: Sidebar.Model
  , overlay: Overlay.Model
  // , updater: Updater.Model
  , devtools: Devtools.Model
  }

// ### Mode changes

export type CreateWebView =
  { type: "CreateWebView"
  }

export type EditWebView =
  { type: "EditWebView"
  }

export type ShowWebView =
  { type: "ShowWebView"
  }

export type ShowTabs =
  { type: "ShowTabs"
  }

export type SelectWebView
  { type: "SelectWebView"
  }

// ### Actions that affect multilpe sub-components

export type OpenWebView =
  { type: "OpenWebView"
  }

export type AttachSidebar =
  { type: "AttachSidebar"
  };

export type DetachSidebar =
  { type: "DetachSidebar"
  };

export type OverlayClicked =
  { type: "OverlayClicked"
  };

export type SubmitInput =
  { type: "SubmitInput"
  }

export type ExitInput =
  { type: "ExitInput"
  }

export type Escape =
  { type: "Escape"
  }

export type Unload =
  { type: "Unload"
  }

export type Unload =
  { type: "ReloadRuntime"
  }


type WebViewsAction
  = { type: "WebViews"
    , action: WebViews.Action
    }

type InputAction
  = { type: "Input"
    , action: Input.Action
    }

type SidebarAction
  = { type: "Sidebar"
    , action: Sidebar.Action
    }

type OverlayAction
  = { type: "Overlay"
    , action: Overlay.Action
    }

type ShellAction
  = { type: "Shell"
    , action: Shell.Action
    }

type DevtoolsAction
  = { type: "Devtools"
    , action: Devtools.Action
    }

type AssistantAction
  = { type: "Assistant"
    , action: Assistant.Action
    }


export type Action
  = CreateWebView
  | EditWebView
  | ShowWebView
  | ShowTabs
  | SelectWebView

  // Dispatch

  | OpenWebView
  | AttachSidebar
  | DetachSidebar
  | OverlayClicked
  | SubmitInput
  | ExitInput
  | Escape
  | Unload
  | ReloadRuntime

  // Delegate

  | WebViewsAction
  | InputAction
  | SidebarAction
  | OverlayAction
  | ShellAction
  | AssistantAction
  | DevtoolsAction


export type init = () =>
  [Model, Effects<Action>]

export type update = (model:Model, action:Action) =>
  [Model, Effects<Action>]

export type view = (model:Model, address:Address<Action>, children:Array<VirtualTree>) =>
  VirtualTree
