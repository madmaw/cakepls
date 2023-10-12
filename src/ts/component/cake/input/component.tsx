import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Typography
} from '@mui/material';
import type {
  EmittingComponent,
  EmittingComponentProps
} from 'base/component/emitting';
import type { Cake } from 'domain/model';
import { Fragment } from 'react';

export type CakeInputEvents = {
  readonly cake: Cake,
};

export type CakeInputSectionProps = CakeInputEvents;

export type CakeInputSection = {
  readonly key: string,
  readonly title: string | JSX.Element,
  readonly Component: EmittingComponent<CakeInputSectionProps>,
};

export type CakeInputProps = {
  readonly sections: readonly CakeInputSection[],
} & CakeInputEvents;


export function CakeInput({
  cake,
  sections,
  events
}: EmittingComponentProps<CakeInputProps, CakeInputEvents>) {
  return (
    <Fragment>
      {sections.map(({
        key,
        Component,
        title
      }) => (
        <Accordion key={key}>
          <AccordionSummary>
            <Typography>{ title }</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Component
              cake={cake}
              events={events}
            />
          </AccordionDetails>
        </Accordion>
      ))}
    </Fragment>
  );
}
