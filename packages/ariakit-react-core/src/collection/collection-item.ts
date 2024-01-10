import { useEffect, useRef } from "react";
import type { CollectionStoreItem } from "@ariakit/core/collection/collection-store";
import { identity } from "@ariakit/core/utils/misc";
import { useId, useMergeRefs } from "../utils/hooks.js";
import { createComponent, createElement, createHook } from "../utils/system.js";
import type { As, Options, Props } from "../utils/types.js";
import { useCollectionContext } from "./collection-context.js";
import type { CollectionStore } from "./collection-store.js";

/**
 * Returns props to create a `CollectionItem` component. This hook will register
 * the item in the collection store. If this hook is used in a component that is
 * wrapped by `Collection` or a component that implements `useCollection`,
 * there's no need to explicitly pass the `store` prop.
 * @see https://ariakit.org/components/collection
 * @example
 * ```jsx
 * const store = useCollectionStore();
 * const props = useCollectionItem({ store });
 * <Role {...props}>Item</Role>
 * ```
 */
export const useCollectionItem = createHook<CollectionItemOptions>(
  ({
    store,
    shouldRegisterItem = true,
    getItem = identity,
    // @ts-expect-error This prop may come from a collection renderer.
    element,
    ...props
  }) => {
    const context = useCollectionContext();
    store = store || context;

    const id = useId(props.id);
    const ref = useRef<HTMLDivElement>(element);

    useEffect(() => {
      const element = ref.current;
      if (!id) return;
      if (!element) return;
      if (!shouldRegisterItem) return;
      const item = getItem({ id, element });
      return store?.renderItem(item);
    }, [id, shouldRegisterItem, getItem, store]);

    props = {
      ...props,
      ref: useMergeRefs(ref, props.ref),
    };

    return props;
  },
);

/**
 * Renders an item in a collection. The collection store can be passed
 * explicitly through the
 * [`store`](https://ariakit.org/reference/collection-item#store) prop or
 * implicitly through the parent
 * [`Collection`](https://ariakit.org/reference/collection) component.
 * @see https://ariakit.org/components/collection
 * @example
 * ```jsx
 * const store = useCollectionStore();
 * <CollectionItem store={store}>Item 1</CollectionItem>
 * <CollectionItem store={store}>Item 2</CollectionItem>
 * <CollectionItem store={store}>Item 3</CollectionItem>
 * ```
 */
export const CollectionItem = createComponent<CollectionItemOptions>(
  (props) => {
    const htmlProps = useCollectionItem(props);
    return createElement("div", htmlProps);
  },
);

if (process.env.NODE_ENV !== "production") {
  CollectionItem.displayName = "CollectionItem";
}

export interface CollectionItemOptions<T extends As = "div">
  extends Options<T> {
  /**
   * Object returned by the
   * [`useCollectionStore`](https://ariakit.org/reference/use-collection-store)
   * hook. If not provided, the closest
   * [`Collection`](https://ariakit.org/reference/collection) or
   * [`CollectionProvider`](https://ariakit.org/reference/collection-provider)
   * components' context will be used.
   *
   * Live examples:
   * - [Navigation Menubar](https://ariakit.org/examples/menubar-navigation)
   */
  store?: CollectionStore;
  /**
   * The unique ID of the item. This will be used to register the item in the
   * store and for the element's `id` attribute. If not provided, a unique ID
   * will be automatically generated.
   *
   * Live examples:
   * - [Combobox with tabs](https://ariakit.org/examples/combobox-tabs)
   * - [Tab with React Router](https://ariakit.org/examples/tab-react-router)
   */
  id?: string;
  /**
   * Whether the item should be registered as part of the collection.
   *
   * Live examples:
   * - [Combobox with tabs](https://ariakit.org/examples/combobox-tabs)
   * @default true
   */
  shouldRegisterItem?: boolean;
  /**
   * A memoized function that returns props to be passed with the item during
   * its registration in the store.
   * @example
   * ```jsx
   * const getItem = useCallback((data) => ({ ...data, custom: true }), []);
   * <CollectionItem getItem={getItem} />
   * ```
   */
  getItem?: (props: CollectionStoreItem) => CollectionStoreItem;
}

export type CollectionItemProps<T extends As = "div"> = Props<
  CollectionItemOptions<T>
>;
