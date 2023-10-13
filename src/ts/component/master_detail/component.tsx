import styled from '@emotion/styled';

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
  master,
  detail,
  direction,
}: {
  readonly master: JSX.Element,
  readonly detail: JSX.Element,
} & DirectionProps) {
  return (
    <Container direction={direction}>
      <MasterContainer>
        {master}
      </MasterContainer>
      <DetailContainer>
        {detail}
      </DetailContainer>
    </Container>
  );
}
