import type { Observer } from 'rxjs';

export type ComponentTransformer<SourceProps, TargetProps, SourceEvents> = {

  consumeSourceEvent(sourceEvent: SourceEvents, targetProps: TargetProps): void;

  extractSourceProps(targetProps: TargetProps): SourceProps;
};

export abstract class AbstractComponentTransformer<SourceProps, TargetProps, SourceEvents, TargetEvents>
implements ComponentTransformer<SourceProps, TargetProps, SourceEvents> {
  constructor(
    protected readonly targetEvents: Observer<TargetEvents>,
  ) {}

  abstract consumeSourceEvent(sourceEvent: SourceEvents, targetProps: TargetProps): void;

  abstract extractSourceProps(targetProps: TargetProps): SourceProps;
}

export abstract class AbstractSynchronousComponentTransformer<
  SourceProps,
  TargetProps,
  SourceEvents = SourceProps,
  TargetEvents = TargetProps
> extends AbstractComponentTransformer<SourceProps, TargetProps, SourceEvents, TargetEvents> {

  override consumeSourceEvent(sourceEvent: SourceEvents, targetProps: TargetProps): void {
    this.targetEvents.next(this.transformSourceEvent(sourceEvent, targetProps));
  }

  abstract transformSourceEvent(sourceEvent: SourceEvents, targetProps: TargetProps): TargetEvents;
}

export class PassThroughComponentTransformer<SourceProps, SourceEvents>
  extends AbstractSynchronousComponentTransformer<SourceProps, SourceProps, SourceEvents, SourceEvents> {

  override transformSourceEvent(sourceEvent: SourceEvents): SourceEvents {
    return sourceEvent;
  }

  override extractSourceProps(targetProps: SourceProps): SourceProps {
    return targetProps;
  }
}
