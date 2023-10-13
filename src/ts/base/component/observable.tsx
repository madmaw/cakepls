import {
  type ComponentType,
  useEffect,
  useMemo,
  useState
} from 'react';
import {
  type Observable,
  shareReplay,
  Subject
} from 'rxjs';

export function useObservable<T>(t: T) {
  const subject = useMemo(function () {
    return new Subject<T>();
  }, []);
  const observable = useMemo(function () {
    // TODO does sharing cause memory leaks?
    return subject.pipe(shareReplay(1));
  }, [subject]);
  useEffect(function () {
    subject.next(t);
  }, [subject, t]);
  return observable;
}

export function useObservableValue<T>(observable: Observable<T>, defaultValue: T) {
  const [value, setValue] = useState(defaultValue);
  useEffect(function () {
    const subscription = observable.subscribe(function (v) {
      setValue(v);
    });
    return subscription.unsubscribe.bind(subscription);
  }, [observable]);
  return value;
}

export type ObservableComponentProps<Props, K extends keyof Props> = Omit<Props, K> & {
  readonly [V in K]: Observable<Props[V]>
};

export type ObservableComponent<Props, K extends keyof Props> = ComponentType<ObservableComponentProps<Props, K>>;

// TODO can just use `useObservable`, which is more elegant and versatile
//
export function unwrapObservableComponent<Props, K extends keyof Props>(
    Component: ObservableComponent<Props, K>,
    capturedKey: K,
): ComponentType<Props> {
  // TODO usage generates compiler warnings
  //const MemoisedComponent = memo(Component);
  return function({
    [capturedKey]: capturedValue,
    ...props
  }: Props) {
    const observable = useObservable(capturedValue);
    // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
    const observableProps = {
      ...props,
      [capturedKey]: observable,
    } as ObservableComponentProps<Props, K>;

    return (
      <Component
        {...observableProps}
      />
    );
  };
}

// TODO can just use `useObjectableValue`
export function wrapUnobservableComponent<Props, K extends keyof Props>(
    Component: ComponentType<Props>,
    observableKey: K,
    defaultValue: Props[K],
): ObservableComponent<Props, K> {
  // TODO usage generates compiler warnings
  //const MemoisedComponent = memo(Component);

  return function({
    [observableKey]: observable,
    ...observableProps
  }: ObservableComponentProps<Props, K>) {
    // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
    const value = useObservableValue(observable as Observable<Props[K]>, defaultValue);
    // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
    const props = {
      ...observableProps,
      [observableKey]: value,
    } as Props & JSX.IntrinsicAttributes;
    return (
      <Component
        {...props}
      />
    );
  };
}
