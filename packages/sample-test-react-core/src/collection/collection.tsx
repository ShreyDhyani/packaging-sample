import { removeUndefinedValues } from "@ariakit/core/utils/misc";
import type { ElementType } from "react";
import { useWrapElement } from "../utils/hooks.ts";
import { createElement, createHook, forwardRef } from "../utils/system.tsx";
import type { Options, Props } from "../utils/types.ts";
import {
  CollectionScopedContextProvider,
  useCollectionProviderContext,
} from "./collection-context.tsx";
import type { CollectionStore } from "./collection-store.ts";

const TagName = "div" satisfies ElementType;
type TagName = typeof TagName;

export const useCollection = createHook<TagName, CollectionOptions>(
  function useCollection({ store, ...props }) {
    const context = useCollectionProviderContext();
    store = store || context;

    props = useWrapElement(
      props,
      (element) => (
        <CollectionScopedContextProvider value={store}>
          {element}
        </CollectionScopedContextProvider>
      ),
      [store],
    );

    return removeUndefinedValues(props);
  },
);

export const Collection = forwardRef(function Collection(
  props: CollectionProps,
) {
  const htmlProps = useCollection(props);
  return createElement(TagName, htmlProps);
});

export interface CollectionOptions<_T extends ElementType = TagName>
  extends Options {
  store?: CollectionStore;
}

export type CollectionProps<T extends ElementType = TagName> = Props<
  T,
  CollectionOptions<T>
>;
