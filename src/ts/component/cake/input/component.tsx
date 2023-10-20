import styled from '@emotion/styled';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Typography
} from '@mui/material';
import type { EmittingComponentProps } from 'base/component/emitting';
import { createStatefulComponent } from 'base/component/stateful';
import type {
  ComponentType,
  Key
} from 'react';
import {
  Fragment,
  useCallback
} from 'react';
import type { Observer } from 'rxjs';

export type CakeInputEvents<T> = {
  readonly expanded: T | null,
};

export type CakeInputSection<T> = {
  readonly key: T,
  readonly title: string | JSX.Element,
  readonly Component: ComponentType,
};

export type CakeInputProps<T> = {
  readonly sections: readonly CakeInputSection<T>[],
} & CakeInputEvents<T>;

export const StatefulCakeInput = createStatefulComponent<CakeInputEvents<Key>, {
  readonly sections: readonly CakeInputSection<Key>[],
  readonly events?: never,
}>(CakeInput, {
  expanded: null,
});

export function CakeInput<T extends Key = Key>({
  sections,
  expanded,
  events,
}: EmittingComponentProps<CakeInputProps<T>, CakeInputEvents<T>>) {
  return (
    <Fragment>
      {sections.map(section => (
        <CakeInputSectionComponent
          key={section.key}
          section={section}
          expanded={expanded === section.key}
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

function CakeInputSectionComponent<T extends Key = Key>({
  // linter doesn't support nested destructuring
  // eslint-disable-next-line destructuring-newline/object-property-newline
  section: {
    Component,
    key,
    title,
  },
  expanded,
  events,
}: {
  readonly section: CakeInputSection<T>,
  readonly expanded: boolean,
  readonly events: Observer<CakeInputEvents<T>>
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
        <Typography>{ title }</Typography>
      </AccordionSummary>
      <StretchedAccordionDetails>
        <Component/>
      </StretchedAccordionDetails>
    </Accordion>
  );
}
