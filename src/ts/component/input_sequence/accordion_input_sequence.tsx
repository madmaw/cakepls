import styled from '@emotion/styled';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Typography,
} from '@mui/material';
import type { EmittingComponentProps } from 'base/component/emitting';
import { createStatefulComponent } from 'base/component/stateful';
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

export const StatefulAccordionInputSequence = createStatefulComponent<AccordionInputSequenceEvents<Key>, {
  readonly steps: readonly InputSequenceStep<Key>[],
  readonly events?: never,
}>(AccordionInputSequence, {
  expanded: null,
});

export function AccordionInputSequence<T extends Key = Key>({
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
