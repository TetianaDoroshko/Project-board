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

  const changeCardName = (name: string): void => {
    socket.emit(CardEvent.RENAME, card.id, name);
  };

  const changeCardDescription = (value: string): void => {
    socket.emit(CardEvent.CHANGE_DESCRIPTION, card.id, value);
  };

  const removeCard = (): void => {
    socket.emit(CardEvent.DELETE, card.id);
  };

  const copyCard = (): void => {
    socket.emit(CardEvent.COPY, card.id);
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
          onChange={changeCardName}
          title={card.name}
          fontSize="large"
          bold={true}
        />
        <Text text={card.description} onChange={changeCardDescription} />
        <Footer>
          <DeleteButton onClick={removeCard} />
          <Splitter />
          <CopyButton onClick={copyCard} />
        </Footer>
      </Content>
    </Container>
  );
};
