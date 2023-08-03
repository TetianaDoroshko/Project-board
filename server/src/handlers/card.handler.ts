import type { Socket } from "socket.io";

import { CardEvent, LogEvent, LogFile } from "../common/enums";
import { Card } from "../data/models/card";
import { SocketHandler } from "./socket.handler";

export class CardHandler extends SocketHandler {
  public handleConnection(socket: Socket): void {
    socket.on(CardEvent.CREATE, this.createCard.bind(this));
    socket.on(CardEvent.REORDER, this.reorderCards.bind(this));
    socket.on(CardEvent.RENAME, this.renameCard.bind(this));
    socket.on(
      CardEvent.CHANGE_DESCRIPTION,
      this.changeDescriptionCard.bind(this)
    );
    socket.on(CardEvent.COPY, this.copyCard.bind(this));
    socket.on(CardEvent.DELETE, this.deleteCard.bind(this));
  }

  public createCard(listId: string, cardName: string): void {
    const newCard = new Card(cardName, "");
    const lists = this.db.getData();

    const updatedLists = lists.map((list) =>
      list.id === listId ? list.setCards(list.cards.concat(newCard)) : list
    );

    this.db.setData(updatedLists);
    this.updateLists();
    this.events.notify(LogEvent.INFO, {
      client: this.socket.id,
      action: CardEvent.CREATE,
      entity: newCard.id,
    });
  }

  private reorderCards({
    sourceIndex,
    destinationIndex,
    sourceListId,
    destinationListId,
  }: {
    sourceIndex: number;
    destinationIndex: number;
    sourceListId: string;
    destinationListId: string;
  }): void {
    const lists = this.db.getData();
    const reordered = this.reorderService.reorderCards({
      lists,
      sourceIndex,
      destinationIndex,
      sourceListId,
      destinationListId,
    });
    this.db.setData(reordered);
    this.updateLists();
    this.events.notify(LogEvent.INFO, {
      client: this.socket.id,
      action: CardEvent.REORDER,
      entity: "",
    });
  }

  private renameCard(cardId: string, cardName: string): void {
    const lists = this.db.getData();
    const updatedLists = lists.map((list) => {
      list.cards.map((card) => {
        if (card.id === cardId) {
          card.name = cardName;
        }
        return card;
      });
      return list;
    });

    this.db.setData(updatedLists);
    this.updateLists();
    this.events.notify(LogEvent.INFO, {
      client: this.socket.id,
      action: CardEvent.RENAME,
      entity: cardId,
    });
  }

  private changeDescriptionCard(cardId: string, text: string): void {
    const lists = this.db.getData();
    const updatedLists = lists.map((list) => {
      list.cards.map((card) => {
        if (card.id === cardId) {
          card.description = text;
        }
        return card;
      });
      return list;
    });

    this.db.setData(updatedLists);
    this.updateLists();
    this.events.notify(LogEvent.INFO, {
      client: this.socket.id,
      action: CardEvent.CHANGE_DESCRIPTION,
      entity: cardId,
    });
  }
  // PATTERN:{Prototype}
  private copyCard(cardId: string): void {
    const lists = this.db.getData();
    lists.forEach((list) => {
      list.cards.forEach((card) => {
        if (card.id === cardId) {
          list.cards.push(card.clone());
        }
      });
    });
    this.updateLists();
    this.events.notify(LogEvent.INFO, {
      client: this.socket.id,
      action: CardEvent.COPY,
      entity: cardId,
    });
  }

  private deleteCard(cardId: string): void {
    const lists = this.db.getData();
    const updatedLists = lists.map((list) => {
      list.cards = list.cards.filter((card) => card.id !== cardId);
      return list;
    });
    this.db.setData(updatedLists);
    this.updateLists();
    this.events.notify(LogEvent.INFO, {
      client: this.socket.id,
      action: CardEvent.DELETE,
      entity: cardId,
    });
  }
}
