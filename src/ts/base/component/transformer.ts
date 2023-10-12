import type { Observer } from 'rxjs';

export type ComponentTransformer<SourceProps, SourceEvents, TargetProps> = {

  consumeSourceEvent(sourceEvent: SourceEvents, targetProps: TargetProps): void;

  extractSourceProps(targetProps: TargetProps): SourceProps;
};

export abstract class AbstractComponentTransformer<SourceProps, SourceEvents, TargetProps, TargetEvents>
implements ComponentTransformer<SourceProps, SourceEvents, TargetProps> {
  constructor(
    protected readonly targetEvents: Observer<TargetEvents>,
  ) {}

  abstract consumeSourceEvent(sourceEvent: SourceEvents, targetProps: TargetProps): void;

  abstract extractSourceProps(targetProps: TargetProps): SourceProps;
}

export abstract class AbstractSynchronousComponentTransformer<SourceProps, SourceEvents, TargetProps, TargetEvents>
  extends AbstractComponentTransformer<SourceProps, SourceEvents, TargetProps, TargetEvents> {

  override consumeSourceEvent(sourceEvent: SourceEvents, targetProps: TargetProps): void {
    this.targetEvents.next(this.transformSourceEvent(sourceEvent, targetProps));
  }

  abstract transformSourceEvent(sourceEvent: SourceEvents, targetProps: TargetProps): TargetEvents;
}

export class PassThroughComponentTransformer<SourceProps, SourceEvents>
  extends AbstractSynchronousComponentTransformer<SourceProps, SourceEvents, SourceProps, SourceEvents> {

  override transformSourceEvent(sourceEvent: SourceEvents): SourceEvents {
    return sourceEvent;
  }

  override extractSourceProps(targetProps: SourceProps): SourceProps {
    return targetProps;
  }
}
