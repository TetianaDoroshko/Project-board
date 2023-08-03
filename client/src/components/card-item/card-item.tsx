import type { DraggableProvided } from "@hello-pangea/dnd";
import React, { useContext } from "react";

import type { Card } from "../../common/types";
import { CopyButton } from "../primitives/copy-button";
import { DeleteButton } from "../primitives/delete-button";
import { Splitter } from "../primitives/styled/splitter";
import { Text } from "../primitives/text";
import { Title } from "../primitives/title";
import { Container } from "./styled/container";
import { Content } from "./styled/content";
import { Footer } from "./styled/footer";
import { SocketContext } from "../../context/socket";
import { CardEvent } from "../../common/enums";

type Props = {
  card: Card;
  isDragging: boolean;
  provided: DraggableProvided;
};

export const CardItem = ({ card, isDragging, provided }: Props) => {
  const socket = useContext(SocketContext);

  // PATTERN:{currying}
  const operateCard = (cardEvent: CardEvent) => (value?: any) => {
    typeof value === "string"
      ? socket.emit(cardEvent, card.id, value)
      : socket.emit(cardEvent, card.id);
  };

  return (
    <Container
      className="card-container"
      isDragging={isDragging}
      ref={provided.innerRef}
      {...provided.draggableProps}
      {...provided.dragHandleProps}
      data-is-dragging={isDragging}
      data-testid={card.id}
      aria-label={card.name}
    >
      <Content>
        <Title
          onChange={operateCard(CardEvent.RENAME)}
          title={card.name}
          fontSize="large"
          bold={true}
        />
        <Text
          text={card.description}
          onChange={operateCard(CardEvent.CHANGE_DESCRIPTION)}
        />
        <Footer>
          <DeleteButton onClick={operateCard(CardEvent.DELETE)} />
          <Splitter />
          <CopyButton onClick={operateCard(CardEvent.COPY)} />
        </Footer>
      </Content>
    </Container>
  );
};
