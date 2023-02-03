import type { CKEditor } from "../Ckeditor";
import type { EditorConfig } from "@ckeditor/ckeditor5-core/src/editor/editorconfig";
import type { Features } from "./Configuration";

const enum EventNames {
  Ready = "ckeditor5:ready",
  Reset = "ckeditor5:reset",
  SetupConfiguration = "ckeditor5:setup-configuration",
  SetupFeatures = "ckeditor5:setup-features",
}

type ReadyEventPayload = CKEditor;
type ResetEventPayload = CKEditor;
type SetupFeaturesEventPayload = Features;
type SetupConfigurationEventPayload = {
  configuration: EditorConfig;
  features: Features;
};

class EventDispatcher {
  readonly #element: HTMLElement;

  constructor(element: HTMLElement) {
    this.#element = element;
  }

  ready(payload: ReadyEventPayload): void {
    this.#element.dispatchEvent(
      new CustomEvent<ReadyEventPayload>(EventNames.Ready, {
        detail: payload,
      }),
    );
  }

  reset(payload: ResetEventPayload): void {
    this.#element.dispatchEvent(
      new CustomEvent<ResetEventPayload>(EventNames.Reset, {
        detail: payload,
      }),
    );
  }

  setupConfiguration(payload: SetupConfigurationEventPayload): void {
    this.#element.dispatchEvent(
      new CustomEvent<SetupConfigurationEventPayload>(EventNames.SetupConfiguration, {
        detail: payload,
      }),
    );
  }

  setupFeatures(payload: SetupFeaturesEventPayload): void {
    this.#element.dispatchEvent(
      new CustomEvent<SetupFeaturesEventPayload>(EventNames.SetupFeatures, {
        detail: payload,
      }),
    );
  }
}

class EventListener {
  readonly #element: HTMLElement;

  constructor(element: HTMLElement) {
    this.#element = element;
  }

  ready(callback: (payload: ReadyEventPayload) => void): void {
    this.#element.addEventListener(
      EventNames.Ready,
      (event: CustomEvent<ReadyEventPayload>) => {
        callback(event.detail);
      },
      { once: true },
    );
  }

  reset(callback: (payload: ResetEventPayload) => void): void {
    this.#element.addEventListener(EventNames.Reset, (event: CustomEvent<ResetEventPayload>) => {
      callback(event.detail);
    });
  }

  setupConfiguration(callback: (payload: SetupConfigurationEventPayload) => void): void {
    this.#element.addEventListener(
      EventNames.SetupConfiguration,
      (event: CustomEvent<SetupConfigurationEventPayload>) => {
        callback(event.detail);
      },
      { once: true },
    );
  }

  setupFeatures(callback: (payload: SetupFeaturesEventPayload) => void): void {
    this.#element.addEventListener(
      EventNames.SetupFeatures,
      (event: CustomEvent<SetupFeaturesEventPayload>) => {
        callback(event.detail);
      },
      { once: true },
    );
  }
}

export function dispatchToCkeditor(element: HTMLElement): EventDispatcher {
  return new EventDispatcher(element);
}

export function listenToCkeditor(element: HTMLElement): EventListener {
  return new EventListener(element);
}
