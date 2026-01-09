"use client";

import React from "react";

const actionTypes = {
  // modal
  OPEN_MODAL: "OPEN_MODAL",
  DISMISS_MODAL: "DISMISS_MODAL",
  // loader
  OPEN_LOADER: "OPEN_LOADER",
  DISMISS_LOADER: "DISMISS_LOADER",
} as const;

type Modals = {
  id: string;
  title?: React.ReactNode | string;
  description?: React.ReactNode | string;
  content?: (({ close }: { close: () => void }) => React.ReactNode) | React.ReactNode;
  header?: React.ReactNode;
  footer?: (({ close }: { close: () => void }) => React.ReactNode) | React.ReactNode;
  centeredTitle?: boolean;
};

type Loaders = {
  id: string;
  content?: React.ReactNode;
  dismissable?: boolean;
  dismissWhen?: boolean;
};

type ActionType = typeof actionTypes;

type Action =
  | {
      type: ActionType["OPEN_MODAL"] | ActionType["OPEN_LOADER"];
      modal?: Modals;
      loader?: Loaders;
    }
  | {
      type: ActionType["DISMISS_MODAL"] | ActionType["DISMISS_LOADER"];
    };

interface State {
  modal: Modals | null;
  loader: Loaders | null;
}

export const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case actionTypes.OPEN_MODAL:
      return {
        ...state,
        modal: action.modal!,
      };

    case actionTypes.DISMISS_MODAL: {
      return {
        ...state,
        modal: null,
      };
    }
    case actionTypes.OPEN_LOADER: {
      return {
        ...state,
        loader: action.loader!,
      };
    }
    case actionTypes.DISMISS_LOADER: {
      return {
        ...state,
        loader: null,
      };
    }
  }
};

const listeners: Array<(state: State) => void> = [];
let memoryState: State = { modal: null, loader: null };

function dispatch(action: Action) {
  const res = reducer(memoryState, action);
  memoryState = res;
  listeners.forEach((listener) => {
    listener(memoryState);
  });
}

function loaders({ content, id, dismissWhen, dismissable }: Loaders) {
  const open = () =>
    dispatch({
      type: actionTypes.OPEN_LOADER,
      loader: {
        content,
        id,
        dismissable,
        dismissWhen,
      },
    });

  const close = () =>
    dispatch({
      type: actionTypes.DISMISS_LOADER,
    });

  return {
    open,
    close,
  };
}

function modals({ title, description, content, id, ...rest }: Modals) {
  const _getFooterContent = () => {
    if (!rest.footer) {
      return;
    }
    if (typeof rest.footer === "function") {
      if (
        React.isValidElement(
          rest.footer({
            close: () => dispatch({ type: actionTypes.DISMISS_MODAL }),
          }),
        )
      ) {
        return rest.footer({
          close: () => dispatch({ type: actionTypes.DISMISS_MODAL }),
        });
      }
    }
    const el = React.cloneElement<{ close: () => void }>(
      rest.footer as React.ReactElement<{ close: () => void }>,
      {
        close: () => dispatch({ type: actionTypes.DISMISS_MODAL }),
      },
    );

    return el;
  };

  const _getContent = () => {
    if (!content) {
      return;
    }
    if (typeof content === "function") {
      if (
        React.isValidElement(
          content({
            close: () => dispatch({ type: actionTypes.DISMISS_MODAL }),
          }),
        )
      ) {
        return content({
          close: () => dispatch({ type: actionTypes.DISMISS_MODAL }),
        });
      }
    }
    const el = React.cloneElement<{ close: () => void }>(
      content as React.ReactElement<{ close: () => void }>,
      {
        close: () => dispatch({ type: actionTypes.DISMISS_MODAL }),
      },
    );

    return el;
  };

  const open = () =>
    dispatch({
      type: actionTypes.OPEN_MODAL,
      modal: {
        title,
        description,
        content: _getContent(),
        id,
        footer: rest.footer ? _getFooterContent() : null,
        ...rest,
      },
    });

  const close = () =>
    dispatch({
      type: actionTypes.DISMISS_MODAL,
    });

  return {
    open,
    close,
    isOpen: memoryState?.modal?.id === id,
  };
}

function useModals() {
  const [state, setState] = React.useState<State>(memoryState);

  React.useEffect(() => {
    listeners.push(setState);
    return () => {
      const index = listeners.indexOf(setState);
      if (index > -1) {
        listeners.splice(listeners.indexOf(setState), 1);
      }
    };
  }, [state]);

  return {
    modals,
    dismiss: () => dispatch({ type: actionTypes.DISMISS_MODAL }),
    requestedModal: state.modal,
    requestedLoader: state.loader,
    isModalOpen: !!state.modal,
  };
}

export { loaders, modals, useModals };
