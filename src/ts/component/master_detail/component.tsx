import styled from '@emotion/styled';
import type { ComponentType } from 'react';

type DirectionProps = {
  readonly direction: 'row' | 'column',
};

const Container = styled.div(({ direction }: DirectionProps) => ({
  display: 'flex',
  flexDirection: direction,
  width: '100%',
  alignItems: 'stretch',
  justifyContent: 'stretch',
}));

const MasterContainer = styled.div({ flexGrow: 0 });

const DetailContainer = styled.div({ flexGrow: 1 });

export function MasterDetail({
  Master,
  Detail,
  direction,
}: {
  readonly Master: ComponentType,
  readonly Detail: ComponentType,
} & DirectionProps) {
  return (
    <Container direction={direction}>
      <MasterContainer>
        <Master />
      </MasterContainer>
      <DetailContainer>
        <Detail />
      </DetailContainer>
    </Container>
  );
}
