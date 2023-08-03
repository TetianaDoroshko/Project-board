import { IReorderService } from "../common/types/reorder.service.interface";
import { List } from "../data/models/list";
import { loggerToConsole } from "../logging/helpers/subscribeLoggers";

export class ProxyReorderService implements IReorderService {
  service: IReorderService;

  constructor(service: IReorderService) {
    this.service = service;
  }
  reorder<T>(items: T[], startIndex: number, endIndex: number): T[] {
    loggerToConsole.log(items, startIndex, endIndex);
    return this.service.reorder(items, startIndex, endIndex);
  }
  reorderCards({
    lists,
    sourceIndex,
    destinationIndex,
    sourceListId,
    destinationListId,
  }: {
    lists: List[];
    sourceIndex: number;
    destinationIndex: number;
    sourceListId: string;
    destinationListId: string;
  }): List[] {
    loggerToConsole.log(
      lists,
      sourceIndex,
      destinationIndex,
      sourceListId,
      destinationListId
    );
    return this.service.reorderCards({
      lists,
      sourceIndex,
      destinationIndex,
      sourceListId,
      destinationListId,
    });
  }
}
