import styled from '@emotion/styled';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Typography,
} from '@mui/material';
import { useRefExpression } from 'base/component/constant';
import type { EmittingComponentProps } from 'base/component/emitting';
import type { ReactiveComponentProps } from 'base/component/reactive';
import { toReactiveComponent } from 'base/component/reactive';
import {
  Fragment,
  type Key,
  useCallback,
} from 'react';
import type { Observer } from 'rxjs';

import type {
  InputSequenceProps,
  InputSequenceStep,
} from './types';

export type AccordionInputSequenceEvents<T> = {
  readonly expanded: T | null,
};

type AccordionInputSequenceProps<T> = InputSequenceProps<T> & AccordionInputSequenceEvents<T>;

function InternalAccordionInputSequence<T extends Key = Key>({
  steps,
  expanded,
  events,
}: EmittingComponentProps<AccordionInputSequenceProps<T>, AccordionInputSequenceEvents<T>>) {
  return (
    <Fragment>
      {steps.map((step) => (
        <AccordionInputSequenceStep
          key={step.key}
          step={step}
          expanded={expanded === step.key}
          events={events}
        />
      ))}
    </Fragment>
  );
}

const StretchedAccordionDetails = styled(AccordionDetails)`
  display: flex;
  flex-direction: column;
  align-items: stretch;
`;

function AccordionInputSequenceStep<T extends Key = Key>({
  // linter doesn't support nested destructuring
  // eslint-disable-next-line destructuring-newline/object-property-newline
  step: {
    Component,
    key,
    title,
  },
  expanded,
  events,
}: {
  readonly step: InputSequenceStep<T>,
  readonly expanded: boolean,
  readonly events: Observer<AccordionInputSequenceEvents<T>>,
}) {
  const onChange = useCallback(function () {
    events.next({
      expanded: key,
    });
  }, [events, key]);

  return (
    <Accordion
      key={key}
      expanded={expanded}
      onChange={onChange}
    >
      <AccordionSummary>
        <Typography>
          {title}
        </Typography>
      </AccordionSummary>
      <StretchedAccordionDetails>
        <Component />
      </StretchedAccordionDetails>
    </Accordion>
  );
}

export function AccordionInputSequence<T extends Key = Key>(
    props: ReactiveComponentProps<AccordionInputSequenceProps<T>, AccordionInputSequenceEvents<T>>,
) {
  const Impl = useRefExpression(function () {
    return toReactiveComponent<AccordionInputSequenceProps<T>, AccordionInputSequenceEvents<T>>(
      InternalAccordionInputSequence,
    );
  });

  return (
    <Impl {...props} />
  );
}
