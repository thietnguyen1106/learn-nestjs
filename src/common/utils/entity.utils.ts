import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { CONSTANTS } from 'src/config/constants';

@Injectable()
export class EntityUtils {
  constructor(private readonly dataSource: DataSource) {}

  getRelations({
    entity,
    relations = [],
    isSkipRelations = false,
  }: {
    entity: any;
    relations?: string[];
    isSkipRelations?: boolean;
  }): string[] {
    if (isSkipRelations) {
      return [];
    }

    const metadata = this.dataSource.getMetadata(entity);
    const relationNames = metadata.relations.map(
      (relation) => relation.propertyName,
    );

    if (relations.length) {
      return relationNames.filter((relation) => relations.includes(relation));
    }

    return relationNames;
  }

  getSelect({
    entity,
    properties = [],
    isSkipSensitives = true,
  }: {
    entity: any;
    properties?: string[];
    isSkipSensitives: boolean;
  }): any[] {
    const metadata = this.dataSource.getMetadata(entity);
    let columns = metadata.columns.map((column) => column.propertyName);

    if (isSkipSensitives) {
      columns = columns.filter(
        (column) => !CONSTANTS.SENSITIVE_FIELDS.includes(column),
      );
    }

    if (properties.length > 0) {
      columns = columns.filter((column) => properties.includes(column));
    }

    return columns;
  }
}
